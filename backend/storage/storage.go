package storage

import (
	"context"
	"database/sql"
	"fmt"
	"math/big"
	"strconv"

	"github.com/ethereum/go-ethereum/common"
	eth "github.com/ethereum/go-ethereum/core/types"
	_ "github.com/lib/pq"
	"github.com/sonm-io/explorer/backend/types"
)

type Storage struct {
	db *sql.DB
}

type Config struct {
	User     string `yaml:"user" default:"app"`
	Password string `yaml:"password" default:"app"`
	Database string `yaml:"database" default:"app"`
	Port     uint16 `yaml:"port" default:"5432"`
	Host     string `yaml:"host" default:"localhost"`
}

func NewStorage(cfg *Config) (*Storage, error) {
	connStr := getConnString(cfg.Database, cfg.User, cfg.Password, cfg.Host, cfg.Port)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return &Storage{
		db: db,
	}, nil
}

func (conn *Storage) Close() error {
	return conn.db.Close()
}

func (conn *Storage) GetBestBlock(ctx context.Context) (uint64, error) {
	rows, err := conn.db.QueryContext(ctx, selectBestBlockQuery)
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

func (conn *Storage) GetUnfilledIntervals(ctx context.Context) ([]types.Interval, error) {
	rows, err := conn.db.QueryContext(ctx, selectUnfilledIntervalsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var s []types.Interval
	for rows.Next() {
		var t types.Interval
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

func (conn *Storage) ProcessBlock(ctx context.Context, block *types.Block) error {
	t, err := conn.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %s", err)
	}

	err = conn.saveBlock(ctx, t, block)
	if err != nil {
		t.Rollback()
		return err
	}

	for _, tx := range block.Transactions {
		err = conn.saveTransaction(ctx, t, block, tx)
		if err != nil {
			t.Rollback()
			return fmt.Errorf("failed to save transaction: %s", err)
		}

		for _, l := range tx.Logs {
			if err := conn.saveLog(ctx, t, l); err != nil {
				t.Rollback()
				return fmt.Errorf("failed to save log: %s", err)
			}
		}

		if err := conn.saveArgs(ctx, t, tx); err != nil {
			t.Rollback()
			return fmt.Errorf("faile to save args: %s", err)
		}
	}

	err = t.Commit()
	if err != nil {
		return fmt.Errorf("failed to complete database transaction: %s", err)
	}
	return nil
}

func (conn *Storage) saveBlock(ctx context.Context, t *sql.Tx, block *types.Block) error {
	bloom := common.Bytes2Hex(block.Block.Bloom().Bytes())

	size := big.NewInt(0).SetUint64(uint64(block.Block.Size()))

	extra := common.Bytes2Hex(block.Block.Extra())

	_, err := t.ExecContext(ctx, insertBlockQuery,
		block.Block.NumberU64(),
		block.Block.Hash().String(),
		block.Block.ParentHash().String(),
		strconv.FormatUint(block.Block.Nonce(), 10),
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
		return fmt.Errorf("error while inserting block %d: %s", block.Block.NumberU64(), err)
	}
	return nil
}

func (conn *Storage) saveTransaction(ctx context.Context, t *sql.Tx, block *types.Block, tx *types.Transaction) error {
	source := block.Block.Transaction(tx.Receipt.TxHash)
	v, r, s := source.RawSignatureValues()
	data := common.Bytes2Hex(source.Data())

	_, err := t.ExecContext(ctx, insertTransactionQuery,
		source.Hash().String(),
		source.Nonce(),
		block.Block.Hash().String(),
		block.Block.NumberU64(),
		tx.Receipt.TransactionIndex,
		tx.Receipt.From.String(),
		tx.Receipt.To.String(),
		source.Value().Uint64(),
		source.Gas(),
		source.GasPrice().Uint64(),
		data,
		v.String(),
		r.String(),
		s.String(),
		tx.Receipt.Status)
	if err != nil {
		return fmt.Errorf("error while inserting transaction: %s", err)
	}
	return nil
}

func (conn *Storage) shiftLogTopics(topics []common.Hash) (string, string, string, string) {
	var firstTopic, secondTopic, thirdTopic, fourthTopic string
	if len(topics) > 0 {
		firstTopic = topics[0].String()
	}
	if len(topics) > 1 {
		secondTopic = topics[1].String()
	}
	if len(topics) > 2 {
		thirdTopic = topics[2].String()
	}
	if len(topics) > 3 {
		fourthTopic = topics[3].String()
	}
	return firstTopic, secondTopic, thirdTopic, fourthTopic
}

func (conn *Storage) shiftLogArgs(hexData []byte) (string, string, string) {
	data := common.Bytes2Hex(hexData)
	var firstArg, secondArg, thirdArg string

	if len(data) > 0 && len(data) > 63 {
		firstArg = data[0:64]
	}

	if len(data) > 127 {
		secondArg = data[64:128]
	}

	if len(data) > 191 {
		thirdArg = data[128:]
	}

	return firstArg, secondArg, thirdArg
}

func (conn *Storage) saveLog(ctx context.Context, t *sql.Tx, l *eth.Log) error {
	firstTopic, secondTopic, thirdTopic, fourthTopic := conn.shiftLogTopics(l.Topics)

	firstArg, secondArg, thirdArg := conn.shiftLogArgs(l.Data)

	_, err := t.ExecContext(ctx, insertLogQuery,
		l.TxHash.String(),
		l.Address.String(),
		firstTopic,
		secondTopic,
		thirdTopic,
		fourthTopic,
		firstArg,
		secondArg,
		thirdArg,
		l.BlockNumber,
		l.TxIndex,
		l.Index,
		l.Removed,
	)
	if err != nil {
		return fmt.Errorf("error while inserting log: %s", err)
	}

	return nil
}

func (conn *Storage) shiftArgs(decodedArgs []string) [16]string {
	var args [16]string
	for i := 0; i < 16; i++ {
		if len(decodedArgs) >= i+1 {
			args[i] = decodedArgs[i]
		} else {
			args[i] = "NULL"
		}
	}
	return args
}

func (conn *Storage) saveArgs(ctx context.Context, t *sql.Tx, tx *types.Transaction) error {
	args := conn.shiftArgs(tx.DecodedData.Args)

	_, err := t.ExecContext(ctx, insertArgQuery,
		tx.Receipt.TxHash.String(),
		tx.DecodedData.Method,
		args[0],
		args[1],
		args[2],
		args[3],
		args[4],
		args[5],
		args[6],
		args[7],
		args[8],
		args[9],
		args[10],
		args[11],
		args[12],
		args[13],
		args[14],
		args[15],
	)
	if err != nil {
		return fmt.Errorf("error while inserting arg: %s", err)
	}
	return nil
}
