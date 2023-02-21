// SPDX-License-Identifier: UNLICENSED

// Pragma statements
pragma solidity 0.8.17;

// Contracts
contract AveragingStrategy {
    // Type declarations
    // -------------------------------------------------------------------------
    struct AveragingStrategyConfig {
        address sourceToken;
        address averagedToken;
        bool isActive;
        uint amount;
        uint frequency;
        uint averagingStrategyId;
        uint creationTimestamp;
    }


    // (Internal) State variables ----------------------------------------------
    uint averagingStrategiesCounter = 0;
    address[] averagingAddresses;
    mapping (address => AveragingStrategyConfig[]) averagingStrategiesList;


    // Events ------------------------------------------------------------------
    event AveragingStrategyCreated          (address averagedToken, address sourceToken, bool isActive, uint amount, uint frequency, uint averagingStrategyId);
    event StatusAveragingStrategyUpdated    (address averagedToken,                      bool isActive);
    event AmountAveragingStrategyUpdated    (address averagedToken,                                     uint amount);
    event FrequencyAveragingStrategyUpdated (address averagedToken,                                                  uint frequency);
    event AveragingStrategyUpdated          (address averagedToken,                      bool isActive, uint amount, uint frequency);
    event AveragingStrategyDeleted          (address averagedToken);


    // Functions ---------------------------------------------------------------
    // CRUD functions
    // Create
    // TODO: onlyOwner
    function createAveragingStrategy(address _averagedToken, address _sourceToken, bool _isActive, uint _amount, uint _frequency) public {
        require(averagingStrategiesList[msg.sender].length < 10, 'You cannot have more than 10 averaging strategies at the same time.');
        require(_frequency >= 60, 'The minimum frequency is 1 minute.');
        require(_frequency <= 31557600, 'The maximun frequency is 12 months.'); // 31557600 seconds = 12 months

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