require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
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
      },
      {
        version: "0.4.24"
      }
    ]
  },
};
