-- +migrate Up

ALTER TABLE transactions
  ADD COLUMN "gasUsed" BIGINT;

-- +migrate Down
