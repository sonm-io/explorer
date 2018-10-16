-- +migrate Up

CREATE UNLOGGED TABLE logs (
  "txHash"      TEXT NOT NULL REFERENCES transactions ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "address"     TEXT NOT NULL,
  "firstTopic"  TEXT,
  "secondTopic" TEXT,
  "thirdTopic"  TEXT,
  "firstArg"    TEXT,
  "secondArg"   TEXT,
  "thirdArg"    TEXT,
  "blockNumber" BIGINT,
  "txIndex"     INT,
  "index"       INT,
  "removed"     BOOLEAN
);

-- +migrate Down

DROP TABLE logs;
