package types

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
	"math/big"
)

type Transaction struct {
	Transaction *blockchain.Receipt
	Logs        []*types.Log
	DecodedData struct {
		Method common.Hash
		Args   []common.Hash
	}
}

type Block struct {
	Block        *types.Block
	Transactions []*blockchain.Receipt
}

func (b *Block) FillBlock(ctx context.Context, client blockchain.CustomEthereumClient, number *big.Int) error {
	block, err := client.BlockByNumber(ctx, number)
	if err != nil {
		return err
	}
	var transactions []*blockchain.Receipt
	for _, tx := range block.Transactions() {
		rec, err := client.GetTransactionReceipt(ctx, tx.Hash())
		if err != nil {
			return err
		}
		transactions = append(transactions, rec)
	}

	b.Block = block
	b.Transactions = transactions
	return nil
}
