-- +migrate Up

CREATE VIEW token_transfers AS
SELECT t.hash,
       t."blockNumber",
       l."firstTopic" AS "method",
       l."secondTopic" AS "from",
       l."thirdTopic" AS "to",
       l."firstArg" AS "value",
       b.timestamp
FROM transactions t
            INNER JOIN logs l on t.hash = l."txHash"
            INNER JOIN blocks b on t."blockHash" = b.hash
WHERE l."firstTopic" = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

-- +migrate Down

DROP VIEW token_transfers;
