package main

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

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

	log := getLogger(cfg.Log.Level())

	f, err := filler.NewFiller(cfg, log)
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
		log.Warn("termination", zap.Error(err))
	}

	return nil
}

func getLogger(lvl zapcore.Level) *zap.Logger {
	encoder := zap.NewDevelopmentEncoderConfig()
	encoder.EncodeLevel = zapcore.CapitalColorLevelEncoder

	cfg := zap.Config{
		Development:      false,
		Level:            zap.NewAtomicLevelAt(lvl),
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stdout"},
		Encoding:         "console",
		EncoderConfig:    encoder,
	}

	log, err := cfg.Build()
	if err != nil {
		panic(err)
	}

	return log
}
