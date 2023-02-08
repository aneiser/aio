// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract AverageTask {

    // Variables
    struct AverageConfig {
        string tokenName;
        bool isActive;
        uint ammount;
        uint frequency;
    }

    mapping (address => AverageConfig) tokensToAverage;


    //  Events
    event AverageTaskCreated          (address tokenAddress, string tokenName, bool isActive, uint ammount, uint frequency);
    event StatusAverageTaskUpdated    (address tokenAddress,                   bool isActive);
    event AmmountAverageTaskUpdated   (address tokenAddress,                                  uint ammount);
    event FrequencyAverageTaskUpdated (address tokenAddress,                                                uint frequency);
    event AverageTaskUpdated          (address tokenAddress,                   bool isActive, uint ammount, uint frequency);
    event AverageTaskDeleted          (address tokenAddress);


    // Functions
    // CRUD functions
    // Create
    function createAverageTask(address _tokenAddress, string memory _tokenName, bool _isActive, uint _ammount, uint _frequency) public {
        tokensToAverage[_tokenAddress].tokenName = _tokenName;
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].ammount = _ammount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AverageTaskCreated(_tokenAddress,  _tokenName, _isActive, _ammount, _frequency);
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

    function updateAmmountAverageTask(address _tokenAddress, uint _ammount) public {
        tokensToAverage[_tokenAddress].ammount = _ammount;

        emit AmmountAverageTaskUpdated(_tokenAddress, _ammount);
    }

    function updateFrequencyAverageTask(address _tokenAddress, uint _frequency) public {
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit FrequencyAverageTaskUpdated(_tokenAddress, _frequency);
    }

    function updateAverageTask(address _tokenAddress, bool _isActive, uint _ammount, uint _frequency) public {
        tokensToAverage[_tokenAddress].isActive = _isActive;
        tokensToAverage[_tokenAddress].ammount = _ammount;
        tokensToAverage[_tokenAddress].frequency = _frequency;

        emit AverageTaskUpdated(_tokenAddress, _isActive, _ammount, _frequency);
    }

    // Delete
    function deleteAverageTask(address _tokenAddress) public {
        delete tokensToAverage[_tokenAddress];

        emit AverageTaskDeleted(_tokenAddress);
    }

}