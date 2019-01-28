-- +migrate Up

CREATE TABLE blocks
(
  "number"           BIGINT PRIMARY KEY,
  "hash"             VARCHAR(66) NOT NULL UNIQUE,
  "parentHash"       VARCHAR(66) NOT NULL,
  "nonce"            NUMERIC     NOT NULL,
  "sha3Uncles"       VARCHAR(66) NOT NULL,
  "logsBloom"        TEXT        NOT NULL,
  "transactionsRoot" VARCHAR(66) NOT NULL,
  "stateRoot"        VARCHAR(66) NOT NULL,
  "receiptsRoot"     VARCHAR(66) NOT NULL,
  "miner"            VARCHAR(42) NOT NULL,
  "difficulty"       NUMERIC     NOT NULL,
  "totalDifficulty"  NUMERIC     NOT NULL,
  "size"             NUMERIC     NOT NULL,
  "extraData"        TEXT        NOT NULL,
  "gasLimit"         BIGINT      NOT NULL,
  "gasUsed"          BIGINT      NOT NULL,
  "timestamp"        TIMESTAMP   NOT NULL,
  "mixhash"          VARCHAR(66),
  "txCount"          NUMERIC     NOT NULL
);


CREATE TABLE transactions
(
  "id"               SERIAL PRIMARY KEY,
  "hash"             VARCHAR(66) UNIQUE NOT NULL,
  "nonce"            BIGINT,
  "blockHash"        VARCHAR(66)        NOT NULL REFERENCES blocks ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "blockNumber"      BIGINT             NOT NULL REFERENCES blocks ("number") ON DELETE CASCADE ON UPDATE CASCADE,
  "transactionIndex" BIGINT             NOT NULL,
  "from"             VARCHAR(42)        NOT NULL,
  "to"               VARCHAR(42)        NOT NULL,
  "value"            BIGINT             NOT NULL,
  "gas"              BIGINT             NOT NULL,
  "gasUsed"          BIGINT             NOT NULL,
  "gasPrice"         BIGINT             NOT NULL,
  "input"            TEXT,
  "v"                TEXT,
  "r"                TEXT,
  "s"                TEXT,
  "status"           SMALLINT           NOT NULL,
  "timestamp"        TIMESTAMP          NOT NULL
);


CREATE TABLE logs
(
  "id"          SERIAL PRIMARY KEY,
  "txHash"      VARCHAR(66) NOT NULL REFERENCES transactions ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "address"     VARCHAR(42) NOT NULL,
  "firstTopic"  VARCHAR(66),
  "secondTopic" VARCHAR(66),
  "thirdTopic"  VARCHAR(66),
  "fourthTopic" VARCHAR(66),
  "firstArg"    VARCHAR(66),
  "secondArg"   VARCHAR(66),
  "thirdArg"    VARCHAR(66),
  "blockNumber" BIGINT,
  "txIndex"     INT,
  "index"       INT,
  "removed"     BOOLEAN
);


CREATE TABLE args
(
  "id"     SERIAL PRIMARY KEY,
  "txHash" VARCHAR(66) NOT NULL REFERENCES transactions ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "method" VARCHAR(10) NOT NULL,
  "arg1"   VARCHAR(66),
  "arg2"   VARCHAR(66),
  "arg3"   VARCHAR(66),
  "arg4"   VARCHAR(66),
  "arg5"   VARCHAR(66),
  "arg6"   VARCHAR(66),
  "arg7"   VARCHAR(66),
  "arg8"   VARCHAR(66),
  "arg9"   VARCHAR(66),
  "arg10"  VARCHAR(66),
  "arg11"  VARCHAR(66),
  "arg12"  VARCHAR(66),
  "arg13"  VARCHAR(66),
  "arg14"  VARCHAR(66),
  "arg15"  VARCHAR(66),
  "arg16"  VARCHAR(66)
);

CREATE INDEX idx_block_hash
  ON blocks ("hash");

CREATE INDEX idx_transactions_blockhash
  ON transactions ("blockHash");

CREATE INDEX idx_logs_txhash
  ON logs ("txHash");

CREATE INDEX idx_logs_topic_transfer
  ON logs ("firstTopic")
  WHERE "firstTopic" = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

CREATE INDEX idx_transactions_from
  ON transactions ("from");

CREATE INDEX idx_transactions_to
  ON transactions ("to");

CREATE INDEX idx_transactions_blocknumber
  ON transactions ("blockNumber");

-- +migrate Down

DROP INDEX idx_block_hash;
DROP INDEX idx_transactions_blockhash;
\
DROP INDEX idx_logs_txhash;
DROP INDEX idx_logs_topic_transfer;

DROP VIEW token_transfers;
DROP TABLE args;
DROP TABLE logs;
DROP TABLE transactions;
DROP TABLE blocks;
