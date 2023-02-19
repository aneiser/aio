// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

// UpkeepIDConsumerExample.sol imports functions from both ./AutomationRegistryInterface1_2.sol and
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

contract UpkeepIDConsumerExample {
    LinkTokenInterface public immutable i_link;
    address public immutable registrar;
    AutomationRegistryInterface public immutable i_registry;
    bytes4 registerSig = KeeperRegistrarInterface.register.selector;

    constructor(
        LinkTokenInterface _link,
        address _registrar,
        AutomationRegistryInterface _registry
    ) {
        i_link = _link;         // GOERLI_LINK_ADDRESS:      0x326C977E6efc84E512bB9C30f76E30c160eD06FB (https://docs.chain.link/resources/link-token-contracts/)
        registrar = _registrar; // GOERLI_REGISTRAR_ADDRESS: 0x02777053d6764996e594c3E88AF1D58D5363a2e6
        i_registry = _registry; // GOERLI_REGISTRY_ADDRESS:  0x9806cf6fBc89aBF286e8140C42174B94836e36F2
    }

    function registerAndPredictID(
        string memory name,
        bytes calldata encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes calldata checkData,
        uint96 amount,
        uint8 source
    ) public {
        // Gets, previous to the creation of the upkeep, the state and...
        (State memory state, Config memory _c, address[] memory _k) = i_registry.getState();
        // ...the old nonce of the registry to later generate an upkeepID
        uint256 oldNonce = state.nonce;

        // Encodes a payload to be used on the creation of the upkeep
        bytes memory payload = abi.encode(
            // Official Chainlink registerAndPredictID Parameters (https://docs.chain.link/chainlink-automation/register-upkeep/#register-an-upkeep-using-your-own-deployed-contract)
            // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // name           Name of Upkeep
            // encryptedEmail Not in use in programmatic registration. Please specify with 0x
            // upkeepContract Address of Keepers-compatible contract that will be automated
            // gasLimit       The maximum amount of gas that will be used to execute your function on-chain
            // adminAddress   Address for Upkeep administrator. Upkeep administrator can fund contract.
            // checkData      ABI-encoded fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)
            // amount         The amount of LINK (in Wei) to fund your Upkeep. The minimum amount is 5 LINK. To fund 5 LINK please set this to 5000000000000000000
            // source         Not in use in programmatic registration. Please specify with 0.
            name,          // name           Will be the averagingStrategyId passed as argument
            encryptedEmail,// encryptedEmail = hex""
            upkeepContract,// upkeepContract The compatible Upkeep Contract address to automate. The one with checkUpkeep() and performUpkeep(). More info:https://docs.chain.link/chainlink-automation/compatible-contracts
            gasLimit,      // gasLimit       = 3000000 for example, later could be parametrized
            adminAddress,  // adminAddress   = msg.sender Your wallet address from which you've deployed, sent LINK etc.
            checkData,     // checkData      = hex""?
            amount,        // amount         = 5000000000000000000 (the min)
            source,        // source         = 0
            address(this)   // sender         this is the UpkeepIDConsumerExample's address. In this example it's the calling contract itself.
        );

        // Creates the upkeep
        i_link.transferAndCall(
            registrar,
            amount,
            bytes.concat(registerSig, payload)
        );

        // Get, after the creation of the upkeep, the state and...
        (state, _c, _k) = i_registry.getState();
        // ...the new nonce of the registry to...
        uint256 newNonce = state.nonce;
        if (newNonce == oldNonce + 1) {
            // ...generate a random upkeepID
            uint256 upkeepID = uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(i_registry),
                        uint32(oldNonce)
                    )
                )
            );
            // DEV - Use the upkeepID however you see fit
            // @TODO añadirlo a la configuración d ela estreategia?
        } else {
            revert("auto-approve disabled");
        }
    }
}
