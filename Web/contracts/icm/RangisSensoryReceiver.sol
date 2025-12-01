// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title RangisSensoryReceiver
 * @notice Receives cross-chain ICM messages with sensory feedback and triggers actions
 * @dev Implements ITeleporterReceiver for Avalanche Teleporter integration
 * 
 * Features:
 * - Receive sensory feedback from source chains (e.g., C-Chain)
 * - Trigger gaming actions based on recommendations
 * - Support for DFK JEWEL token operations
 * - Event emission for off-chain tracking
 * 
 * @author Reality Protocol LLC
 * @custom:security-contact justin@realityprotocol.io
 */

// Note: In production, import from @avalabs/icm-contracts
// For prototype, we define minimal interfaces

interface ITeleporterMessenger {
    // Minimal interface for verification
}

interface ITeleporterReceiver {
    function receiveTeleporterMessage(
        bytes32 sourceChainID,
        address originSenderAddress,
        bytes calldata message
    ) external;
}

contract RangisSensoryReceiver is ITeleporterReceiver {
    // ============================================================================
    // State Variables
    // ============================================================================
    
    ITeleporterMessenger public immutable teleporterMessenger;
    
    // Track latest sensory data per user
    mapping(address => SensoryData) public latestSensoryData;
    
    // Track message history
    mapping(bytes32 => bool) public processedMessages;
    
    // ============================================================================
    // Structs
    // ============================================================================
    
    struct SensoryData {
        uint256 prm;
        uint256 frequency;
        string hapticPattern;
        string phonicWaveform;
        string recommendation;
        address user;
        uint256 timestamp;
    }
    
    // ============================================================================
    // Events
    // ============================================================================
    
    event SensoryFeedbackReceived(
        bytes32 indexed sourceChainID,
        address indexed user,
        SensoryData sensoryData
    );
    
    event GamingActionTriggered(
        address indexed user,
        string action,
        uint256 amount,
        uint256 timestamp
    );
    
    event DefenseActivated(
        address indexed user,
        string defenseType,
        uint256 timestamp
    );
    
    // ============================================================================
    // Constructor
    // ============================================================================
    
    constructor(address _teleporterMessenger) {
        require(_teleporterMessenger != address(0), "Invalid teleporter address");
        teleporterMessenger = ITeleporterMessenger(_teleporterMessenger);
    }
    
    // ============================================================================
    // External Functions
    // ============================================================================
    
    /**
     * @notice Receive cross-chain sensory feedback via Teleporter
     * @dev Only callable by Teleporter messenger
     * @param sourceChainID Source chain ID (e.g., C-Chain)
     * @param originSenderAddress Address of RangisSensoryMessage on source chain
     * @param message Encoded SensoryData
     */
    function receiveTeleporterMessage(
        bytes32 sourceChainID,
        address originSenderAddress,
        bytes calldata message
    ) external override {
        require(msg.sender == address(teleporterMessenger), "Unauthorized: not teleporter");
        
        // Decode sensory data
        SensoryData memory data = abi.decode(message, (SensoryData));
        
        // Validate data
        require(data.prm <= 1000, "Invalid PRM");
        require(data.frequency >= 432 && data.frequency <= 1432, "Invalid frequency");
        require(data.user != address(0), "Invalid user");
        
        // Store latest data
        latestSensoryData[data.user] = data;
        
        emit SensoryFeedbackReceived(sourceChainID, data.user, data);
        
        // Trigger action based on recommendation
        _processRecommendation(data);
    }
    
    // ============================================================================
    // Internal Functions
    // ============================================================================
    
    /**
     * @notice Process recommendation and trigger appropriate action
     * @param data Sensory data with recommendation
     */
    function _processRecommendation(SensoryData memory data) internal {
        bytes32 recommendationHash = keccak256(bytes(data.recommendation));
        
        if (recommendationHash == keccak256("SEND")) {
            _triggerBuyAction(data.user, data.prm);
        } else if (recommendationHash == keccak256("REJECT")) {
            _triggerDefenseAction(data.user, data.prm);
        } else if (recommendationHash == keccak256("WAIT")) {
            // No action, just store data
            emit GamingActionTriggered(data.user, "WAIT", 0, block.timestamp);
        }
    }
    
    /**
     * @notice Trigger buy action based on high PRM
     * @param user User address
     * @param prm Probability Resonance Metric (0-1000)
     */
    function _triggerBuyAction(address user, uint256 prm) internal {
        // Calculate buy amount based on PRM (higher PRM = more confident)
        // Scale: PRM 1000 = 100 units, PRM 500 = 50 units
        uint256 amount = (prm * 100) / 1000;
        
        emit GamingActionTriggered(user, "BUY_JEWEL", amount, block.timestamp);
        
        // In production: interact with DFK contracts to buy JEWEL
        // Example:
        // IJewelToken(jewelTokenAddress).mint(user, amount);
        // or
        // IDFKMarketplace(marketplaceAddress).buyJewel(user, amount);
    }
    
    /**
     * @notice Trigger defense action based on low PRM
     * @param user User address
     * @param prm Probability Resonance Metric (0-1000)
     */
    function _triggerDefenseAction(address user, uint256 prm) internal {
        // Determine defense type based on PRM severity
        string memory defenseType;
        
        if (prm < 200) {
            defenseType = "FULL_SHIELD"; // Very low PRM = full protection
        } else if (prm < 400) {
            defenseType = "PARTIAL_SHIELD"; // Low PRM = partial protection
        } else {
            defenseType = "ALERT_ONLY"; // Moderate PRM = just alert
        }
        
        emit DefenseActivated(user, defenseType, block.timestamp);
        emit GamingActionTriggered(user, "ACTIVATE_DEFENSE", prm, block.timestamp);
        
        // In production: interact with gaming contracts
        // Example:
        // IDefenseSystem(defenseAddress).activateShield(user, defenseType);
    }
    
    // ============================================================================
    // View Functions
    // ============================================================================
    
    /**
     * @notice Get latest sensory data for a user
     * @param user User address
     * @return SensoryData Latest sensory feedback data
     */
    function getLatestSensoryData(address user) external view returns (SensoryData memory) {
        return latestSensoryData[user];
    }
    
    /**
     * @notice Get the Teleporter messenger address
     * @return Address of the Teleporter messenger contract
     */
    function getTeleporterMessenger() external view returns (address) {
        return address(teleporterMessenger);
    }
    
    /**
     * @notice Check if user has received sensory feedback
     * @param user User address
     * @return bool True if user has data
     */
    function hasSensoryData(address user) external view returns (bool) {
        return latestSensoryData[user].user != address(0);
    }
}
