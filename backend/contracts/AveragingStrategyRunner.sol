pragma solidity ^0.4.24;

// interface Aion
contract Aion {
    uint256 public serviceFee;
    function ScheduleCall(uint256 blocknumber, address to, uint256 value, uint256 gaslimit, uint256 gasprice, bytes data, bool schedType) public payable returns (uint,address);
}

// Main contract
contract AveragingStrategyRunner{
    Aion aion;
    // Set limit to avoid run out of goerliETH
    uint8 limiter = 5;

    event CurrentTimestamp(string text);
    event Countdown(uint8 value);

    constructor() public payable {
        scheduleEmitAveragingStrategyConfigs();
    }

    function scheduleEmitAveragingStrategyConfigs() public {
        aion = Aion(0xFcFB45679539667f7ed55FA59A15c8Cad73d9a4E);
        bytes memory data = abi.encodeWithSelector(bytes4(keccak256('emitAveragingStrategyConfigs()')));
        uint callCost = 200000*1e9 + aion.serviceFee();
        aion.ScheduleCall.value(callCost)(block.timestamp + 1 minutes, address(this), 0, 200000000, 1e9, data, true);
    }

    function emitAveragingStrategyConfigs() public {
        // do your task here and call again the function to schedule
        if (limiter > 0) {
            emit CurrentTimestamp("I'm alive");
            limiter--;
            emit Countdown(limiter);
        }
        scheduleEmitAveragingStrategyConfigs();
    }

    function getLimiter() public view returns (uint8) {
        return limiter;
    }

    function () public payable {}

}