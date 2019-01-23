package filler

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"time"

	"github.com/sonm-io/core/blockchain"
	"github.com/sonm-io/explorer/backend/storage"
	"github.com/sonm-io/explorer/backend/types"
)

const concurrency = 50

type Filler struct {
	client   blockchain.CustomEthereumClient
	db       *storage.Storage
	loadChan chan uint64
}

func NewFiller(cfg *Config) (*Filler, error) {
	client, err := blockchain.NewClient(cfg.Filler.Endpoint)
	if err != nil {
		return nil, err
	}

	s, err := storage.NewStorage(cfg.Database)
	if err != nil {
		return nil, err
	}

	return &Filler{
		client:   client,
		db:       s,
		loadChan: make(chan uint64, concurrency),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {
	doneFill := make(chan bool)
	doneIntervals := make(chan bool)
	go func() { doneFill <- true }()

	for i := 0; i < concurrency; i++ {
		go func() {
			for number := range f.loadChan {
				f.processBlock(ctx, number)
			}
		}()
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-doneFill:
			go func() {
				defer func() {
					doneIntervals <- true
				}()

				lastKnownBlock, err := f.loadBestBlock(ctx)
				if err != nil {
					log.Printf("failed to load last known block: %v", err)
					return
				}

				reqCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
				defer cancel()

				lastBlockInChain, err := f.loadLastBlock(reqCtx)
				if err != nil {
					log.Printf("failed to load last block in blockchain: %v", err)
					return
				}

				log.Printf("last known block = %v; last block in chain = %v", lastKnownBlock, lastBlockInChain)
				if lastKnownBlock < lastBlockInChain {
					log.Printf("blocks delta = %v", lastBlockInChain-lastKnownBlock)

					for i := lastKnownBlock + 1; i < lastBlockInChain; i++ {
						f.loadChan <- i
					}
				}
			}()
		case <-doneIntervals:
			go func() {
				defer func() {
					doneFill <- true
				}()

				intervals, err := f.db.GetUnfilledIntervals(ctx)
				if err != nil {
					log.Printf("failed to get unfilled intervals: %v", err)
					return
				}

				for _, interval := range intervals {
					for i := interval.Start; i <= interval.Finish; i++ {
						f.loadChan <- i
					}
				}
			}()
		}
	}
}

func (f *Filler) Stop() {
	defer f.db.Close()
}

func (f *Filler) loadLastBlock(ctx context.Context) (uint64, error) {
	lastBlockNumber, err := f.client.GetLastBlock(ctx)
	if err != nil {
		return 0, err
	}
	if !lastBlockNumber.IsUint64() {
		return 0, fmt.Errorf("lastBlockNumber is not unit64")
	}

	return lastBlockNumber.Uint64(), nil
}

func (f *Filler) loadBestBlock(ctx context.Context) (uint64, error) {
	bestBlockNumber, err := f.db.GetBestBlock(ctx)
	if err != nil {
		return 0, err
	}

	return bestBlockNumber, nil
}

func (f *Filler) processBlock(ctx context.Context, number uint64) {
	block, err := types.FillNewBlock(ctx, f.client, big.NewInt(0).SetUint64(number))
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("block filled: ", number)

	if err = f.db.ProcessBlock(ctx, block); err != nil {
		log.Printf("failed to save block: %d, %v", number, err)
		return
	}

	log.Println("block saved: ", number)
}
