package types

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
)

type Block struct {
	Block        *types.Block
	Transactions []*Transaction
}

func FillNewBlock(ctx context.Context, client blockchain.CustomEthereumClient, number *big.Int) (*Block, error) {
	block, err := client.BlockByNumber(ctx, number)
	if err != nil {
		return nil, fmt.Errorf("failed to getting block: %v", err)
	}

	var transactions []*Transaction
	for _, t := range block.Transactions() {
		tx, err := fillTransaction(ctx, client, t)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, tx)
	}

	return &Block{
		Block:        block,
		Transactions: transactions,
	}, nil
}
