package types

import (
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/sonm-io/core/blockchain"
	"golang.org/x/net/context"
)

type Transaction struct {
	Tx          *types.Transaction
	Receipt     *blockchain.Receipt
	Logs        []*types.Log
	DecodedData struct {
		Method string
		Args   []string
	}
}

func fillTransaction(ctx context.Context, client blockchain.CustomEthereumClient, t *types.Transaction) (*Transaction, error) {
	rec, err := client.GetTransactionReceipt(ctx, t.Hash())
	if err != nil {
		return nil, fmt.Errorf("failed to getting transaction receipt: %s", err)
	}

	tx := &Transaction{
		Tx:      t,
		Receipt: rec,
	}

	// TODO(sokel): need to experiment with correct block number with there transaction; now it's doesn't works;
	codeAt, err := client.CodeAt(ctx, rec.To, nil)
	if err != nil {
		return nil, fmt.Errorf("error while getting code at address: %s", err)
	}

	if string(codeAt) != "" {
		err = tx.parseContractData(t, rec)
		if err != nil {
			return nil, fmt.Errorf("failed to parse contract data: %s", err)
		}
	}

	return tx, nil
}

func (t *Transaction) parseContractData(tx *types.Transaction, receipt *blockchain.Receipt) error {
	t.parseLogs(receipt)

	if err := t.parseArgs(tx.Data()); err != nil {
		return fmt.Errorf("failed to parse args: %s", err)
	}
	return nil
}

func (t *Transaction) parseLogs(receipt *blockchain.Receipt) {
	for _, l := range receipt.Logs {
		t.Logs = append(t.Logs, l)
	}
}

func (t *Transaction) parseArgs(data []byte) error {
	hexData := common.Bytes2Hex(data)

	// parse transaction method
	if len(hexData) < 8 {
		return fmt.Errorf("args data is malformed")
	}
	method := hexData[:8]
	t.DecodedData.Method = method

	if len(hexData) > 8 && (len(hexData)-8)%64 == 0 {
		hexData = hexData[8:]
		var args []string
		for i := 0; i <= len(hexData)/64; i = +64 {
			args = append(args, hexData[i:(i+64)])
		}
		t.DecodedData.Args = args
	}

	return nil
}
