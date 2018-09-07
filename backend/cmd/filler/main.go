package main

import (
	"context"
	"fmt"
	"github.com/sonm-io/core/cmd"
	"github.com/sonm-io/explorer/backend/db"
	"github.com/sonm-io/explorer/backend/filler"
)

var (
	configFlag  string
	versionFlag bool
	appVersion  string
)

func main() {
	cmd.NewCmd("filler", appVersion, &configFlag, &versionFlag, run).Execute()
}

func run() error {
	cfg, err := filler.NewConfig(configFlag)
	if err != nil {
		return fmt.Errorf("failed to parse config: %s", err)
	}

	database, err := db.NewConnection(cfg.Database)
	if err != nil {
		return err
	}
	defer database.Close()

	f, err := filler.NewFiller(cfg, database)
	if err != nil {
		return fmt.Errorf("failed to create filler instance: %s", err)
	}

	if err := f.Start(context.TODO()); err != nil {
		return fmt.Errorf("filler stoped occuring error: %s", err)
	}

	return nil
}
