const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------------------------")
    log("01-deploy-averagingStrategy.js")
    log("----------------------------------------------------------------------")
    arguments = []
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
        console.log("mockDai address: " + DAITokenAddress);
    }
    log("----------------------------------------------------------------------")

    // Verify the smart contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(AveragingStrategy.address, arguments)
    }
    log("======================================================================")
}

// TODO update DAI address to goerli
// TODO ...so the AveragingStrategyUpkeepRunner goes before than...
// TODO ...AveragingStrategyUpkeepRegistrar so this can get its deployed address
module.exports.tags = ["all", "averagingStrategy", "main"]