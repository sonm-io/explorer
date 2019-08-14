-- +migrate Up

DROP FUNCTION IF EXISTS public.token_transfers_count;

-- +migrate StatementBegin
CREATE OR REPLACE FUNCTION public.token_transfers_count(address VARCHAR(66) DEFAULT NULL::VARCHAR(66),
                                                        blocknumber BIGINT DEFAULT NULL::BIGINT)
  RETURNS TABLE
          (
            count bigint
          )
  LANGUAGE sql
AS
$function$
SELECT count(*)
FROM logs
WHERE logs."firstTopic" = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'::text
  AND ($1 IS NULL OR $1 = logs."secondTopic" OR $1 = logs."thirdTopic")
  AND ($2 IS NULL OR $2 = logs."blockNumber")
$function$;
-- +migrate StatementEnd

DROP FUNCTION IF EXISTS public.token_transfers;

-- +migrate StatementBegin
CREATE OR REPLACE FUNCTION public.token_transfers(skip INT, size INT, address VARCHAR(66) DEFAULT NULL::VARCHAR(66),
                                                  blocknumber BIGINT DEFAULT NULL::BIGINT)
  RETURNS TABLE
          (
            hash          VARCHAR(66),
            "blockNumber" BIGINT,
            method        VARCHAR(66),
            "from"        VARCHAR(66),
            "to"          VARCHAR(66),
            value         VARCHAR(66),
            "timestamp"   timestamp without time zone
          )
  LANGUAGE sql
AS
$function$
SELECT tx."hash",
       tx."blockNumber",
       lg."firstTopic"  as method,
       lg."secondTopic" as "from",
       lg."thirdTopic"  as "to",
       lg."firstArg"    as "value",
       tx."timestamp"
FROM (
       SELECT logs."firstTopic",
              logs."secondTopic",
              logs."thirdTopic",
              logs."firstArg",
              logs."secondArg",
              logs."thirdArg",
              logs."txHash"
       FROM logs
       WHERE logs."firstTopic" = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'::text
         AND ($3 IS NULL OR $3 = logs."secondTopic" OR $3 = logs."thirdTopic")
         AND ($4 IS NULL OR $4 = logs."blockNumber")
       ORDER BY logs."blockNumber" DESC OFFSET $1
       LIMIT $2
     ) lg
       INNER JOIN transactions tx ON (
  lg."txHash" = tx."hash"
  )
ORDER BY tx.nonce desc;
$function$
-- +migrate StatementEnd


-- +migrate Down

DROP FUNCTION IF EXISTS public.token_transfers_count;
