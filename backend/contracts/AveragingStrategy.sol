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
    event AveragingStrategyDeleted          (uint id);


    // Functions ---------------------------------------------------------------
    // CRUD functions
    // Create
    // TODO: onlyOwner
    function createAveragingStrategy(address _averagedToken, address _sourceToken, bool _isActive, uint _amount, uint _frequency) public {
        require(averagingStrategiesList[msg.sender].length < 10, 'You cannot have more than 10 averaging strategies at the same time.');
        require(_sourceToken != _averagedToken, 'You must use two different tokens.');
        require(_amount >= 1, 'The minimum amount to spend is 1.');
        require(_frequency >= 60, 'The minimum frequency is 1 minute.');
        require(_frequency <= 31557600, 'The maximun frequency is 12 months.'); // 31557600 seconds = 12 months
        // TODO evaluate require not repeat _averagedToken

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

        emit AveragingStrategyCreated(_averagedToken,  _sourceToken, _isActive, _amount, _frequency, averagingStrategiesCounter-1);
    }

    // Read
    function readAveragingStrategy() external view returns (AveragingStrategyConfig[] memory) {
        return averagingStrategiesList[msg.sender];
    }

    function getAveragingAddresses() public view returns (address[] memory) {
        return averagingAddresses;
    }

    // Update
    // To recover from git history for later use.

    // Delete
    function deleteAveragingStrategy(uint id) public {
        // Search among the user strategies...
        for (uint i = 0; i < averagingStrategiesList[msg.sender].length; i++) {
            // ...for the strategy with the same id...
            if (averagingStrategiesList[msg.sender][i].averagingStrategyId == id) {
                // ... to override it with the last item and...
                averagingStrategiesList[msg.sender][i] = averagingStrategiesList[msg.sender][averagingStrategiesList[msg.sender].length - 1];
                // ...then removes the last, now duplicated, item
                averagingStrategiesList[msg.sender].pop();

                // Increase strategies counter
                averagingStrategiesCounter++;

                emit AveragingStrategyDeleted(id);
                return;
            }
        }
        // ... if a strategy with the same id is not found, revert the transaction
        revert("Averaging strategy id not found.");
    }
}