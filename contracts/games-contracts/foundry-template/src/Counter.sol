// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Tracks how early/late periodic calls arrive versus a fixed interval.
contract Counter {
    uint256 public counter;

    uint256 public immutable interval;

    uint256 public lastTimestamp;

    struct AccuracyRecord {
        uint256 count;
        uint256 expectedTimestamp;
        uint256 actualTimestamp;
        int256 offsetSeconds; // negative = early, positive = late
        address caller;
    }

    mapping(uint256 => AccuracyRecord) public records;

    event Checkpoint(
        uint256 indexed count,
        uint256 expectedTimestamp,
        uint256 actualTimestamp,
        int256 offsetSeconds,
        address indexed caller
    );

    constructor(uint256 _intervalSeconds) {
        interval = _intervalSeconds == 0 ? 300 : _intervalSeconds;
        lastTimestamp = block.timestamp;
        counter = 0;
    }

    function checkpoint() external {
        uint256 expected = lastTimestamp + interval;
        uint256 actual = block.timestamp;
        int256 offset = int256(actual) - int256(expected);

        unchecked {
            counter += 1;
        }

        records[counter] = AccuracyRecord({
            count: counter,
            expectedTimestamp: expected,
            actualTimestamp: actual,
            offsetSeconds: offset,
            caller: msg.sender
        });

        lastTimestamp = actual;

        emit Checkpoint(counter, expected, actual, offset, msg.sender);
    }

    function latestRecord() external view returns (AccuracyRecord memory) {
        require(counter > 0, "NO_RECORDS");
        return records[counter];
    }
}
