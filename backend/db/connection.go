package db

import (
	"database/sql"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	_ "github.com/lib/pq"
	"github.com/sonm-io/explorer/backend/types"
	"log"
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
	rows, err := conn.db.Query(`SELECT coalesce(max(number), 0) AS bestBlock FROM blocks;`)
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
	rows, err := conn.db.Query(`
		SELECT number + 1 as start_interval, next_id - 1 as finish_interval
		FROM (SELECT number, LEAD(number)OVER (ORDER BY number) AS next_id FROM blocks)T
		WHERE number + 1 <> next_id
		LIMIT 10000
	`)
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

func (conn *Connection) SaveBlock(block *types.Block) error {
	t, err := conn.NewTransaction()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %s", err)
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
		log.Printf("error while inserting block: %s", err)
		return t.Rollback()
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
				s, 
				status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
			tx.Hash().String(),
			tx.Nonce(),
			block.Block.Hash().String(),
			block.Block.NumberU64(),
			receipt.TransactionIndex,
			receipt.From.String(),
			tx.To().String(),
			tx.Value().Uint64(),
			tx.Gas(),
			tx.GasPrice().Uint64(),
			data,
			v.String(),
			r.String(),
			s.String(),
			receipt.Status)
		if err != nil {
			log.Printf("error while inserting transaction: %s", err)
			return t.Rollback()
		}
	}
	err = t.Commit()
	if err != nil {
		return err
	}
	return nil
}
