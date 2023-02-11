// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDaiToken is ERC20 {
  constructor() ERC20("MockDaiToken", "mockDAI") {
    // num * 10^decimals. decimals = 18
    _mint(msg.sender, 10000 * 10 ** decimals());
  }
}