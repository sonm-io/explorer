package filler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
	"github.com/sonm-io/explorer/db"
	fTypes "github.com/sonm-io/explorer/types"
	"log"
	"math/big"
	"time"
)

type Filler struct {
	client blockchain.CustomEthereumClient
	db     *db.Connection

	saveChan chan *fTypes.Block
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
		saveChan: make(chan *fTypes.Block),
		loadChan: make(chan uint64),
	}, nil
}

func (f *Filler) Start(ctx context.Context) error {
	lastBlockNumber, err := f.client.GetLastBlock(ctx)
	if err != nil {
		return err
	}
	bestBlockNumber, err := f.GetBestBlock()
	if err != nil {
		return err
	}

	log.Printf("last block: %d", lastBlockNumber)
	log.Printf("best known block: %d", bestBlockNumber)

	go func() {
		if bestBlockNumber < lastBlockNumber.Uint64() {
			for i := bestBlockNumber + 1; i < lastBlockNumber.Uint64(); i++ {
				log.Println("found new block", i)
				f.loadChan <- i
			}
		}
	}()

	t5sec := time.NewTicker(5 * time.Second)
	defer t5sec.Stop()

	for {
		select {
		case <-t5sec.C:
			go func() {
				intervals, err := f.GetUnfilledIntervals()
				if err != nil {
					return
				}

				for _, interval := range intervals {
					for i := interval.Start; i <= interval.Finish; i++ {
						log.Println("found new block", i)
						f.loadChan <- i
					}
				}
			}()
		case number := <-f.loadChan:
			go func() {
				log.Println("start processing block: ", number)
				block, err := f.fillBlock(ctx, big.NewInt(0).SetUint64(number))
				if err != nil {
					return
				}
				f.saveChan <- block
			}()
		case block := <-f.saveChan:
			go func() {
				err = f.saveBlock(block)
				if err != nil {
					return
				}
				log.Println("block saved: ", block.Block.Number().Uint64())
			}()
		}
	}
}

func (f *Filler) fillBlock(ctx context.Context, number *big.Int) (*fTypes.Block, error) {
	result := &fTypes.Block{}
	block, err := f.loadBlock(ctx, number)
	if err != nil {
		return nil, err
	}
	result.Block = block
	for _, tx := range block.Transactions() {
		rec, err := f.loadTransactionReceipt(ctx, tx.Hash())
		if err != nil {
			return nil, err
		}
		result.Transactions = append(result.Transactions, rec)
	}
	return result, nil
}

func (f *Filler) loadBlock(ctx context.Context, number *big.Int) (*types.Block, error) {
	return f.client.BlockByNumber(ctx, number)
}

func (f *Filler) loadTransactionReceipt(ctx context.Context, hash common.Hash) (*types.Receipt, error) {
	return f.client.TransactionReceipt(ctx, hash)
}

func (f *Filler) saveBlock(block *fTypes.Block) error {
	t, err := f.db.NewTransaction()
	if err != nil {
		return err
	}

	bloom := common.Bytes2Hex(block.Block.Bloom().Bytes())

	size := big.NewInt(0).SetUint64(uint64(block.Block.Size()))

	extra := common.Bytes2Hex(block.Block.Extra())

	_, err = t.Exec(`INSERT INTO blocks(
			number,
			hash,
			"parentHash",
			nonce,
			"sha3Uncles",
			"logsBloom",
			"transactionsRoot",
			"stateRoot",
			"receiptsRoot",
			miner,
			difficulty,
			"totalDifficulty",
			size,
			"extraData",
			"gasLimit",
			"gasUsed",
			timestamp,
			"mixhash",
			"txCount"
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
		block.Block.NumberU64(),
		block.Block.Hash().String(),
		block.Block.ParentHash().String(),
		block.Block.Nonce(),
		block.Block.UncleHash().String(),
		bloom,
		block.Block.TxHash().String(),
		block.Block.Root().String(),
		block.Block.ReceiptHash().String(),
		block.Block.Coinbase().String(),
		block.Block.Difficulty().Uint64(),
		0, // TODO: add total difficulty field
		size.Uint64(),
		extra,
		block.Block.GasLimit(),
		block.Block.GasUsed(),
		block.Block.Time().Uint64(),
		block.Block.MixDigest().String(),
		len(block.Transactions))
	if err != nil {
		log.Fatalf("error while inserting block: %s", err)
		return err
	}
	for _, receipt := range block.Transactions {
		tx := block.Block.Transaction(receipt.TxHash)

		v, r, s := tx.RawSignatureValues()

		data := common.Bytes2Hex(tx.Data())

		_, err := t.Exec(
			`INSERT INTO transactions(
				hash,
				nonce ,
				"blockHash",
				"blockNumber",
				"transactionIndex",
				"from",
				"to",
				"value",
				gas,
				"gasPrice",
				input,
				v,
				r,
				s) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
			tx.Hash().String(),
			tx.Nonce(),
			block.Block.Hash().String(),
			block.Block.NumberU64(),
			0,  // TODO: add transaction index
			"", // TODO: add from
			tx.To().String(),
			tx.Value().Uint64(),
			tx.Gas(),
			tx.GasPrice().Uint64(),
			data,
			v.String(),
			r.String(),
			s.String())
		if err != nil {
			log.Fatalf("error while inserting transaction: %s", err)
			return err
		}
	}
	err = t.Commit()
	if err != nil {
		return err
	}
	return nil
}

func (f *Filler) GetBestBlock() (uint64, error) {
	conn := f.db.DBConnection()
	rows, err := conn.Query(`SELECT coalesce(max(number), 0) AS bestBlock FROM blocks;`)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var bestBlock uint64
	rows.Next()
	err = rows.Scan(&bestBlock)
	if err != nil {
		return 0, err
	}
	return bestBlock, nil
}

func (f *Filler) GetUnfilledIntervals() ([]fTypes.Interval, error) {
	conn := f.db.DBConnection()
	rows, err := conn.Query(`
		SELECT number + 1 as start_interval, next_id - 1 as finish_interval
		FROM (SELECT number, LEAD(number)OVER (ORDER BY number) AS next_id FROM blocks)T
		WHERE number + 1 <> next_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var s []fTypes.Interval

	for rows.Next() {
		var t fTypes.Interval
		err := rows.Scan(&t.Start, &t.Finish)
		if err != nil {
			return nil, err
		}
		s = append(s, t)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return s, nil
}
