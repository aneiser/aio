// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./AveragingStrategyUpkeepRegistrer.sol";

contract AveragingStrategy {

    // Variables
    uint averagingStrategiesCounter = 0;
    address[] averagingAddresses;

    struct AveragingStrategyConfig {
        address sourceToken;
        address averagedToken;
        bool isActive;
        uint amount;
        uint frequency;
        uint averagingStrategyId;
        uint creationTimestamp;
    }

    mapping (address => AveragingStrategyConfig[]) averagingStrategiesList;
    mapping (address => uint256) upkeepIDList;


    //  Events
    event AveragingStrategyCreated          (address averagedToken, address sourceToken, bool isActive, uint amount, uint frequency, uint averagingStrategyId);
    event StatusAveragingStrategyUpdated    (address averagedToken,                      bool isActive);
    event AmountAveragingStrategyUpdated    (address averagedToken,                                     uint amount);
    event FrequencyAveragingStrategyUpdated (address averagedToken,                                                  uint frequency);
    event AveragingStrategyUpdated          (address averagedToken,                      bool isActive, uint amount, uint frequency);
    event AveragingStrategyDeleted          (address averagedToken);


    // Functions
    // CRUD functions
    // Create
    // TODO: onlyOwner
    function createAveragingStrategy(address _averagedToken, address _sourceToken, bool _isActive, uint _amount, uint _frequency) public {
        require(averagingStrategiesList[msg.sender].length < 10, 'You cannot have more than 10 averaging strategies at the same time.');

        AveragingStrategyUpkeepRegistrer registrer = new AveragingStrategyUpkeepRegistrer();

        // Add address to list, is it wasn't there already
        if (averagingStrategiesList[msg.sender].length == 0) {
            averagingAddresses.push(msg.sender);
        }

        // Add strategy to list
        averagingStrategiesList[msg.sender].push(
            AveragingStrategyConfig({
                sourceToken: _sourceToken,
                averagedToken: _averagedToken,
                amount: _amount,
                frequency: _frequency,
                isActive: _isActive,
                averagingStrategyId: averagingStrategiesCounter,
                creationTimestamp: block.timestamp
            })
        );

        // Increase strategies counter
        averagingStrategiesCounter++;

        // For each address...
        for (uint i = 0; i < averagingAddresses.length; i++) {
            // ...encodes its AveragingStrategyConfig[]...
            bytes memory encodedStrategies = abi.encode(averagingStrategiesList[averagingAddresses[i]]);
            // ...registers and upkeep, which ID is stored in upkeepIDList
            upkeepIDList[averagingAddresses[i]] = registrer.registerAveragingStrategiesByAddress(
                string(abi.encodePacked("AveragingStrategiesOf", averagingAddresses[i])), // name      Name of Upkeep
                // TODO: Parametrized gasLimit,                                           // gasLimit  The maximum amount of gas that will be used to execute your function on-chain
                encodedStrategies                                                         // checkData ABI-encoded fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)
            );
        }

        emit AveragingStrategyCreated(_averagedToken,  _sourceToken, _isActive, _amount, _frequency, averagingStrategiesCounter);
    }

    // Read
    function readAveragingStrategy() external view returns (AveragingStrategyConfig[] memory) {
        return averagingStrategiesList[msg.sender];
    }

    function getAveragingAddresses() public view returns (address[] memory) {
        return averagingAddresses;
    }

    // Update
    function updateStatusAveragingStrategy(address _averagedToken) public {
        // averagingStrategiesList[_averagedToken].isActive = !averagingStrategiesList[_averagedToken].isActive;

        // emit StatusAveragingStrategyUpdated(_averagedToken, averagingStrategiesList[_averagedToken].isActive);
    }

    function updateAmountAveragingStrategy(address _averagedToken, uint _amount) public {
        // averagingStrategiesList[_averagedToken].amount = _amount;

        emit AmountAveragingStrategyUpdated(_averagedToken, _amount);
    }

    function updateFrequencyAveragingStrategy(address _averagedToken, uint _frequency) public {
        // averagingStrategiesList[_averagedToken].frequency = _frequency;

        emit FrequencyAveragingStrategyUpdated(_averagedToken, _frequency);
    }

    function updateAveragingStrategy(address _averagedToken, bool _isActive, uint _amount, uint _frequency) public {
        // averagingStrategiesList[_averagedToken].isActive = _isActive;
        // averagingStrategiesList[_averagedToken].amount = _amount;
        // averagingStrategiesList[_averagedToken].frequency = _frequency;

        emit AveragingStrategyUpdated(_averagedToken, _isActive, _amount, _frequency);
    }

    // Delete
    function deleteAveragingStrategy(address _averagedToken) public {
        delete averagingStrategiesList[_averagedToken];

        emit AveragingStrategyDeleted(_averagedToken);
    }

}