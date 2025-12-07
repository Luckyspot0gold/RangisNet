// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Mock contracts for local testing
 * @notice Simulates Polly Oracle and IBP Wallet for development
 */

contract PollyOracleMock {
    
    mapping(string => uint256) private prmScores;
    
    constructor() {
        // Pre-populate some pairs
        prmScores["AVAX/USD"] = 85;
        prmScores["ETH/USD"] = 78;
        prmScores["BTC/USD"] = 92;
    }
    
    function getPRMScore(string memory pair) external view returns (uint256) {
        uint256 score = prmScores[pair];
        if (score == 0) {
            // Return random-ish score based on block
            return 50 + (block.timestamp % 50);
        }
        return score;
    }
    
    function getHarmonicFrequency(uint256 prmScore) external pure returns (uint256) {
        if (prmScore >= 90) return 528;  // DNA harmony
        if (prmScore >= 75) return 432;  // Base harmonic
        return 396;  // Lower frequency for uncertainty
    }
    
    function setPRMScore(string memory pair, uint256 score) external {
        require(score <= 100, "Score must be 0-100");
        prmScores[pair] = score;
    }
}

contract IBPWalletMock {
    
    mapping(address => uint256) private balances;
    
    event Deposit(address indexed owner, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);
    event FeeDeducted(address indexed owner, uint256 amount);
    
    function deposit(address owner) external payable {
        balances[owner] += msg.value;
        emit Deposit(owner, msg.value);
    }
    
    function checkBalance(address owner) external view returns (uint256) {
        return balances[owner];
    }
    
    function deductFee(address owner, uint256 amount) external {
        require(balances[owner] >= amount, "Insufficient balance");
        balances[owner] -= amount;
        emit FeeDeducted(owner, amount);
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}
