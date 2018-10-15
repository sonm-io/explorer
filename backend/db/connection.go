package db

import (
	"database/sql"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
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

	bloom := common.Bytes2Hex(block.Block.Bloom().Bytes())

	size := big.NewInt(0).SetUint64(uint64(block.Block.Size()))

	extra := common.Bytes2Hex(block.Block.Extra())

	_, err = t.Exec(insertBlockQuery,
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
		t.Rollback()
		return fmt.Errorf("error while inserting block %d: %s", block.Block.NumberU64(), err)
	}
	for _, tx := range block.Transactions {
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
			source.To().String(),
			source.Value().Uint64(),
			source.Gas(),
			source.GasPrice().Uint64(),
			data,
			v.String(),
			r.String(),
			s.String(),
			tx.Receipt.Status)
		if err != nil {
			t.Rollback()
			return fmt.Errorf("error while inserting transaction: %s", err)
		}
	}
	err = t.Commit()
	if err != nil {
		return err
	}
	return nil
}
