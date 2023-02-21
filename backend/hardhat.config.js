require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage")

const INFURA = process.env.INFURA || "";
const PK = process.env.PK || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    goerli: {
      url: INFURA,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17"
      }
    ]
  },
  gasReporter: {
    enabled: true,
  }
};
