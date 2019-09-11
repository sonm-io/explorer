package filler

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/lib/pq"
	"github.com/sonm-io/core/blockchain"
	"go.uber.org/zap"

	"github.com/sonm-io/explorer/backend/storage"
	"github.com/sonm-io/explorer/backend/types"
)

const (
	// skipBlocksFromTail shows
	// how many blocks we should
	// count as "very last" ones.
	// We must skip those blocks because
	// they may be uncle block.
	skipBlocksFromTail = 5
)

type Filler struct {
	db          *storage.Storage
	log         *zap.Logger
	client      blockchain.CustomEthereumClient
	loadChan    chan uint64
	concurrency int
}

func NewFiller(cfg *Config, log *zap.Logger) (*Filler, error) {
	client, err := blockchain.NewClient(cfg.Geth.Endpoint)
	if err != nil {
		return nil, err
	}

	s, err := storage.NewStorage(&cfg.Database)
	if err != nil {
		return nil, err
	}

	return &Filler{
		db:          s,
		log:         log,
		client:      client,
		loadChan:    make(chan uint64, cfg.Filler.Concurrency),
		concurrency: int(cfg.Filler.Concurrency),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {
	f.log.Info("starting filler", zap.Int("concurrency", f.concurrency))
	defer f.log.Info("stopping filler")

	doneFill := make(chan bool)
	go func() { doneFill <- true }()
	tk := time.NewTicker(1 * time.Minute)

	for i := 0; i < f.concurrency; i++ {
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
			select {
			case <-tk.C:
				go func() {
					defer func() {
						doneFill <- true
					}()

					f.log.Info("start processing unfilled intervals")

					intervals, err := f.db.GetUnfilledIntervals(ctx)
					if err != nil {
						f.log.Error("failed to get unfilled intervals", zap.Error(err))
						return
					}

					for _, interval := range intervals {
						for i := interval.Start; i >= interval.Finish; i++ {
							f.loadChan <- i
						}
					}
					f.log.Info("finish processing unfilled intervals", zap.Int32("intervals_count", int32(len(intervals))))
				}()
			default:
				go func() {
					defer func() {
						doneFill <- true
					}()

					reqCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
					defer cancel()

					// get the last block from DB: it is where we'd stop
					// working previously.
					lastKnownBlock, err := f.getLastKnownBlock(ctx)
					if err != nil {
						f.log.Error("failed to load last known block", zap.Error(err))
						return
					}

					// get last block mined in blockchain: it is the last
					// data we must obtain and process.
					lastBlockInChain, err := f.getLastBlockInChain(reqCtx)
					if err != nil {
						f.log.Error("failed to load last block in chain", zap.Error(err))
						return
					}

					f.log.Info("blocks info fetched",
						zap.Uint64("last_known", lastKnownBlock),
						zap.Uint64("in_chain", lastBlockInChain),
						zap.Uint64("delta", lastBlockInChain-lastKnownBlock))

					if lastKnownBlock < lastBlockInChain {
						for i := lastKnownBlock + 1; i < lastBlockInChain; i++ {
							f.loadChan <- i
						}
					}
				}()
			}
		}
	}
}

func (f *Filler) Stop() {
	defer f.db.Close()
}

func (f *Filler) getLastBlockInChain(ctx context.Context) (uint64, error) {
	lastBlockNumber, err := f.client.GetLastBlock(ctx)
	if err != nil {
		return 0, err
	}
	if !lastBlockNumber.IsUint64() {
		return 0, fmt.Errorf("lastBlockNumber is not unit64")
	}

	return lastBlockNumber.Uint64() - skipBlocksFromTail, nil
}

func (f *Filler) getLastKnownBlock(ctx context.Context) (uint64, error) {
	bestBlockNumber, err := f.db.GetBestBlock(ctx)
	if err != nil {
		return 0, err
	}

	return bestBlockNumber, nil
}

func (f *Filler) processBlock(ctx context.Context, number uint64) {
	f.log.Debug("processing block", zap.Uint64("block", number))

	block, err := types.FillNewBlock(ctx, f.client, big.NewInt(0).SetUint64(number))
	if err != nil {
		f.log.Error("failed to load block data", zap.Uint64("block", number), zap.Error(err))
		go f.retryBlockSaving(number)
		return
	}

	f.log.Debug("block data fetched", zap.Uint64("block", number))
	if err = f.db.ProcessBlock(ctx, block); err != nil {
		if isUniqueViolationError(err) {
			f.log.Debug("block already in db, skipping", zap.Uint64("block", number))
			return
		}

		f.log.Error("failed to save block data", zap.Uint64("block", number), zap.Error(err))
		go f.retryBlockSaving(number)
		return
	}

	f.log.Info("block data saved", zap.Uint64("block", number))
}

func (f *Filler) retryBlockSaving(n uint64) {
	f.log.Debug("retrying", zap.Uint64("block", n))
	f.loadChan <- n
}

func isUniqueViolationError(err error) bool {
	dbe, ok := err.(*pq.Error)
	if !ok {
		// if we're returning wrapped error somewhere.
		// Yup, I really love error handling in Go.
		return strings.Contains(err.Error(), "pq: duplicate key value violates unique constraint")
	}

	// https://www.postgresql.org/docs/9.3/errcodes-appendix.html
	return dbe.Code == "23505"
}
