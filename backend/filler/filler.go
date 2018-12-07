package filler

import (
	"context"
	"fmt"
	"github.com/sonm-io/core/blockchain"
	"github.com/sonm-io/explorer/backend/storage"
	"github.com/sonm-io/explorer/backend/types"
	"log"
	"math/big"
	"sync"
	"time"
)

type Filler struct {
	client blockchain.CustomEthereumClient
	db     *storage.Storage

	loadChan chan uint64

	state struct {
		mu sync.Mutex

		lastBlock uint64
		bestBlock uint64
	}
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
		loadChan: make(chan uint64, 100),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {

	doneFill := make(chan bool)
	doneIntervals := make(chan bool)
	sem := make(chan struct{}, 50)
	go func() { doneFill <- true }()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-doneFill:
			go func() {
				err := f.loadBestBlock()
				if err != nil {
					return
				}

				reqCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
				defer cancel()

				err = f.loadLastBlock(reqCtx)
				if err != nil {
					return
				}

				log.Printf("last block: %d", f.state.lastBlock)
				log.Printf("best known block: %d", f.state.bestBlock)

				if f.state.bestBlock < f.state.lastBlock {
					for i := f.state.bestBlock + 1; i < f.state.lastBlock; i++ {
						f.loadChan <- i
					}
				}
				doneIntervals <- true
			}()
		case <-doneIntervals:
			go func() {
				intervals, err := f.db.GetUnfilledIntervals()
				if err != nil {
					return
				}

				for _, interval := range intervals {
					for i := interval.Start; i <= interval.Finish; i++ {
						f.loadChan <- i
					}
				}
				doneFill <- true
			}()
		case number := <-f.loadChan:
			sem <- struct{}{}
			go func() {
				block := &types.Block{}
				err := block.FillBlock(ctx, f.client, big.NewInt(0).SetUint64(number))
				if err != nil {
					log.Println(err)
					return
				}
				log.Println("block filled: ", number)

				err = f.db.ProcessBlock(block)
				if err != nil {
					log.Printf("failed to save block: %d, %v", number, err)
					return
				}
				log.Println("block saved: ", number)
				<-sem
			}()
		}
	}
}

func (f *Filler) Stop() {
	defer f.db.Close()
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
