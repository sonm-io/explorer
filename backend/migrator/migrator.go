package migrator

import (
	"database/sql"
	"github.com/jinzhu/configor"
	_ "github.com/lib/pq"
	"github.com/rubenv/sql-migrate"
)

type Config struct {
	Dir     string `yaml:"directory" required:"true"`
	Dialect string `yaml:"dialect" required:"true"`
}

func NewConfig(path string) (*Config, error) {
	cfg := &Config{}

	err := configor.Load(cfg, path)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}

type Migrator struct {
	db  *sql.DB
	cfg *Config
}

func NewMigrator(cfg *Config, db *sql.DB) (*Migrator, error) {
	return &Migrator{
		db:  db,
		cfg: cfg,
	}, nil
}

func (m *Migrator) Migrate() (int, error) {
	migrations := &migrate.FileMigrationSource{
		Dir: m.cfg.Dir,
	}
	return migrate.Exec(m.db, m.cfg.Dialect, migrations, migrate.Up)
}
