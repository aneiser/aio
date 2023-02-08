// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract AveragingStrategy {

    // Variables
    struct AverageConfig {
        string tokenName;
        bool isActive;
        uint amount;
        uint frequency;
    }

    mapping (address => AverageConfig) tokensToAverage;


    //  Events
    event AveragingStrategyCreated          (address tokenAddress, string tokenName, bool isActive, uint amount, uint frequency);
    event StatusAveragingStrategyUpdated    (address tokenAddress,                   bool isActive);
    event AmountAveragingStrategyUpdated   (address tokenAddress,                                  uint amount);
    event FrequencyAveragingStrategyUpdated (address tokenAddress,                                                uint frequency);
    event AveragingStrategyUpdated          (address tokenAddress,                   bool isActive, uint amount, uint frequency);
    event AveragingStrategyDeleted          (address tokenAddress);


    // Functions
    // CRUD functions
    // Create
    function createAveragingStrategy(address _tokenAddress, string memory _tokenName, bool _isActive, uint _amount, uint _frequency) public {
        tokensToAverage[_tokenAddress].tokenName = _tokenName;
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].amount = _amount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AveragingStrategyCreated(_tokenAddress,  _tokenName, _isActive, _amount, _frequency);
    }

    // Read
    function readAveragingStrategy(address _tokenAddress) external view returns (AverageConfig memory) {
        return tokensToAverage[_tokenAddress];
    }

    // Update
    function updateStatusAveragingStrategy(address _tokenAddress) public {
        tokensToAverage[_tokenAddress].isActive = !tokensToAverage[_tokenAddress].isActive;

        emit StatusAveragingStrategyUpdated(_tokenAddress, tokensToAverage[_tokenAddress].isActive);
    }

    function updateAmountAveragingStrategy(address _tokenAddress, uint _amount) public {
        tokensToAverage[_tokenAddress].amount = _amount;

        emit AmountAveragingStrategyUpdated(_tokenAddress, _amount);
    }

    function updateFrequencyAveragingStrategy(address _tokenAddress, uint _frequency) public {
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit FrequencyAveragingStrategyUpdated(_tokenAddress, _frequency);
    }

    function updateAveragingStrategy(address _tokenAddress, bool _isActive, uint _amount, uint _frequency) public {
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].amount = _amount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AveragingStrategyUpdated(_tokenAddress, _isActive, _amount, _frequency);
    }

    // Delete
    function deleteAveragingStrategy(address _tokenAddress) public {
        delete tokensToAverage[_tokenAddress];

        emit AveragingStrategyDeleted(_tokenAddress);
    }

}