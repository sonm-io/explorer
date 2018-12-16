package storage

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

const (
	expectedBestBlock      uint64 = 1000
	expectedIntervalsCount int    = 500
)

func testGetBestBlock(t *testing.T) {
	bestBlock, err := testStorage.GetBestBlock()
	assert.NoError(t, err, "GetBestBlock failed")
	assert.Equal(t, expectedBestBlock, bestBlock,
		"incorrect reply: expected %d, get %d", expectedBestBlock, bestBlock)
}

func testGetUnfilledIntervals(t *testing.T) {
	_, err := testStorage.db.Exec("DELETE FROM blocks WHERE number % 2 != 0")
	if err != nil {
		t.Fatalf("failed to prepare test data %s \r\n", err)
	}
	_, err = testStorage.db.Exec(insertBlockQuery, 1100, "0xdddddddddddddddddd", "", 0, "", "", "", "", "", "", 0, 0, 0, "", 0, 0, 0, "", 0)
	if err != nil {
		t.Fatalf("failed to prepare test data %s \r\n", err)
	}

	intervals, err := testStorage.GetUnfilledIntervals()
	assert.NoError(t, err, "GetUnfilledIntervals failed")
	// GetUnfilledIntervals must returns only 500 unique intervals
	assert.Equal(t, expectedIntervalsCount, len(intervals),
		"incorrect returned intervals count: expected %d, get %d", expectedIntervalsCount, len(intervals))
}
