// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

import "./AveragingStrategy.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract AveragingStrategyUpkeepRunner is AutomationCompatibleInterface {


    event AveragingStrategyExecuted (
        // address ownerAddress,
        address sourceToken,
        address averagedToken,
        bool isActive,
        uint amount,
        uint frequency,
        uint averagingStrategyId,
        uint creationTimestamp
    );

    // Chainlink automation functions
    function checkUpkeep(bytes calldata checkData) external view override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // Gets the address' averaging strategies passed on checkData
        AveragingStrategy.AveragingStrategyConfig[] memory averagingStrategies = abi.decode(checkData, (AveragingStrategy.AveragingStrategyConfig[]));

        // First gets number of elements requiring updates
        uint256 counter;
        for (uint i = 0; i < averagingStrategies.length; i++) {
            if (block.timestamp - averagingStrategies[i].creationTimestamp > averagingStrategies[i].frequency) {
                counter++;
            }
        }

        // Initializes array of elements requiring to average buy
        AveragingStrategy.AveragingStrategyConfig[] memory averagingStrategiesToUpdate = new AveragingStrategy.AveragingStrategyConfig[](counter);

        upkeepNeeded = false;
        uint256 indexCounter;

        // For each averaging strategy...
        for (uint i = 0; i < averagingStrategies.length; i++) {
            // ...if more time has passed than the defined frequency...
            if (block.timestamp - averagingStrategies[i].creationTimestamp > averagingStrategies[i].frequency) {
                upkeepNeeded = true;

                // ...store it in strategies to update
                averagingStrategiesToUpdate[indexCounter] = averagingStrategies[i];
                indexCounter++;
            }
        }
        performData = abi.encode(averagingStrategiesToUpdate);
        return (upkeepNeeded, performData);
    }


    function performUpkeep(bytes calldata performData) external override {
        // Gets the address' averaging strategies to update passed on performData
        AveragingStrategy.AveragingStrategyConfig[] memory averagingStrategiesToUpdate = abi.decode(performData, (AveragingStrategy.AveragingStrategyConfig[]));

        // important to always check that the data provided by the Automation Node is not corrupted.
        // require(indexes.length == increments.length, "indexes and increments arrays' lengths not equal");

        // For each averaging strategy to update...
        for (uint i = 0; i < averagingStrategiesToUpdate.length; i++) {
            // Chainlink highly recommends revalidating the upkeep in the performUpkeep function
            // ...if more time has passed than the defined frequency...
            if (block.timestamp - averagingStrategiesToUpdate[i].creationTimestamp > averagingStrategiesToUpdate[i].frequency) {
                // Update the timestamp for the next swap
                uint lastTimestamp = block.timestamp + averagingStrategiesToUpdate[i].frequency;

                // TODO Perform swap

                // TODO Update strategy values
                // averagingStrategiesToUpdate[i].creationTimestamp = lastTimestamp;
                // TODO updateAveragingStrategy()
                // Add averages, prices, etc to config object
                // TODO create function to update the averages, prices, etc

                // Test functionality to verify automation
                emit AveragingStrategyExecuted(
                    // averagingStrategiesToUpdate[i],
                    averagingStrategiesToUpdate[i].sourceToken,
                    averagingStrategiesToUpdate[i].averagedToken,
                    averagingStrategiesToUpdate[i].isActive,
                    averagingStrategiesToUpdate[i].amount,
                    averagingStrategiesToUpdate[i].frequency,
                    averagingStrategiesToUpdate[i].averagingStrategyId,
                    averagingStrategiesToUpdate[i].creationTimestamp
                );
            }
        }

    }
}
