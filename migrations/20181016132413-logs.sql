-- +migrate Up

CREATE UNLOGGED TABLE logs (
  -- TODO: primary key
  "txHash"      TEXT NOT NULL REFERENCES transactions ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "address"     TEXT NOT NULL,
  "firstTopic"  TEXT,
  "secondTopic" TEXT,
  "thirdTopic"  TEXT,
  "fourthTopic" TEXT,
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
