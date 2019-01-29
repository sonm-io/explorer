package filler

import (
	"fmt"
	"github.com/jinzhu/configor"
	"github.com/sonm-io/explorer/backend/storage"
)

type fillerConfig struct {
	Concurrency uint `yaml:"concurrency" required:"true" default:"50"`
}

type gethConfig struct {
	Endpoint string `yaml:"endpoint" required:"true"`
}

type Config struct {
	Filler   fillerConfig   `yaml:"filler" required:"true"`
	Geth     gethConfig     `yaml:"geth" required:"true"`
	Database storage.Config `yaml:"database" required:"true"`
}

func (c *Config) validate() error {
	if c.Filler.Concurrency == 0 {
		return fmt.Errorf("cannot use zero concurrency")
	}

	if c.Filler.Concurrency >= 500 {
		return fmt.Errorf("it's too danger to use so many threads")
	}

	return nil
}

func NewConfig(path string) (*Config, error) {
	cfg := &Config{}

	if err := configor.Load(cfg, path); err != nil {
		return nil, err
	}

	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}
