package migrator

import (
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/rubenv/sql-migrate"
)

type Config struct {
	Dir     string `yaml:"directory" required:"true"`
	Dialect string `yaml:"dialect" required:"true"`
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
