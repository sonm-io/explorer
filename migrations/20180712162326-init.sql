-- +migrate Up
CREATE UNLOGGED TABLE blocks (
  "number"           BIGINT PRIMARY KEY,
  "hash"             TEXT    NOT NULL UNIQUE,
  "parentHash"       TEXT    NOT NULL,
  "nonce"            TEXT    NOT NULL,
  "sha3Uncles"       TEXT    NOT NULL,
  "logsBloom"        TEXT    NOT NULL,
  "transactionsRoot" TEXT    NOT NULL,
  "stateRoot"        TEXT    NOT NULL,
  "receiptsRoot"     TEXT    NOT NULL,
  "miner"            TEXT    NOT NULL,
  "difficulty"       NUMERIC NOT NULL,
  "totalDifficulty"  NUMERIC NOT NULL,
  "size"             BIGINT  NOT NULL,
  "extraData"        TEXT    NOT NULL,
  "gasLimit"         BIGINT  NOT NULL,
  "gasUsed"          BIGINT  NOT NULL,
  "timestamp"        BIGINT  NOT NULL,
  "mixhash"          TEXT,
  "txCount"          BIGINT  not null
);

CREATE UNLOGGED TABLE transactions (
  "hash"             TEXT PRIMARY KEY,
  "nonce"            BIGINT,
  "blockHash"        TEXT    NOT NULL REFERENCES blocks ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "blockNumber"      BIGINT  NOT NULL REFERENCES blocks ("number") ON DELETE CASCADE ON UPDATE CASCADE,
  "transactionIndex" BIGINT  NOT NULL,
  "from"             TEXT    NOT NULL,
  "to"               TEXT    NOT NULL,
  "value"            BIGINT  NOT NULL,
  "gas"              BIGINT  NOT NULL,
  "gasPrice"         NUMERIC NOT NULL,
  "input"            TEXT,
  "v"                TEXT,
  "r"                TEXT,
  "s"                TEXT
);

CREATE VIEW view_last_block
  AS
    SELECT b.number
    FROM blocks b
    WHERE b.number = (SELECT max(b2.number) FROM blocks b2);

CREATE UNLOGGED TABLE uncles (
  "hash"        TEXT PRIMARY KEY,
  "blockNumber" BIGINT NOT NULL REFERENCES blocks ("number") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE INDEX idx_transactions_from
  ON transactions ("from");
CREATE INDEX idx_transactions_to
  ON transactions ("to");
CREATE INDEX idx_transactions_blocknumber
  ON transactions ("blockNumber");

-- +migrate Down

DROP VIEW view_last_block;
DROP TABLE uncles;
DROP TABLE transactions;
DROP TABLE blocks;
