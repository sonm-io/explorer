-- +migrate Up

CREATE INDEX idx_transactions_hash
  -- todo: why?
  ON transactions ("hash");

-- +migrate Down
