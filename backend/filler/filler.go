package filler

import (
	"context"
	"github.com/sonm-io/core/blockchain"
	"github.com/sonm-io/explorer/backend/db"
	"github.com/sonm-io/explorer/backend/types"
	"log"
	"math/big"
	"time"
)

type Filler struct {
	client blockchain.CustomEthereumClient
	db     *db.Connection

	saveChan chan *types.Block
	loadChan chan uint64
}

func NewFiller(cfg *Config, db *db.Connection) (*Filler, error) {
	client, err := blockchain.NewClient(cfg.Filler.Endpoint)
	if err != nil {
		return nil, err
	}

	return &Filler{
		client:   client,
		db:       db,
		saveChan: make(chan *types.Block),
		loadChan: make(chan uint64),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {
	lastBlockNumber, err := f.client.GetLastBlock(ctx)
	if err != nil {
		return err
	}
	bestBlockNumber, err := f.db.GetBestBlock()
	if err != nil {
		return err
	}

	log.Printf("last block: %d", lastBlockNumber)
	log.Printf("best known block: %d", bestBlockNumber)

	go func() {
		if bestBlockNumber < lastBlockNumber.Uint64() {
			for i := bestBlockNumber + 1; i < lastBlockNumber.Uint64(); i++ {
				f.loadChan <- i
			}
		}
	}()

	t3sec := time.NewTicker(3 * time.Second)
	defer t3sec.Stop()
	t10sec := time.NewTicker(10 * time.Second)
	defer t10sec.Stop()

	dbPool := make(chan int8, 2000)

	for {
		select {
		case <-t10sec.C:
			intervals, err := f.db.GetUnfilledIntervals()
			if err != nil {
				return err
			}

			go func() {
				for _, interval := range intervals {
					for i := interval.Start; i <= interval.Finish; i++ {
						f.loadChan <- i
					}
				}
			}()
		case <-t3sec.C:
			go func() {
				lastBlockNumber, err := f.client.GetLastBlock(ctx)
				if err != nil {
					return
				}
				bestBlockNumber, err := f.db.GetBestBlock()
				if err != nil {
					return
				}

				log.Printf("last block: %d", lastBlockNumber)
				log.Printf("best known block: %d", bestBlockNumber)

				go func() {
					if bestBlockNumber < lastBlockNumber.Uint64() {
						for i := bestBlockNumber + 1; i < lastBlockNumber.Uint64(); i++ {
							f.loadChan <- i
						}
					}
				}()
			}()
		case number := <-f.loadChan:
			go func() {
				block, err := f.fillBlock(ctx, big.NewInt(0).SetUint64(number))
				if err != nil {
					log.Println(err)
					return
				}
				log.Println("block filled: ", number)
				f.saveChan <- block
			}()
		case block := <-f.saveChan:
			dbPool <- 1
			go func() {
				err = f.db.SaveBlock(block)
				if err != nil {
					log.Println(err)
					return
				}
				log.Println("block saved: ", block.Block.Number().Uint64())
				<-dbPool
			}()
		}
	}
}

func (f *Filler) fillBlock(ctx context.Context, number *big.Int) (*types.Block, error) {
	result := &types.Block{}
	block, err := f.client.BlockByNumber(ctx, number)
	if err != nil {
		return nil, err
	}
	result.Block = block
	for _, tx := range block.Transactions() {
		rec, err := f.client.GetTransactionReceipt(ctx, tx.Hash())
		if err != nil {
			return nil, err
		}
		result.Transactions = append(result.Transactions, rec)
	}
	return result, nil
}
