-- +migrate Up

CREATE UNLOGGED TABLE args (
  -- TODO:  primary key
  "txHash" TEXT NOT NULL REFERENCES transactions ("hash") ON DELETE CASCADE ON UPDATE CASCADE,
  "method" TEXT NOT NULL,
  "arg1"   TEXT,
  "arg2"   TEXT,
  "arg3"   TEXT,
  "arg4"   TEXT,
  "arg5"   TEXT,
  "arg6"   TEXT,
  "arg7"   TEXT,
  "arg8"   TEXT,
  "arg9"   TEXT,
  "arg10"  TEXT,
  "arg11"  TEXT,
  "arg12"  TEXT,
  "arg13"  TEXT,
  "arg14"  TEXT,
  "arg15"  TEXT,
  "arg16"  TEXT
);

-- +migrate Down

DROP TABLE args;
