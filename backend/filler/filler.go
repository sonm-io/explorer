package filler

import (
	"context"
	"fmt"
	"github.com/sonm-io/core/blockchain"
	"github.com/sonm-io/explorer/backend/db"
	"github.com/sonm-io/explorer/backend/types"
	"log"
	"math/big"
	"sync"
)

type Filler struct {
	client blockchain.CustomEthereumClient
	db     *db.Connection

	loadChan chan uint64

	state struct {
		mu sync.Mutex

		lastBlock uint64
		bestBlock uint64
	}
}

func NewFiller(cfg *Config, db *db.Connection) (*Filler, error) {
	client, err := blockchain.NewClient(cfg.Filler.Endpoint)
	if err != nil {
		return nil, err
	}

	return &Filler{
		client:   client,
		db:       db,
		loadChan: make(chan uint64, 500),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {

	done := make(chan bool)
	go func() { done <- true }()

	for {
		select {
		case <-done:
			go func() {
				err := f.loadBestBlock()
				if err != nil {
					return
				}
				err = f.loadLastBlock(ctx)
				if err != nil {
					return
				}
				log.Printf("last block: %d", f.state.lastBlock)
				log.Printf("best known block: %d", f.state.bestBlock)

				if f.state.bestBlock < f.state.lastBlock {
					var intervalCount = 0
					for i := f.state.bestBlock + 1; i < f.state.lastBlock; i++ {
						intervalCount++
						if intervalCount > 3000 {
							done <- true
							return
						}
						f.loadChan <- i
					}
				}
			}()
		case <-done:
			intervals, err := f.db.GetUnfilledIntervals()
			if err != nil {
				return err
			}

			go func() {
				var intervalCount = 0
				for _, interval := range intervals {
					for i := interval.Start; i <= interval.Finish; i++ {
						intervalCount++
						if intervalCount > 1000 {
							done <- true
							return
						}
						f.loadChan <- i
					}
				}
				done <- true
			}()
		case number := <-f.loadChan:
			go func() {
				block, err := f.fillBlock(ctx, big.NewInt(0).SetUint64(number))
				if err != nil {
					log.Println(err)
					return
				}
				log.Println("block filled: ", number)

				err = f.db.SaveBlock(block)
				if err != nil {
					log.Printf("failed to save block: %d, %v", number, err)
					return
				}
				log.Println("block saved: ", number)
			}()
		}
	}
}

func (f *Filler) loadLastBlock(ctx context.Context) error {
	lastBlockNumber, err := f.client.GetLastBlock(ctx)
	if err != nil {
		return err
	}
	if !lastBlockNumber.IsUint64() {
		return fmt.Errorf("lastBlockNumber is not unit64")
	}
	f.state.mu.Lock()
	f.state.lastBlock = lastBlockNumber.Uint64()
	f.state.mu.Unlock()
	return nil
}

func (f *Filler) loadBestBlock() error {
	bestBlockNumber, err := f.db.GetBestBlock()
	if err != nil {
		return err
	}

	f.state.mu.Lock()
	f.state.bestBlock = bestBlockNumber
	f.state.mu.Unlock()
	return nil
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
