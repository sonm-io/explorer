package types

import (
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
)

type Block struct {
	Block        *types.Block
	Transactions []*blockchain.Receipt
}
