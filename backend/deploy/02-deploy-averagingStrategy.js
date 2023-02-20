const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("02-deploy-averagingStrategy.js")
    log("------------------------------------------------------------------------------------------------------------")

    const AveragingStrategyUpkeepRunner = await get("AveragingStrategyUpkeepRunner")
    arguments = [
        AveragingStrategyUpkeepRunner.address,
        process.env.GOERLI_CHAINLINK_LINK_TOKEN_ADDRESS,
        process.env.GOERLI_CHAINLINK_AUTOMATION_REGISTRAR_ADDRESS,
        process.env.GOERLI_CHAINLINK_AUTOMATION_REGISTRY_ADDRESS
    ]

    const AveragingStrategy = await deploy("AveragingStrategy", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    // If deploying to localhost, (for dev/testing purposes) need to deploy own ERC20
    if (developmentChains.includes(network.name)) {
        const MockDaiTokenContract = await hre.ethers.getContractFactory("MockDaiToken");
        mockDai = await MockDaiTokenContract.deploy();
        await mockDai.deployed()
        let DAITokenAddress = mockDai.address
        console.log('deploying "mockDai address": deployed at ' + DAITokenAddress);
    }

    // Verify the smart contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("------------------------------------------------------------------------------------------------------------")
        log("Verifying...")
        await verify(AveragingStrategy.address, arguments)
    }
    log("")
}

// TODO update DAI address to goerli
module.exports.tags = ["all", "averagingStrategy", "main"]