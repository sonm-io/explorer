package main

import (
	"fmt"
	"github.com/sonm-io/core/cmd"
	"github.com/sonm-io/explorer/db"
	"github.com/sonm-io/explorer/migrator"
	"log"
)

var (
	configFlag  string
	versionFlag bool
	appVersion  string
)

func main() {
	cmd.NewCmd("migrator", appVersion, &configFlag, &versionFlag, run).Execute()
}

func run() error {
	cfg, err := NewConfig(configFlag)
	if err != nil {
		return err
	}

	database, err := db.NewConnection(cfg.Database)
	if err != nil {
		return fmt.Errorf("trouble to initialize database connection: %s", err)
	}

	conn := database.DBConnection()
	if conn == nil {
		return fmt.Errorf("failed to initialize database connection: connection is nil")
	}

	m, err := migrator.NewMigrator(cfg.Migrator, conn)
	if err != nil {
		return err
	}

	n, err := m.Migrate()
	if err != nil {
		return err
	}

	log.Println("Migrate finished successfully")
	if n != 0 {
		log.Printf("We doesn't has unapplied migrations")
	} else {
		log.Printf("Applied %d migrations", n)
	}

	return nil
}
