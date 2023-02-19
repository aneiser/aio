const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------------------------")
    log("01-deploy-averageTask.js")
    log("----------------------------------------------------------------------")
    arguments = []
    const AveragingStrategy = await deploy("AveragingStrategy", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    const AveragingStrategyUpkeepRegistrar = await deploy("AveragingStrategyUpkeepRegistrar", {
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
        console.log("mockDai address: " + DAITokenAddress);
    }
    log("======================================================================")
}

module.exports.tags = ["all", "averagingStrategy", "main"]