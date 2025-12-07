// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title IBPWallet - Intent-Based Payment Wallet
 * @notice Agent-operated wallet with reputation scoring and spend tracking
 * @dev Integrates with RangisAgent for autonomous payments
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IBPWallet is ReentrancyGuard, Ownable {
    
    struct Wallet {
        address owner;
        uint256 nativeBalance;      // AVAX balance
        mapping(address => uint256) tokenBalances;  // ERC20 balances
        uint256 reputationScore;    // 0-1000 (based on trade history)
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 failedTrades;
        uint256 totalVolume;        // USD value of all trades
        bool active;
        uint256 createdAt;
    }
    
    struct TradeRecord {
        address wallet;
        string tradeType;           // "BUY", "SELL", "SWAP"
        uint256 amount;
        uint256 prmScore;           // Confidence at execution
        bool success;
        uint256 timestamp;
    }
    
    // State
    mapping(address => Wallet) private wallets;
    mapping(address => bool) public isAuthorizedAgent;
    TradeRecord[] public tradeHistory;
    
    // Constants
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant MIN_REPUTATION = 0;
    uint256 public constant INITIAL_REPUTATION = 500;
    
    // Events
    event WalletCreated(address indexed owner, uint256 initialReputation);
    event Deposited(address indexed owner, address token, uint256 amount);
    event Withdrawn(address indexed owner, address token, uint256 amount);
    event FeeDeducted(address indexed owner, uint256 amount, string reason);
    event TradeRecorded(address indexed wallet, string tradeType, bool success, uint256 newReputation);
    event ReputationUpdated(address indexed wallet, uint256 oldScore, uint256 newScore);
    event AgentAuthorized(address indexed agent, bool authorized);
    
    modifier onlyAuthorizedAgent() {
        require(isAuthorizedAgent[msg.sender], "Not authorized agent");
        _;
    }
    
    constructor() {
        // Owner is automatically authorized
        isAuthorizedAgent[msg.sender] = true;
    }
    
    /**
     * @notice Create new IBP wallet with initial reputation
     */
    function createWallet() external {
        require(!wallets[msg.sender].active, "Wallet already exists");
        
        Wallet storage wallet = wallets[msg.sender];
        wallet.owner = msg.sender;
        wallet.nativeBalance = 0;
        wallet.reputationScore = INITIAL_REPUTATION;
        wallet.totalTrades = 0;
        wallet.successfulTrades = 0;
        wallet.failedTrades = 0;
        wallet.totalVolume = 0;
        wallet.active = true;
        wallet.createdAt = block.timestamp;
        
        emit WalletCreated(msg.sender, INITIAL_REPUTATION);
    }
    
    /**
     * @notice Deposit native token (AVAX)
     */
    function depositNative() external payable {
        require(wallets[msg.sender].active, "Wallet not active");
        wallets[msg.sender].nativeBalance += msg.value;
        emit Deposited(msg.sender, address(0), msg.value);
    }
    
    /**
     * @notice Deposit ERC20 tokens
     */
    function depositToken(address token, uint256 amount) external {
        require(wallets[msg.sender].active, "Wallet not active");
        require(token != address(0), "Invalid token");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        wallets[msg.sender].tokenBalances[token] += amount;
        
        emit Deposited(msg.sender, token, amount);
    }
    
    /**
     * @notice Withdraw native token
     */
    function withdrawNative(uint256 amount) external nonReentrant {
        require(wallets[msg.sender].active, "Wallet not active");
        require(wallets[msg.sender].nativeBalance >= amount, "Insufficient balance");
        
        wallets[msg.sender].nativeBalance -= amount;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawn(msg.sender, address(0), amount);
    }
    
    /**
     * @notice Withdraw ERC20 tokens
     */
    function withdrawToken(address token, uint256 amount) external nonReentrant {
        require(wallets[msg.sender].active, "Wallet not active");
        require(wallets[msg.sender].tokenBalances[token] >= amount, "Insufficient balance");
        
        wallets[msg.sender].tokenBalances[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, token, amount);
    }
    
    /**
     * @notice Deduct fee (called by authorized agents)
     */
    function deductFee(address owner, uint256 amount) external onlyAuthorizedAgent {
        require(wallets[owner].active, "Wallet not active");
        require(wallets[owner].nativeBalance >= amount, "Insufficient balance");
        
        wallets[owner].nativeBalance -= amount;
        emit FeeDeducted(owner, amount, "Agent trade fee");
    }
    
    /**
     * @notice Record trade and update reputation
     */
    function recordTrade(
        address wallet,
        string memory tradeType,
        uint256 amount,
        uint256 prmScore,
        bool success
    ) external onlyAuthorizedAgent {
        require(wallets[wallet].active, "Wallet not active");
        
        Wallet storage w = wallets[wallet];
        uint256 oldReputation = w.reputationScore;
        
        // Update trade counts
        w.totalTrades++;
        if (success) {
            w.successfulTrades++;
        } else {
            w.failedTrades++;
        }
        w.totalVolume += amount;
        
        // Calculate new reputation
        uint256 newReputation = _calculateReputation(
            w.successfulTrades,
            w.failedTrades,
            w.totalTrades,
            prmScore
        );
        w.reputationScore = newReputation;
        
        // Record trade history
        tradeHistory.push(TradeRecord({
            wallet: wallet,
            tradeType: tradeType,
            amount: amount,
            prmScore: prmScore,
            success: success,
            timestamp: block.timestamp
        }));
        
        emit TradeRecorded(wallet, tradeType, success, newReputation);
        emit ReputationUpdated(wallet, oldReputation, newReputation);
    }
    
    /**
     * @notice Calculate reputation score
     * @dev Algorithm: Base (500) + success bonus - failure penalty + PRM bonus
     */
    function _calculateReputation(
        uint256 successful,
        uint256 failed,
        uint256 total,
        uint256 avgPRM
    ) internal pure returns (uint256) {
        if (total == 0) return INITIAL_REPUTATION;
        
        // Success rate (0-400 points)
        uint256 successRate = (successful * 100) / total;
        uint256 successBonus = (successRate * 4);
        
        // Failure penalty (0-200 points)
        uint256 failureRate = (failed * 100) / total;
        uint256 failurePenalty = (failureRate * 2);
        
        // PRM bonus (0-200 points)
        uint256 prmBonus = (avgPRM * 2);
        
        // Volume bonus (0-100 points)
        uint256 volumeBonus = total > 100 ? 100 : total;
        
        // Calculate final score
        uint256 score = INITIAL_REPUTATION + successBonus + prmBonus + volumeBonus;
        
        if (score > failurePenalty) {
            score -= failurePenalty;
        } else {
            score = MIN_REPUTATION;
        }
        
        // Cap at max
        if (score > MAX_REPUTATION) {
            score = MAX_REPUTATION;
        }
        
        return score;
    }
    
    /**
     * @notice Get wallet balance
     */
    function checkBalance(address owner) external view returns (uint256) {
        return wallets[owner].nativeBalance;
    }
    
    /**
     * @notice Get token balance
     */
    function checkTokenBalance(address owner, address token) external view returns (uint256) {
        return wallets[owner].tokenBalances[token];
    }
    
    /**
     * @notice Get wallet stats
     */
    function getWalletStats(address owner) external view returns (
        uint256 nativeBalance,
        uint256 reputationScore,
        uint256 totalTrades,
        uint256 successfulTrades,
        uint256 failedTrades,
        uint256 totalVolume,
        uint256 successRate
    ) {
        Wallet storage w = wallets[owner];
        uint256 rate = w.totalTrades > 0 ? (w.successfulTrades * 100) / w.totalTrades : 0;
        
        return (
            w.nativeBalance,
            w.reputationScore,
            w.totalTrades,
            w.successfulTrades,
            w.failedTrades,
            w.totalVolume,
            rate
        );
    }
    
    /**
     * @notice Get reputation score
     */
    function getReputationScore(address owner) external view returns (uint256) {
        return wallets[owner].reputationScore;
    }
    
    /**
     * @notice Get reputation tier
     */
    function getReputationTier(address owner) external view returns (string memory) {
        uint256 score = wallets[owner].reputationScore;
        
        if (score >= 900) return "Diamond";
        if (score >= 800) return "Platinum";
        if (score >= 700) return "Gold";
        if (score >= 600) return "Silver";
        if (score >= 500) return "Bronze";
        return "Copper";
    }
    
    /**
     * @notice Authorize agent contract
     */
    function authorizeAgent(address agent, bool authorized) external onlyOwner {
        isAuthorizedAgent[agent] = authorized;
        emit AgentAuthorized(agent, authorized);
    }
    
    /**
     * @notice Get total trade count
     */
    function getTotalTrades() external view returns (uint256) {
        return tradeHistory.length;
    }
    
    /**
     * @notice Get recent trades
     */
    function getRecentTrades(uint256 count) external view returns (TradeRecord[] memory) {
        uint256 total = tradeHistory.length;
        uint256 returnCount = count > total ? total : count;
        
        TradeRecord[] memory recent = new TradeRecord[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = tradeHistory[total - returnCount + i];
        }
        
        return recent;
    }
}
