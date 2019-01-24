-- +migrate Up

CREATE INDEX idx_logs_method
  ON logs ("firstTopic");

-- +migrate Down
