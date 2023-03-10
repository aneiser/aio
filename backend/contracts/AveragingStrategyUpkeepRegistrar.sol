// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// AveragingStrategyUpkeepRegistrar.sol imports functions from both ./AutomationRegistryInterface1_2.sol and
// ./interfaces/LinkTokenInterface.sol

import {AutomationRegistryInterface, State, Config} from "@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface1_2.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

interface KeeperRegistrarInterface {
    function register(
        string memory name,
        bytes calldata encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes calldata checkData,
        uint96 amount,
        uint8 source,
        address sender
    ) external;
}

contract AveragingStrategyUpkeepRegistrar {
    bytes4 registerSig = KeeperRegistrarInterface.register.selector;
    uint public minFundingAmount = 5000000000000000000; //5 LINK
    address upkeepContract;
    LinkTokenInterface public immutable i_link;
    address public immutable registrar;
    AutomationRegistryInterface public immutable i_registry;

    constructor(
        address _upkeepContract,
        address _goerliChainlinkLinkTokenAddress,
        address _goerliChainlinkAutomationRegistrarAddress,
        address _goerliChainlinkAutomationRegistryAddress
    ) {
        upkeepContract = _upkeepContract;
        i_link = LinkTokenInterface(_goerliChainlinkLinkTokenAddress);
        registrar = _goerliChainlinkAutomationRegistrarAddress;
        i_registry = AutomationRegistryInterface(_goerliChainlinkAutomationRegistryAddress);
    }

    function registerAveragingStrategiesByAddress(
        string memory name,
        // TODO: Parametrized uint32 gasLimit,
        bytes calldata checkData
    ) public returns (uint256 upkeepID) { // TODO restrict to onlyOwner from OpenZeppelin
        // Gets, previous to the creation of the upkeep, the state and...
        (State memory state, Config memory _c, address[] memory _k) = i_registry.getState();
        // ...the old nonce of the registry to later generate an upkeepID
        uint256 oldNonce = state.nonce;

        // Encodes a payload to be used on the creation of the upkeep
        bytes memory payload = abi.encode(
            // Official Chainlink payload parameters (https://docs.chain.link/chainlink-automation/register-upkeep/#register-an-upkeep-using-your-own-deployed-contract)
            name,                                                 //           name: Name of Upkeep
            hex"",                                                // encryptedEmail: Not in use in programmatic registration. Please specify with 0x
            upkeepContract,                                       // upkeepContract: Address of Keepers-compatible contract that will be automated
            3000000, // for example, TODO parametrize             //       gasLimit: The maximum amount of gas that will be used to execute your function on-chain
            msg.sender,                                           //   adminAddress: Address for Upkeep administrator. Upkeep administrator can fund contract.
            checkData,                                            //      checkData: ABI-encoded fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)
            minFundingAmount,                                     //         amount: The amount of LINK (in Wei) to fund your Upkeep. The minimum amount is 5 LINK. To fund 5 LINK please set this to 5000000000000000000
            hex"",                                                //         source: Not in use in programmatic registration. Please specify with 0.
            address(this)                                         //         sender: = this is the AveragingStrategyUpkeepRegistrar's address. In this example it's the calling contract itself.
        );

        // Creates the upkeep
        i_link.transferAndCall(
            registrar,
            minFundingAmount,
            bytes.concat(registerSig, payload)
        );

        // Get, after the creation of the upkeep, the state and...
        (state, _c, _k) = i_registry.getState();
        // ...the new nonce of the registry to...
        uint256 newNonce = state.nonce;
        if (newNonce == oldNonce + 1) {
            // ...generate a random upkeepID
            upkeepID = uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(i_registry),
                        uint32(oldNonce)
                    )
                )
            );
            return upkeepID;
        } else {
            revert("auto-approve disabled");
        }

    }
}
