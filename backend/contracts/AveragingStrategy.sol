// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract AveragingStrategy {

    // Variables
    struct AveragingStrategyConfig {
        address sourceToken;
        address averagedToken;
        bool isActive;
        uint amount;
        uint frequency;
    }

    mapping (address => AveragingStrategyConfig) averagingStrategiesList;


    //  Events
    event AveragingStrategyCreated          (address averagedToken, address sourceToken, bool isActive, uint amount, uint frequency);
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
        averagingStrategiesList[msg.sender].averagedToken = _averagedToken;
        averagingStrategiesList[msg.sender].sourceToken = _sourceToken;
        averagingStrategiesList[msg.sender].isActive = _isActive;
        averagingStrategiesList[msg.sender].amount = _amount;
        averagingStrategiesList[msg.sender].frequency = _frequency;

        emit AveragingStrategyCreated(_averagedToken,  _sourceToken, _isActive, _amount, _frequency);
    }

    // Read
    function readAveragingStrategy(address _averagedToken) external view returns (AveragingStrategyConfig memory) {
        return averagingStrategiesList[_averagedToken];
    }

    // Update
    function updateStatusAveragingStrategy(address _averagedToken) public {
        averagingStrategiesList[_averagedToken].isActive = !averagingStrategiesList[_averagedToken].isActive;

        emit StatusAveragingStrategyUpdated(_averagedToken, averagingStrategiesList[_averagedToken].isActive);
    }

    function updateAmountAveragingStrategy(address _averagedToken, uint _amount) public {
        averagingStrategiesList[_averagedToken].amount = _amount;

        emit AmountAveragingStrategyUpdated(_averagedToken, _amount);
    }

    function updateFrequencyAveragingStrategy(address _averagedToken, uint _frequency) public {
        averagingStrategiesList[_averagedToken].frequency = _frequency;

        emit FrequencyAveragingStrategyUpdated(_averagedToken, _frequency);
    }

    function updateAveragingStrategy(address _averagedToken, bool _isActive, uint _amount, uint _frequency) public {
        averagingStrategiesList[_averagedToken].isActive = _isActive;
        averagingStrategiesList[_averagedToken].amount = _amount;
        averagingStrategiesList[_averagedToken].frequency = _frequency;

        emit AveragingStrategyUpdated(_averagedToken, _isActive, _amount, _frequency);
    }

    // Delete
    function deleteAveragingStrategy(address _averagedToken) public {
        delete averagingStrategiesList[_averagedToken];

        emit AveragingStrategyDeleted(_averagedToken);
    }

}