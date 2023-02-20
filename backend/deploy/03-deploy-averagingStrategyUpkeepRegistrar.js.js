const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------------------------")
    log("03-deploy-averagingStrategyUpkeepRegistrar.js")
    log("----------------------------------------------------------------------")
    arguments = []
    const AveragingStrategyUpkeepRegistrar = await deploy("AveragingStrategyUpkeepRegistrar", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("----------------------------------------------------------------------")

    // Verify the smart contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(AveragingStrategyUpkeepRegistrar.address, arguments)
    }
    log("======================================================================")
}

// TODO update DAI address to goerli
// TODO ...so the AveragingStrategyUpkeepRunner goes before than...
// TODO ...AveragingStrategyUpkeepRegistrar so this can get its deployed address
module.exports.tags = ["all", "averagingStrategyUpkeepRegistrar", "main"]