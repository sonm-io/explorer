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

func testShiftArgs(t *testing.T) {
	testArgs := []string{
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
		"arg16",
	}
	result := testStorage.shiftArgs(testArgs)
	assert.Equal(t, result[0], "arg1")
	assert.Equal(t, result[1], "arg2")
	assert.Equal(t, result[15], "arg16")
}
