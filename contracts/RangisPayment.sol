// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // USDC

contract RangisPayment {
  IERC20 public usdc; // Fuji USDC address
  mapping(address => uint256) public balances;

  event PaymentProcessed(address user, uint256 amount, bool success);

  constructor(address _usdc) { usdc = IERC20(_usdc); }

  function processMicropayment(uint256 amount, bytes calldata prmData) external {
    require(usdc.transferFrom(msg.sender, address(this), amount), "Payment failed");
    // Decode prmData (from PTE) for validation with error handling
    require(prmData.length > 0, "Invalid PRM data: empty");
    (bool valid) = abi.decode(prmData, (bool));
    require(valid, "Invalid PRM data: validation failed");
    balances[msg.sender] += amount; // Credit for premium access
    emit PaymentProcessed(msg.sender, amount, valid);
  }
}
