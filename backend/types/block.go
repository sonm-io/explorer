package types

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
	"math/big"
)

type Transaction struct {
	Receipt     *blockchain.Receipt
	Logs        []*types.Log
	DecodedData struct {
		Method string
		Args   []string
	}
}

func (b *Transaction) parseContractData(tx *types.Transaction, receipt *blockchain.Receipt) error {
	if err := b.parseLogs(receipt); err != nil {
		return fmt.Errorf("error while parsin logs: %v", err)
	}
	if err := b.parseArgs(tx); err != nil {
		return fmt.Errorf("failed to parse args: %v", err)
	}
	return nil
}

func (b *Transaction) parseLogs(receipt *blockchain.Receipt) error {
	for _, l := range receipt.Logs {
		b.Logs = append(b.Logs, l)
	}
	return nil
}

func (b *Transaction) parseArgs(tx *types.Transaction) error {
	data := common.Bytes2Hex(tx.Data())
	method := data[:8]
	data = data[8:]
	var args []string
	for i := 0; i <= len(data)/64; i = +64 {
		args = append(args, data[i:(i+64)])
	}
	b.DecodedData.Method = method
	b.DecodedData.Args = args
	return nil
}

type Block struct {
	Block        *types.Block
	Transactions []*Transaction
}

func (b *Block) FillBlock(ctx context.Context, client blockchain.CustomEthereumClient, number *big.Int) error {
	block, err := client.BlockByNumber(ctx, number)
	if err != nil {
		return fmt.Errorf("failed to getting block: %v", err)
	}
	var transactions []*Transaction
	for _, t := range block.Transactions() {
		rec, err := client.GetTransactionReceipt(ctx, t.Hash())
		if err != nil {
			return fmt.Errorf("failed to getting transaction receipt: %v", err)
		}
		tx := &Transaction{
			Receipt: rec,
		}

		// TODO(sokel): need to experiment with correct block number with there transaction; now it's doesn't works;
		codeAt, err := client.CodeAt(ctx, rec.To, nil)
		if err != nil {
			return fmt.Errorf("error while getting code at address: %v", err)
		}
		if string(codeAt) != "" {
			tx.parseContractData(t, rec)
		}

		transactions = append(transactions, tx)
	}

	b.Block = block
	b.Transactions = transactions
	return nil
}
