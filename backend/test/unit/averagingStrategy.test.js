const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Unit tests for AveragingStrategy.sol smartcontract", async function () {
        let accounts;

        before(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            user = accounts[1]
        })
    })