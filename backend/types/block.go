package types

import "github.com/ethereum/go-ethereum/core/types"

type Block struct {
	Block        *types.Block
	Transactions []*types.Receipt
}
