// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RangisPayment is Ownable {
  IERC20 public usdc; // Fuji USDC address
  mapping(address => uint256) public balances;

  event PaymentProcessed(address indexed user, uint256 amount);
  event Withdrawal(address indexed user, uint256 amount);

  constructor(address _usdc) Ownable(msg.sender) { 
    usdc = IERC20(_usdc); 
  }

  function processMicropayment(uint256 amount, bytes calldata prmData) external {
    require(usdc.transferFrom(msg.sender, address(this), amount), "Payment failed");
    // Decode prmData (from PTE) for validation with error handling
    require(prmData.length > 0, "Invalid PRM data: empty");
    (bool valid) = abi.decode(prmData, (bool));
    require(valid, "Invalid PRM data: validation failed");
    balances[msg.sender] += amount; // Credit for premium access
    emit PaymentProcessed(msg.sender, amount);
  }

  // Allow users to withdraw their credited USDC balance
  function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;
    require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
    emit Withdrawal(msg.sender, amount);
  }

  // Allow owner to withdraw accumulated fees (if any)
  function ownerWithdraw(uint256 amount) external onlyOwner {
    require(usdc.transfer(owner(), amount), "USDC transfer failed");
  }
}
