const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("03-deploy-averagingStrategyUpkeepRegistrar.js")
    log("------------------------------------------------------------------------------------------------------------")

    const AveragingStrategyUpkeepRunner = await get("AveragingStrategyUpkeepRunner")
    arguments = [AveragingStrategyUpkeepRunner.address]

    const AveragingStrategyUpkeepRegistrar = await deploy("AveragingStrategyUpkeepRegistrar", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    // Verify the smart contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("------------------------------------------------------------------------------------------------------------")
        log("Verifying...")
        await verify(AveragingStrategyUpkeepRegistrar.address, arguments)
    }
    log("")
    log("")
}

// TODO update DAI address to goerli
module.exports.tags = ["all", "averagingStrategyUpkeepRegistrar", "main"]