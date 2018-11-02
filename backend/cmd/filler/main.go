package main

import (
	"context"
	"fmt"
	"github.com/sonm-io/core/cmd"
	"github.com/sonm-io/explorer/backend/filler"
)

func main() {
	cmd.NewCmd(run).Execute()
}

func run(app cmd.AppContext) error {
	cfg, err := filler.NewConfig(app.ConfigPath)
	if err != nil {
		return fmt.Errorf("failed to load config file: %s", err)
	}

	f, err := filler.NewFiller(cfg)
	if err != nil {
		return fmt.Errorf("failed to create filler instance: %s", err)
	}

	ctx := context.Background()

	if err := f.Start(ctx); err != nil {
		return fmt.Errorf("filler stoped occuring error: %s", err)
	}

	return nil
}
