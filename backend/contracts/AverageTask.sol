// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract AverageTask {

    // Variables
    struct AverageConfig {
        string tokenName;
        bool isActive;
        uint amount;
        uint frequency;
    }

    mapping (address => AverageConfig) tokensToAverage;


    //  Events
    event AverageTaskCreated          (address tokenAddress, string tokenName, bool isActive, uint amount, uint frequency);
    event StatusAverageTaskUpdated    (address tokenAddress,                   bool isActive);
    event AmountAverageTaskUpdated   (address tokenAddress,                                  uint amount);
    event FrequencyAverageTaskUpdated (address tokenAddress,                                                uint frequency);
    event AverageTaskUpdated          (address tokenAddress,                   bool isActive, uint amount, uint frequency);
    event AverageTaskDeleted          (address tokenAddress);


    // Functions
    // CRUD functions
    // Create
    function createAverageTask(address _tokenAddress, string memory _tokenName, bool _isActive, uint _amount, uint _frequency) public {
        tokensToAverage[_tokenAddress].tokenName = _tokenName;
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].amount = _amount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AverageTaskCreated(_tokenAddress,  _tokenName, _isActive, _amount, _frequency);
    }

    // Read
    function readAverageTask(address _tokenAddress) external view returns (AverageConfig memory) {
        return tokensToAverage[_tokenAddress];
    }

    // Update
    function updateStatusAverageTask(address _tokenAddress) public {
        tokensToAverage[_tokenAddress].isActive = !tokensToAverage[_tokenAddress].isActive;

        emit StatusAverageTaskUpdated(_tokenAddress, tokensToAverage[_tokenAddress].isActive);
    }

    function updateAmountAverageTask(address _tokenAddress, uint _amount) public {
        tokensToAverage[_tokenAddress].amount = _amount;

        emit AmountAverageTaskUpdated(_tokenAddress, _amount);
    }

    function updateFrequencyAverageTask(address _tokenAddress, uint _frequency) public {
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit FrequencyAverageTaskUpdated(_tokenAddress, _frequency);
    }

    function updateAverageTask(address _tokenAddress, bool _isActive, uint _amount, uint _frequency) public {
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].amount = _amount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AverageTaskUpdated(_tokenAddress, _isActive, _amount, _frequency);
    }

    // Delete
    function deleteAverageTask(address _tokenAddress) public {
        delete tokensToAverage[_tokenAddress];

        emit AverageTaskDeleted(_tokenAddress);
    }

}