package db

const selectBestBlockQuery = `SELECT coalesce(max(number), 0) AS bestBlock FROM blocks;`

const selectUnfilledIntervalsQuery = `
	SELECT number + 1 as start_interval, next_id - 1 as finish_interval
	FROM (SELECT number, LEAD(number)OVER (ORDER BY number) AS next_id FROM blocks)T
	WHERE number + 1 <> next_id
	LIMIT 10000
	`

const insertBlockQuery = `INSERT INTO blocks(
			number,
			hash,
			"parentHash",
			nonce,
			"sha3Uncles",
			"logsBloom",
			"transactionsRoot",
			"stateRoot",
			"receiptsRoot",
			miner,
			difficulty,
			"totalDifficulty",
			size,
			"extraData",
			"gasLimit",
			"gasUsed",
			timestamp,
			"mixhash",
			"txCount"
			) VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`

const insertTransactionQuery = `INSERT INTO transactions(
				hash,
				nonce ,
				"blockHash",
				"blockNumber",
				"transactionIndex",
				"from",
				"to",
				"value",
				gas,
				"gasPrice",
				input,
				v,
				r,
				s, 
				status) 
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`

const insertLogQuery = `
	INSERT INTO logs (
				  "txHash",
                  "address",
                  "firstTopic",
                  "secondTopic",
                  "thirdTopic",
                  "fourthTopic",
                  "firstArg",
                  "secondArg",
                  "thirdArg",
                  "blockNumber",
                  "txIndex",
                  "index",
                  "removed")
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
`

const insertArgQuery = `INSERT INTO args ("txHash",
                  "method",
                  "arg1",
                  "arg2",
                  "arg3",
                  "arg4",
                  "arg5",
                  "arg6",
                  "arg7",
                  "arg8",
                  "arg9",
                  "arg10",
                  "arg11",
                  "arg12",
                  "arg13",
                  "arg14",
                  "arg15",
                  "arg16")
				  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
`
