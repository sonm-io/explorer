package db

import (
	"database/sql"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	eth "github.com/ethereum/go-ethereum/core/types"
	_ "github.com/lib/pq"
	"github.com/sonm-io/explorer/backend/types"
	"math/big"
)

type Connection struct {
	db *sql.DB
}

type Config struct {
	User     string `yaml:"user" default:"app"`
	Password string `yaml:"password" default:"app"`
	Database string `yaml:"database" default:"app"`
}

func NewConnection(cfg *Config) (*Connection, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", cfg.User, cfg.Password, cfg.Database)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(2030)
	return &Connection{
		db: db,
	}, nil
}

func (conn *Connection) DBConnection() *sql.DB {
	return conn.db
}

func (conn *Connection) NewTransaction() (*sql.Tx, error) {
	return conn.db.Begin()
}

func (conn *Connection) Close() error {
	return conn.db.Close()
}

func (conn *Connection) GetBestBlock() (uint64, error) {
	rows, err := conn.db.Query(selectBestBlockQuery)
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

func (conn *Connection) GetUnfilledIntervals() ([]types.Interval, error) {
	rows, err := conn.db.Query(selectUnfilledIntervalsQuery)
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

func (conn *Connection) ProcessBlock(block *types.Block) error {
	t, err := conn.NewTransaction()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %s", err)
	}

	err = conn.saveBlock(t, block)
	if err != nil {
		t.Rollback()
		return err
	}

	for _, tx := range block.Transactions {
		err = conn.saveTransaction(t, block, tx)
		if err != nil {
			t.Rollback()
			return fmt.Errorf("error while inserting transaction: %s", err)
		}

		for _, l := range tx.Logs {
			if err := conn.saveLog(t, l); err != nil {
				t.Rollback()
				return fmt.Errorf("failed to save log: %v", err)
			}
		}

		if err := conn.saveArgs(t, tx); err != nil {
			t.Rollback()
			return fmt.Errorf("faile to save args: %v", err)
		}
	}
	err = t.Commit()
	if err != nil {
		return fmt.Errorf("failed to complete database transaction: %v", err)
	}
	return nil
}

func (conn *Connection) saveBlock(t *sql.Tx, block *types.Block) error {
	bloom := common.Bytes2Hex(block.Block.Bloom().Bytes())

	size := big.NewInt(0).SetUint64(uint64(block.Block.Size()))

	extra := common.Bytes2Hex(block.Block.Extra())

	_, err := t.Exec(insertBlockQuery,
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
		return fmt.Errorf("error while inserting block %d: %s", block.Block.NumberU64(), err)
	}
	return nil
}

func (conn *Connection) saveTransaction(t *sql.Tx, block *types.Block, tx *types.Transaction) error {
	source := block.Block.Transaction(tx.Receipt.TxHash)
	v, r, s := source.RawSignatureValues()
	data := common.Bytes2Hex(source.Data())

	_, err := t.Exec(insertTransactionQuery,
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

func (conn *Connection) saveLog(t *sql.Tx, l *eth.Log) error {
	var firstTopic, secondTopic, thirdTopic, fourthTopic string

	if len(l.Topics) > 0 {
		firstTopic = l.Topics[0].String()
	}
	if len(l.Topics) > 1 {
		secondTopic = l.Topics[1].String()
	}
	if len(l.Topics) > 2 {
		thirdTopic = l.Topics[2].String()
	}
	if len(l.Topics) > 3 {
		fourthTopic = l.Topics[3].String()
	}

	var firstArg, secondArg, thirdArg string
	data := string(l.Data)

	if len(data) > 0 && len(data) > 63 {
		firstArg = data[0:64]
	}

	if len(data) > 127 {
		firstArg = data[64:128]
	}

	if len(data) > 191 {
		firstArg = data[128:]
	}

	_, err := t.Exec(insertLogQuery,
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
		return fmt.Errorf("error while inserting log: %v", err)
	}

	return nil
}

func (conn *Connection) saveArgs(t *sql.Tx, tx *types.Transaction) error {
	var args [16]string
	for i := 0; i > 16; i++ {
		if len(tx.DecodedData.Args) >= i+1 {
			args[i] = tx.DecodedData.Args[i]
		} else {
			args[i] = "NULL"
		}
	}
	_, err := t.Exec(insertArgQuery,
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
		return fmt.Errorf("error while inserting arg: %v", err)
	}
	return nil
}
