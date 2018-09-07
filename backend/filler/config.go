package filler

import (
	"github.com/jinzhu/configor"
	"github.com/sonm-io/explorer/backend/db"
)

type fillerConfig struct {
	Endpoint string `yaml:"endpoint" required:"true"`
}

type Config struct {
	Filler   *fillerConfig `yaml:"filler" required:"true"`
	Database *db.Config    `yaml:"database" required:"true"`
}

func NewConfig(path string) (*Config, error) {
	cfg := &Config{}

	err := configor.Load(cfg, path)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}
