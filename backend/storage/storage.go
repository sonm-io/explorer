package storage

import (
	"context"
	"database/sql"
	"fmt"
	"math/big"
	"strconv"
	"strings"

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

	db.SetMaxOpenConns(100)
	db.SetMaxIdleConns(200)

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
		if e := t.Rollback(); e != nil {
			return fmt.Errorf("failed to store block (%s) and rollback database transaction (%s)", err, e)
		}
		return err
	}

	for _, tx := range block.Transactions {
		err = conn.saveTransaction(ctx, t, block, tx)
		if err != nil {
			if e := t.Rollback(); e != nil {
				return fmt.Errorf("failed to store transaction (%s) and rollback database transaction (%s)", err, e)
			}
			return fmt.Errorf("failed to save transaction: %s", err)
		}

		for _, l := range tx.Logs {
			if err := conn.saveLog(ctx, t, l); err != nil {
				if e := t.Rollback(); e != nil {
					return fmt.Errorf("failed to store log (%s) and rollback database transaction (%s)", err, e)
				}
				return fmt.Errorf("failed to save log: %s", err)
			}
		}

		if err := conn.saveArgs(ctx, t, tx); err != nil {
			if e := t.Rollback(); e != nil {
				return fmt.Errorf("failed to store args (%s) and rollback database transaction (%s)", err, e)
			}
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
	// fixme: perform this calculations out of db transaction
	bloom := common.Bytes2Hex(block.Block.Bloom().Bytes())
	size := big.NewInt(0).SetUint64(uint64(block.Block.Size()))
	extra := common.Bytes2Hex(block.Block.Extra())

	_, err := t.ExecContext(ctx, insertBlockQuery,
		strconv.FormatUint(block.Block.NumberU64(), 10),
		strings.ToLower(block.Block.Hash().String()),
		strings.ToLower(block.Block.ParentHash().String()),
		strconv.FormatUint(block.Block.Nonce(), 10),
		strings.ToLower(block.Block.UncleHash().String()),
		bloom,
		strings.ToLower(block.Block.TxHash().String()),
		strings.ToLower(block.Block.Root().String()),
		strings.ToLower(block.Block.ReceiptHash().String()),
		strings.ToLower(block.Block.Coinbase().String()),
		block.Block.Difficulty().Uint64(),
		0, // TODO: add total difficulty field
		strconv.FormatUint(size.Uint64(), 10),
		extra,
		strconv.FormatUint(block.Block.GasLimit(), 10),
		strconv.FormatUint(block.Block.GasUsed(), 10),
		strconv.FormatUint(block.Block.Time().Uint64(), 10),
		strings.ToLower(block.Block.MixDigest().String()),
		strconv.FormatInt(int64(len(block.Transactions)), 10))
	if err != nil {
		return err
	}
	return nil
}

func (conn *Storage) saveTransaction(ctx context.Context, t *sql.Tx, block *types.Block, tx *types.Transaction) error {
	// fixme: perform this calculations out of db transaction
	source := block.Block.Transaction(tx.Receipt.TxHash)
	v, r, s := source.RawSignatureValues()
	data := common.Bytes2Hex(source.Data())

	_, err := t.ExecContext(ctx, insertTransactionQuery,
		strings.ToLower(source.Hash().String()),
		strconv.FormatUint(source.Nonce(), 10),
		strings.ToLower(block.Block.Hash().String()),
		strconv.FormatUint(block.Block.NumberU64(), 10),
		strconv.FormatUint(tx.Receipt.TransactionIndex, 10),
		strings.ToLower(tx.Receipt.From.String()),
		strings.ToLower(tx.Receipt.To.String()),
		source.Value().Uint64(),
		strconv.FormatUint(source.Gas(), 10),
		strconv.FormatUint(tx.Receipt.GasUsed, 10),
		strconv.FormatUint(source.GasPrice().Uint64(), 10),
		data,
		v.String(),
		r.String(),
		s.String(),
		tx.Receipt.Status,
		strconv.FormatUint(block.Block.Time().Uint64(), 10))
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
	// fixme: perform this calculations out of db transaction
	firstTopic, secondTopic, thirdTopic, fourthTopic := conn.shiftLogTopics(l.Topics)
	firstArg, secondArg, thirdArg := conn.shiftLogArgs(l.Data)

	_, err := t.ExecContext(ctx, insertLogQuery,
		strings.ToLower(l.TxHash.String()),
		strings.ToLower(l.Address.String()),
		strings.ToLower(firstTopic),
		strings.ToLower(secondTopic),
		strings.ToLower(thirdTopic),
		strings.ToLower(fourthTopic),
		strings.ToLower(firstArg),
		strings.ToLower(secondArg),
		strings.ToLower(thirdArg),
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
	// fixme: perform this calculations out of db transaction
	args := conn.shiftArgs(tx.DecodedData.Args)

	_, err := t.ExecContext(ctx, insertArgQuery,
		strings.ToLower(tx.Receipt.TxHash.String()),
		strings.ToLower(tx.DecodedData.Method),
		strings.ToLower(args[0]),
		strings.ToLower(args[1]),
		strings.ToLower(args[2]),
		strings.ToLower(args[3]),
		strings.ToLower(args[4]),
		strings.ToLower(args[5]),
		strings.ToLower(args[6]),
		strings.ToLower(args[7]),
		strings.ToLower(args[8]),
		strings.ToLower(args[9]),
		strings.ToLower(args[10]),
		strings.ToLower(args[11]),
		strings.ToLower(args[12]),
		strings.ToLower(args[13]),
		strings.ToLower(args[14]),
		strings.ToLower(args[15]),
	)
	if err != nil {
		return fmt.Errorf("error while inserting arg: %s", err)
	}
	return nil
}
