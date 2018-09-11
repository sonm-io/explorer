package db

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
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

func (c *Connection) DBConnection() *sql.DB {
	return c.db
}

func (c *Connection) NewTransaction() (*sql.Tx, error) {
	return c.db.Begin()
}

func (c *Connection) Close() error {
	return c.db.Close()
}
