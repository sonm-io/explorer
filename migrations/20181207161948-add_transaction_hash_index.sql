-- +migrate Up

CREATE INDEX idx_transactions_hash
  ON transactions ("hash");

-- +migrate Down
