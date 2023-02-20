const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("02-deploy-averagingStrategyUpkeepRunner.js")
    log("------------------------------------------------------------------------------------------------------------")
    arguments = []
    const AveragingStrategyUpkeepRunner = await deploy("AveragingStrategyUpkeepRunner", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    // Verify the smart contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("------------------------------------------------------------------------------------------------------------")
        log("Verifying...")
        await verify(AveragingStrategyUpkeepRunner.address, arguments)
    }
    log("")
}

// TODO update DAI address to goerli
// TODO ...so the AveragingStrategyUpkeepRunner goes before than...
// TODO ...AveragingStrategyUpkeepRegistrar so this can get its deployed address
module.exports.tags = ["all", "averagingStrategyUpkeepRunner", "main"]