const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Unit tests for AveragingStrategy.sol smartcontract", async function () {
        let accounts;
        let DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        let WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
        let AMOUNT = 2;
        let UNDER_AMOUNT = 1;
        let UNDER_FREQUENCY = 59; // 50 seconds
        let FREQUENCY = 60;  // 60 seconds
        let OVER_FREQUENCY = 31557601; // 12 months + 1 second
        let MAX_STRATEGIES = 10;

        before(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            user = accounts[1]
        })

        describe("createAveragingStrategy", async function () {
            beforeEach(async () => {
                // Deployment
                await deployments.fixture(["averagingStrategy"])
                avgStrgy = await ethers.getContract("AveragingStrategy")

                // Define a correct strategy sample
                correctStrategySample = {
                    sourceToken: DAI_ADDRESS,
                    averagedToken: WBTC_ADDRESS,
                    amount: AMOUNT,
                    frequency: FREQUENCY,
                    isActive: true,
                    averagingStrategyId: 1,
                    creationTimestamp: 1
                }
            })

            it("... should NOT 'createAveragingStrategy' if more than 10 averaging strategies at the same time", async function () {
                let { averagedToken, sourceToken, isActive, amount, frequency } = correctStrategySample;
                for (let index = 0; index < MAX_STRATEGIES+1; index++) {
                    avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, index+2, frequency)
                    if (index >= MAX_STRATEGIES){
                        await expect(avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, amount, frequency))
                            .to.be.revertedWith("You cannot have more than 10 averaging strategies at the same time.")
                        }
                    }
            })

            it("... should NOT 'createAveragingStrategy' if two same tokens", async function () {
                let { averagedToken, sourceToken, isActive, amount, frequency } = correctStrategySample;
                averagedToken = sourceToken
                await expect(avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, amount, frequency))
                    .to.be.revertedWith("You must use two different tokens.")
            })

            it("... should NOT 'createAveragingStrategy' if less than amount 2 source token", async function () {
                let { averagedToken, sourceToken, isActive, amount, frequency } = correctStrategySample;
                amount = UNDER_AMOUNT
                await expect(avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, amount, frequency))
                    .to.be.revertedWith("The minimum amount to spend is 2.")
            })

            it("... should NOT 'createAveragingStrategy' if less than 1 minute frequency", async function () {
                let { averagedToken, sourceToken, isActive, amount, frequency } = correctStrategySample;
                frequency = UNDER_FREQUENCY
                await expect(avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, amount, frequency))
                    .to.be.revertedWith("The minimum frequency is 1 minute.")
            })

            it("... should NOT 'createAveragingStrategy' if more than 12 months frequency", async function () {
                let { averagedToken, sourceToken, isActive, amount, frequency } = correctStrategySample;
                frequency = OVER_FREQUENCY
                await expect(avgStrgy.connect(user).createAveragingStrategy(averagedToken, sourceToken, isActive, amount, frequency))
                    .to.be.revertedWith("The maximun frequency is 12 months.")
            })

            it("... should 'createAveragingStrategy' if less than 10 strategies and different tokens", async function () {
                // Create a correct strategy sample
                await expect(avgStrgy.connect(user).createAveragingStrategy(
                    WBTC_ADDRESS, // averagedToken
                    DAI_ADDRESS,  // sourceToken
                    true,         // isActive
                    AMOUNT,       // amount
                    FREQUENCY,    // frequency
                ))
                // await expect(avgStrgy.createAveragingStrategy(WBTC_ADDRESS, DAI_ADDRESS, true, AMOUNT, FREQUENCY))
                    .to.emit(avgStrgy, "AveragingStrategyCreated")
                    .withArgs(
                        WBTC_ADDRESS, // averagedToken
                        DAI_ADDRESS,  // sourceToken
                        true,         // isActive
                        AMOUNT,       // amount
                        FREQUENCY,    // frequency
                        0             // averagingStrategyId
                    )

                // Post-conditions evaluation
                strategiesRead = await avgStrgy.connect(user).readAveragingStrategy()
                strategy = strategiesRead[0]
                assert(strategy.averagedToken == WBTC_ADDRESS)
                assert(strategy.sourceToken == DAI_ADDRESS)
                assert(Number(strategy.amount) == AMOUNT)
                assert(Number(strategy.frequency) == FREQUENCY)
                assert(strategy.isActive == true)
                assert(Number(strategy.averagingStrategyId) == 0)
            })
        })
    })