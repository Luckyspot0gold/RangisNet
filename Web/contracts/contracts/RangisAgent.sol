// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title RangisAgent - Polly-Based On-Chain Agent
 * @notice Autonomous agent with spend limits and PRM-based decision making
 * @dev Integrates with IBP wallet and ICM/Teleporter for cross-chain operations
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IPollyOracle {
    function getPRMScore(string memory pair) external view returns (uint256);
    function getHarmonicFrequency(uint256 prmScore) external pure returns (uint256);
}

interface ITeleporterMessenger {
    struct FeeInfo {
        address feeTokenAddress;
        uint256 amount;
    }
    
    function sendCrossChainMessage(
        bytes32 destinationChainID,
        address destinationAddress,
        bytes memory message,
        uint256 gasLimit,
        FeeInfo memory feeInfo
    ) external returns (bytes32 messageID);
}

interface IIBPWallet {
    function checkBalance(address owner) external view returns (uint256);
    function deductFee(address owner, uint256 amount) external;
}

contract RangisAgent is Ownable, ReentrancyGuard {
    
    // Agent configuration
    struct AgentConfig {
        string agentId;
        uint8 personality; // 0=conservative, 1=moderate, 2=aggressive
        bool active;
        address ibpWallet;
        uint256 totalTrades;
        uint256 totalSpent;
    }
    
    // Spend limits
    struct SpendLimits {
        uint256 dailyLimit;
        uint256 weeklyLimit;
        uint256 monthlyLimit;
        uint256 yearlyLimit;
        uint256 dailySpent;
        uint256 weeklySpent;
        uint256 monthlySpent;
        uint256 yearlySpent;
        uint256 lastResetDaily;
        uint256 lastResetWeekly;
        uint256 lastResetMonthly;
        uint256 lastResetYearly;
    }
    
    // Trade decision
    struct TradeDecision {
        uint256 prmScore;       // 0-100 (confidence percentage)
        uint256 harmonicFreq;   // 432, 528, 639, etc.
        uint256 amount;         // Trade amount in wei
        uint256 timestamp;
        bool approved;
        string reasoning;
    }
    
    // State variables
    mapping(address => AgentConfig) public agents;
    mapping(address => SpendLimits) public spendLimits;
    mapping(address => TradeDecision[]) public tradeHistory;
    
    IPollyOracle public pollyOracle;
    ITeleporterMessenger public teleporter;
    IIBPWallet public ibpWallet;
    
    uint256 public constant PRM_THRESHOLD_CONSERVATIVE = 85; // 85%
    uint256 public constant PRM_THRESHOLD_MODERATE = 75;     // 75%
    uint256 public constant PRM_THRESHOLD_AGGRESSIVE = 60;   // 60%
    
    // Events
    event AgentCreated(address indexed agent, string agentId, uint8 personality);
    event TradeEvaluated(address indexed agent, uint256 prmScore, bool approved);
    event TradeExecuted(address indexed agent, uint256 amount, uint256 harmonicFreq);
    event SpendLimitUpdated(address indexed agent, string period, uint256 newLimit);
    event ICMWarpSent(address indexed agent, bytes32 messageId, bytes32 destinationChain);
    
    constructor(
        address _pollyOracle,
        address _teleporter,
        address _ibpWallet
    ) {
        pollyOracle = IPollyOracle(_pollyOracle);
        teleporter = ITeleporterMessenger(_teleporter);
        ibpWallet = IIBPWallet(_ibpWallet);
    }
    
    /**
     * @notice Create new agent with personality and spend limits
     */
    function createAgent(
        string memory agentId,
        uint8 personality,
        address ibpWalletAddress,
        uint256 dailyLimit,
        uint256 weeklyLimit,
        uint256 monthlyLimit,
        uint256 yearlyLimit
    ) external {
        require(personality <= 2, "Invalid personality");
        require(!agents[msg.sender].active, "Agent already exists");
        
        agents[msg.sender] = AgentConfig({
            agentId: agentId,
            personality: personality,
            active: true,
            ibpWallet: ibpWalletAddress,
            totalTrades: 0,
            totalSpent: 0
        });
        
        spendLimits[msg.sender] = SpendLimits({
            dailyLimit: dailyLimit,
            weeklyLimit: weeklyLimit,
            monthlyLimit: monthlyLimit,
            yearlyLimit: yearlyLimit,
            dailySpent: 0,
            weeklySpent: 0,
            monthlySpent: 0,
            yearlySpent: 0,
            lastResetDaily: block.timestamp,
            lastResetWeekly: block.timestamp,
            lastResetMonthly: block.timestamp,
            lastResetYearly: block.timestamp
        });
        
        emit AgentCreated(msg.sender, agentId, personality);
    }
    
    /**
     * @notice Evaluate trade using PRM scoring and spend limits
     */
    function evaluateTrade(
        string memory pair,
        uint256 amount
    ) external returns (TradeDecision memory) {
        require(agents[msg.sender].active, "Agent not active");
        
        // Reset spend limits if needed
        _resetSpendLimits(msg.sender);
        
        // Get PRM score from oracle
        uint256 prmScore = pollyOracle.getPRMScore(pair);
        
        // Get personality threshold
        uint256 threshold = _getThreshold(agents[msg.sender].personality);
        
        // Check confidence
        bool confidenceOk = prmScore >= threshold;
        
        // Check spend limits
        bool limitsOk = _checkSpendLimits(msg.sender, amount);
        
        // Create decision
        TradeDecision memory decision = TradeDecision({
            prmScore: prmScore,
            harmonicFreq: pollyOracle.getHarmonicFrequency(prmScore),
            amount: amount,
            timestamp: block.timestamp,
            approved: confidenceOk && limitsOk,
            reasoning: _generateReasoning(prmScore, threshold, limitsOk)
        });
        
        // Record decision
        tradeHistory[msg.sender].push(decision);
        
        emit TradeEvaluated(msg.sender, prmScore, decision.approved);
        
        return decision;
    }
    
    /**
     * @notice Execute approved trade with ICM warp
     */
    function executeTrade(
        bytes32 destinationChainID,
        address destinationAddress,
        uint256 amount,
        uint256 harmonicFreq,
        bytes memory hapticPattern
    ) external nonReentrant {
        require(agents[msg.sender].active, "Agent not active");
        
        // Get last decision
        TradeDecision[] storage history = tradeHistory[msg.sender];
        require(history.length > 0, "No pending decision");
        TradeDecision memory lastDecision = history[history.length - 1];
        require(lastDecision.approved, "Trade not approved");
        require(lastDecision.amount == amount, "Amount mismatch");
        
        // Check IBP wallet balance
        uint256 balance = ibpWallet.checkBalance(agents[msg.sender].ibpWallet);
        require(balance >= amount, "Insufficient IBP balance");
        
        // Deduct fee
        ibpWallet.deductFee(agents[msg.sender].ibpWallet, amount);
        
        // Update spend tracking
        _recordSpend(msg.sender, amount);
        
        // Encode sensory message
        bytes memory message = abi.encode(
            agents[msg.sender].agentId,
            lastDecision.prmScore,
            harmonicFreq,
            hapticPattern,
            amount,
            block.timestamp
        );
        
        // Send ICM warp
        bytes32 messageId = teleporter.sendCrossChainMessage(
            destinationChainID,
            destinationAddress,
            message,
            200000, // gas limit
            ITeleporterMessenger.FeeInfo({
                feeTokenAddress: address(0),
                amount: 0
            })
        );
        
        // Update agent stats
        agents[msg.sender].totalTrades++;
        agents[msg.sender].totalSpent += amount;
        
        emit TradeExecuted(msg.sender, amount, harmonicFreq);
        emit ICMWarpSent(msg.sender, messageId, destinationChainID);
    }
    
    /**
     * @notice Update spend limits
     */
    function updateSpendLimits(
        uint256 dailyLimit,
        uint256 weeklyLimit,
        uint256 monthlyLimit,
        uint256 yearlyLimit
    ) external {
        require(agents[msg.sender].active, "Agent not active");
        
        SpendLimits storage limits = spendLimits[msg.sender];
        limits.dailyLimit = dailyLimit;
        limits.weeklyLimit = weeklyLimit;
        limits.monthlyLimit = monthlyLimit;
        limits.yearlyLimit = yearlyLimit;
        
        emit SpendLimitUpdated(msg.sender, "all", 0);
    }
    
    /**
     * @notice Get agent statistics
     */
    function getAgentStats(address agent) external view returns (
        string memory agentId,
        uint256 totalTrades,
        uint256 totalSpent,
        uint256 avgPRMScore,
        uint256 dailyAvailable,
        uint256 weeklyAvailable,
        uint256 monthlyAvailable,
        uint256 yearlyAvailable
    ) {
        AgentConfig memory config = agents[agent];
        SpendLimits memory limits = spendLimits[agent];
        
        // Calculate average PRM
        uint256 sum = 0;
        TradeDecision[] memory history = tradeHistory[agent];
        for (uint256 i = 0; i < history.length; i++) {
            sum += history[i].prmScore;
        }
        uint256 avg = history.length > 0 ? sum / history.length : 0;
        
        return (
            config.agentId,
            config.totalTrades,
            config.totalSpent,
            avg,
            limits.dailyLimit - limits.dailySpent,
            limits.weeklyLimit - limits.weeklySpent,
            limits.monthlyLimit - limits.monthlySpent,
            limits.yearlyLimit - limits.yearlySpent
        );
    }
    
    // Internal functions
    
    function _getThreshold(uint8 personality) internal pure returns (uint256) {
        if (personality == 0) return PRM_THRESHOLD_CONSERVATIVE;
        if (personality == 1) return PRM_THRESHOLD_MODERATE;
        return PRM_THRESHOLD_AGGRESSIVE;
    }
    
    function _checkSpendLimits(address agent, uint256 amount) internal view returns (bool) {
        SpendLimits memory limits = spendLimits[agent];
        
        return (
            limits.dailySpent + amount <= limits.dailyLimit &&
            limits.weeklySpent + amount <= limits.weeklyLimit &&
            limits.monthlySpent + amount <= limits.monthlyLimit &&
            limits.yearlySpent + amount <= limits.yearlyLimit
        );
    }
    
    function _resetSpendLimits(address agent) internal {
        SpendLimits storage limits = spendLimits[agent];
        
        // Daily reset
        if (block.timestamp >= limits.lastResetDaily + 1 days) {
            limits.dailySpent = 0;
            limits.lastResetDaily = block.timestamp;
        }
        
        // Weekly reset
        if (block.timestamp >= limits.lastResetWeekly + 7 days) {
            limits.weeklySpent = 0;
            limits.lastResetWeekly = block.timestamp;
        }
        
        // Monthly reset (30 days)
        if (block.timestamp >= limits.lastResetMonthly + 30 days) {
            limits.monthlySpent = 0;
            limits.lastResetMonthly = block.timestamp;
        }
        
        // Yearly reset (365 days)
        if (block.timestamp >= limits.lastResetYearly + 365 days) {
            limits.yearlySpent = 0;
            limits.lastResetYearly = block.timestamp;
        }
    }
    
    function _recordSpend(address agent, uint256 amount) internal {
        SpendLimits storage limits = spendLimits[agent];
        limits.dailySpent += amount;
        limits.weeklySpent += amount;
        limits.monthlySpent += amount;
        limits.yearlySpent += amount;
    }
    
    function _generateReasoning(
        uint256 prmScore,
        uint256 threshold,
        bool limitsOk
    ) internal pure returns (string memory) {
        if (!limitsOk) {
            return "Spend limit exceeded";
        }
        if (prmScore >= threshold) {
            return "PRM confidence sufficient - trade approved";
        }
        return "PRM confidence below threshold - trade rejected";
    }
}
