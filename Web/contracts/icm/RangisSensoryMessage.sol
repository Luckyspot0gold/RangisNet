// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title RangisSensoryMessage
 * @notice Emits cross-chain ICM messages with multi-sensory feedback data
 * @dev Integrates with Avalanche Teleporter for cross-chain messaging
 * 
 * Features:
 * - Send sensory feedback (PRM, frequency, haptic, phonic) across chains
 * - Support for C-Chain → DFK L1 messaging
 * - Native token fees for relayer incentives
 * - Event emission for off-chain tracking
 * 
 * @author Reality Protocol LLC
 * @custom:security-contact justin@realityprotocol.io
 */

// Note: In production, import from @avalabs/icm-contracts
// For prototype, we define minimal interfaces

interface ITeleporterMessenger {
    struct TeleporterFeeInfo {
        address feeTokenAddress;
        uint256 amount;
    }
    
    struct TeleporterMessageInput {
        bytes32 destinationChainID;
        address destinationAddress;
        TeleporterFeeInfo feeInfo;
        uint256 requiredGasLimit;
        address[] allowedRelayerAddresses;
        bytes message;
    }
    
    function sendCrossChainMessage(
        TeleporterMessageInput calldata messageInput
    ) external payable returns (bytes32 messageID);
}

contract RangisSensoryMessage {
    // ============================================================================
    // State Variables
    // ============================================================================
    
    ITeleporterMessenger public immutable teleporterMessenger;
    
    // ============================================================================
    // Structs
    // ============================================================================
    
    struct SensoryData {
        uint256 prm;              // Probability Resonance Metric (0-1000, scaled by 1000)
        uint256 frequency;        // Harmonic frequency (432-1432 Hz)
        string hapticPattern;     // "pulse", "wave", "buzz", "alert"
        string phonicWaveform;    // "sine", "triangle", "sawtooth", "square"
        string recommendation;    // "SEND", "WAIT", "REJECT"
        address user;             // User address
        uint256 timestamp;        // Block timestamp
    }
    
    // ============================================================================
    // Events
    // ============================================================================
    
    event SensoryFeedbackSent(
        bytes32 indexed messageID,
        bytes32 indexed destinationChainID,
        address indexed user,
        SensoryData sensoryData
    );
    
    event LocalSensoryFeedback(
        address indexed user,
        uint256 prm,
        uint256 frequency,
        string recommendation
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
     * @notice Send cross-chain sensory feedback via ICM
     * @param destinationChainID Destination chain ID (e.g., DFK L1)
     * @param destinationContract Address of RangisSensoryReceiver on destination
     * @param prm Probability Resonance Metric (0-1000)
     * @param frequency Harmonic frequency (432-1432 Hz)
     * @param hapticPattern Haptic feedback pattern
     * @param phonicWaveform Phonic waveform type
     * @param recommendation Trading recommendation
     * @return messageID ICM message ID for tracking
     */
    function sendCrossChainSensory(
        bytes32 destinationChainID,
        address destinationContract,
        uint256 prm,
        uint256 frequency,
        string memory hapticPattern,
        string memory phonicWaveform,
        string memory recommendation
    ) external payable returns (bytes32 messageID) {
        require(destinationContract != address(0), "Invalid destination");
        require(prm <= 1000, "PRM must be <= 1000");
        require(frequency >= 432 && frequency <= 1432, "Frequency out of range");
        
        SensoryData memory data = SensoryData({
            prm: prm,
            frequency: frequency,
            hapticPattern: hapticPattern,
            phonicWaveform: phonicWaveform,
            recommendation: recommendation,
            user: msg.sender,
            timestamp: block.timestamp
        });
        
        // Encode sensory data
        bytes memory message = abi.encode(data);
        
        // Send via Teleporter (ICM)
        messageID = teleporterMessenger.sendCrossChainMessage{value: msg.value}(
            ITeleporterMessenger.TeleporterMessageInput({
                destinationChainID: destinationChainID,
                destinationAddress: destinationContract,
                feeInfo: ITeleporterMessenger.TeleporterFeeInfo({
                    feeTokenAddress: address(0), // Native token (AVAX)
                    amount: msg.value
                }),
                requiredGasLimit: 200000, // Gas limit for destination execution
                allowedRelayerAddresses: new address[](0), // Allow any relayer
                message: message
            })
        );
        
        emit SensoryFeedbackSent(messageID, destinationChainID, msg.sender, data);
    }
    
    /**
     * @notice Emit local sensory feedback without cross-chain messaging
     * @dev Useful for single-chain analysis
     * @param prm Probability Resonance Metric (0-1000)
     * @param frequency Harmonic frequency (432-1432 Hz)
     * @param recommendation Trading recommendation
     */
    function emitLocalSensory(
        uint256 prm,
        uint256 frequency,
        string memory recommendation
    ) external {
        require(prm <= 1000, "PRM must be <= 1000");
        require(frequency >= 432 && frequency <= 1432, "Frequency out of range");
        
        emit LocalSensoryFeedback(msg.sender, prm, frequency, recommendation);
    }
    
    // ============================================================================
    // View Functions
    // ============================================================================
    
    /**
     * @notice Get the Teleporter messenger address
     * @return Address of the Teleporter messenger contract
     */
    function getTeleporterMessenger() external view returns (address) {
        return address(teleporterMessenger);
    }
}
