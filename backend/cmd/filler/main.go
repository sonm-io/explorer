package main

import (
	"context"
	"fmt"

	"github.com/sonm-io/core/cmd"
	"github.com/sonm-io/explorer/backend/filler"
	"golang.org/x/sync/errgroup"
)

func main() {
	_ = cmd.NewCmd(run).Execute()
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

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	wg, ctx := errgroup.WithContext(ctx)
	wg.Go(func() error {
		return cmd.WaitInterrupted(ctx)
	})
	wg.Go(func() error {
		return f.Start(ctx)
	})

	if err := wg.Wait(); err != nil {
		return fmt.Errorf("termination: %s", err)
	}

	return nil
}
