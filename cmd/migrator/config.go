package main

import (
	"github.com/jinzhu/configor"
	"github.com/sonm-io/core/insonmnia/logging"
	"github.com/sonm-io/explorer/db"
	"github.com/sonm-io/explorer/migrator"
)

type Config struct {
	Database *db.Config       `yaml:"database" required:"true"`
	Migrator *migrator.Config `yaml:"migrator" required:"true"`
	Log      *logging.Config  `yaml:"log"`
}

func NewConfig(path string) (*Config, error) {
	cfg := &Config{}

	err := configor.Load(cfg, path)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}
