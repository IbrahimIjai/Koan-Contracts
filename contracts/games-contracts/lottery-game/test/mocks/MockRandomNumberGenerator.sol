// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRandomNumberGenerator} from "../../src/interfaces/IRandomNumberGenerator.sol";

contract MockRandomNumberGenerator is IRandomNumberGenerator {
    address public lottery;
    uint256 public latestLotteryId;
    uint32 public randomResult;
    uint256 public requestCount;

    modifier onlyLottery() {
        require(msg.sender == lottery, "Only lottery");
        _;
    }

    function setLottery(address lottery_) external {
        lottery = lottery_;
    }

    function setRandomResult(uint32 randomResult_) external {
        randomResult = randomResult_;
    }

    function getLotteryWinningNumber() external onlyLottery {
        requestCount++;
    }

    function viewLatestLotteryId() external view returns (uint256) {
        return latestLotteryId;
    }

    function setLatestLotteryId(uint256 latestLotteryId_) external onlyLottery {
        latestLotteryId = latestLotteryId_;
    }

    function viewRandomResult() external view returns (uint32) {
        return randomResult;
    }
}
