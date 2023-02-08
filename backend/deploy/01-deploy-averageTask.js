const { network } = require("hardhat")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------")
    arguments = []
    const AverageTask = await deploy("AverageTask", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
}

module.exports.tags = ["all", "averageTask", "main"]