// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title SensoryMessageSender - ICM/Teleporter Integration
 * @notice Sends sensory economic data across Avalanche subnets
 * @dev ERC-8004 compatible cross-chain messaging
 */

import "@teleporter/ITeleporterMessenger.sol";
import "@teleporter/ITeleporterReceiver.sol";

contract SensoryMessageSender {
    
    ITeleporterMessenger public immutable teleporterMessenger;
    
    struct SensoryPayload {
        string agentId;
        uint256 prmScore;         // 0-100 confidence
        uint256 harmonicFreq;     // 432, 528, 639 Hz
        bytes hapticPattern;      // Vibration timing array
        uint256 amountUSDC;       // Payment amount (6 decimals)
        string tradeCommand;      // "BUY AVAX 0.01"
        uint256 timestamp;
    }
    
    // Message tracking
    mapping(bytes32 => SensoryPayload) public sentMessages;
    mapping(bytes32 => bool) public messageDelivered;
    
    event SensoryWarpSent(
        bytes32 indexed messageId,
        bytes32 indexed destinationChainID,
        address indexed destinationAddress,
        uint256 prmScore,
        uint256 harmonicFreq
    );
    
    constructor(address teleporterAddress) {
        teleporterMessenger = ITeleporterMessenger(teleporterAddress);
    }
    
    /**
     * @notice Send sensory message via ICM/Teleporter
     * @dev Warps PRM score + harmonic + haptic data cross-chain
     */
    function sendSensoryWarp(
        bytes32 destinationChainID,
        address destinationAddress,
        SensoryPayload memory payload
    ) external payable returns (bytes32 messageId) {
        
        // Encode sensory data
        bytes memory message = abi.encode(
            payload.agentId,
            payload.prmScore,
            payload.harmonicFreq,
            payload.hapticPattern,
            payload.amountUSDC,
            payload.tradeCommand,
            payload.timestamp
        );
        
        // Send via Teleporter
        messageId = teleporterMessenger.sendCrossChainMessage(
            ITeleporterMessenger.CrossChainMessage({
                destinationBlockchainID: destinationChainID,
                destinationAddress: destinationAddress,
                feeInfo: ITeleporterMessenger.FeeInfo({
                    feeTokenAddress: address(0),
                    amount: 0
                }),
                requiredGasLimit: 200000,
                allowedRelayerAddresses: new address[](0),
                message: message
            })
        );
        
        // Store for tracking
        sentMessages[messageId] = payload;
        
        emit SensoryWarpSent(
            messageId,
            destinationChainID,
            destinationAddress,
            payload.prmScore,
            payload.harmonicFreq
        );
        
        return messageId;
    }
    
    /**
     * @notice Batch send multiple warps (for agent swarms)
     */
    function batchSendWarps(
        bytes32[] memory destinationChainIDs,
        address[] memory destinationAddresses,
        SensoryPayload[] memory payloads
    ) external payable returns (bytes32[] memory messageIds) {
        require(
            destinationChainIDs.length == destinationAddresses.length &&
            destinationAddresses.length == payloads.length,
            "Array length mismatch"
        );
        
        messageIds = new bytes32[](destinationChainIDs.length);
        
        for (uint256 i = 0; i < destinationChainIDs.length; i++) {
            messageIds[i] = this.sendSensoryWarp(
                destinationChainIDs[i],
                destinationAddresses[i],
                payloads[i]
            );
        }
        
        return messageIds;
    }
    
    /**
     * @notice Get warp status
     */
    function getWarpStatus(bytes32 messageId) external view returns (
        string memory agentId,
        uint256 prmScore,
        uint256 harmonicFreq,
        bool delivered
    ) {
        SensoryPayload memory payload = sentMessages[messageId];
        return (
            payload.agentId,
            payload.prmScore,
            payload.harmonicFreq,
            messageDelivered[messageId]
        );
    }
}


/**
 * @title SensoryMessageReceiver - Destination Chain Receiver
 * @notice Receives and processes sensory warps
 * @dev ITeleporterReceiver implementation
 */
contract SensoryMessageReceiver is ITeleporterReceiver {
    
    ITeleporterMessenger public immutable teleporterMessenger;
    
    struct ReceivedMessage {
        string agentId;
        uint256 prmScore;
        uint256 harmonicFreq;
        bytes hapticPattern;
        uint256 amountUSDC;
        string tradeCommand;
        uint256 timestamp;
        bytes32 sourceChainID;
        address sourceAddress;
    }
    
    // Received messages log
    ReceivedMessage[] public receivedMessages;
    mapping(bytes32 => uint256) public messageIdToIndex;
    
    event SensoryWarpReceived(
        bytes32 indexed messageId,
        bytes32 indexed sourceChainID,
        string agentId,
        uint256 prmScore,
        uint256 harmonicFreq
    );
    
    event TradeExecuted(
        string indexed agentId,
        string tradeCommand,
        uint256 amountUSDC,
        uint256 harmonicFreq
    );
    
    constructor(address teleporterAddress) {
        teleporterMessenger = ITeleporterMessenger(teleporterAddress);
    }
    
    /**
     * @notice Receive cross-chain message (ITeleporterReceiver)
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external {
        require(
            msg.sender == address(teleporterMessenger),
            "Only Teleporter can call"
        );
        
        // Decode sensory payload
        (
            string memory agentId,
            uint256 prmScore,
            uint256 harmonicFreq,
            bytes memory hapticPattern,
            uint256 amountUSDC,
            string memory tradeCommand,
            uint256 timestamp
        ) = abi.decode(message, (string, uint256, uint256, bytes, uint256, string, uint256));
        
        // Store received message
        ReceivedMessage memory received = ReceivedMessage({
            agentId: agentId,
            prmScore: prmScore,
            harmonicFreq: harmonicFreq,
            hapticPattern: hapticPattern,
            amountUSDC: amountUSDC,
            tradeCommand: tradeCommand,
            timestamp: timestamp,
            sourceChainID: sourceBlockchainID,
            sourceAddress: originSenderAddress
        });
        
        receivedMessages.push(received);
        
        // Generate message ID for tracking
        bytes32 messageId = keccak256(abi.encode(
            sourceBlockchainID,
            originSenderAddress,
            agentId,
            timestamp
        ));
        
        messageIdToIndex[messageId] = receivedMessages.length - 1;
        
        emit SensoryWarpReceived(
            messageId,
            sourceBlockchainID,
            agentId,
            prmScore,
            harmonicFreq
        );
        
        // Process trade if PRM confidence is high
        if (prmScore >= 75) {
            _executeTrade(received);
        }
    }
    
    /**
     * @notice Execute trade based on sensory data
     */
    function _executeTrade(ReceivedMessage memory message) internal {
        // Trade execution logic (integrate with DEX, wallet, etc.)
        
        emit TradeExecuted(
            message.agentId,
            message.tradeCommand,
            message.amountUSDC,
            message.harmonicFreq
        );
    }
    
    /**
     * @notice Get total received messages
     */
    function getReceivedCount() external view returns (uint256) {
        return receivedMessages.length;
    }
    
    /**
     * @notice Get latest received messages
     */
    function getLatestMessages(uint256 count) external view returns (ReceivedMessage[] memory) {
        uint256 total = receivedMessages.length;
        uint256 returnCount = count > total ? total : count;
        
        ReceivedMessage[] memory latest = new ReceivedMessage[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            latest[i] = receivedMessages[total - returnCount + i];
        }
        
        return latest;
    }
}


/**
 * @title ERC8004Router - Multi-Chain Token Routing
 * @notice ERC-8004 compatible routing for x402 payments
 * @dev Enables atomic payment + message warps
 */
contract ERC8004Router {
    
    ITeleporterMessenger public immutable teleporterMessenger;
    
    struct PaymentRoute {
        bytes32 destinationChainID;
        address destinationToken;
        address bridgeContract;
        uint256 feePercent;  // Basis points (100 = 1%)
        bool active;
    }
    
    mapping(address => mapping(bytes32 => PaymentRoute)) public routes;
    
    event RouteConfigured(
        address indexed sourceToken,
        bytes32 indexed destinationChainID,
        address destinationToken
    );
    
    event PaymentRouted(
        address indexed sender,
        address indexed sourceToken,
        bytes32 indexed destinationChainID,
        uint256 amount,
        bytes32 messageId
    );
    
    constructor(address teleporterAddress) {
        teleporterMessenger = ITeleporterMessenger(teleporterAddress);
    }
    
    /**
     * @notice Configure payment route (ERC-8004)
     */
    function configureRoute(
        address sourceToken,
        bytes32 destinationChainID,
        address destinationToken,
        address bridgeContract,
        uint256 feePercent
    ) external {
        routes[sourceToken][destinationChainID] = PaymentRoute({
            destinationChainID: destinationChainID,
            destinationToken: destinationToken,
            bridgeContract: bridgeContract,
            feePercent: feePercent,
            active: true
        });
        
        emit RouteConfigured(sourceToken, destinationChainID, destinationToken);
    }
    
    /**
     * @notice Route payment with sensory message (ERC-8004 + ICM)
     */
    function routePayment(
        address sourceToken,
        bytes32 destinationChainID,
        address destinationAddress,
        uint256 amount,
        bytes memory sensoryData
    ) external payable returns (bytes32 messageId) {
        PaymentRoute memory route = routes[sourceToken][destinationChainID];
        require(route.active, "Route not active");
        
        // Calculate fee
        uint256 fee = (amount * route.feePercent) / 10000;
        uint256 netAmount = amount - fee;
        
        // Encode payment + sensory data
        bytes memory message = abi.encode(
            msg.sender,
            sourceToken,
            route.destinationToken,
            netAmount,
            sensoryData
        );
        
        // Send via Teleporter
        messageId = teleporterMessenger.sendCrossChainMessage(
            ITeleporterMessenger.CrossChainMessage({
                destinationBlockchainID: destinationChainID,
                destinationAddress: destinationAddress,
                feeInfo: ITeleporterMessenger.FeeInfo({
                    feeTokenAddress: address(0),
                    amount: 0
                }),
                requiredGasLimit: 250000,
                allowedRelayerAddresses: new address[](0),
                message: message
            })
        );
        
        emit PaymentRouted(
            msg.sender,
            sourceToken,
            destinationChainID,
            netAmount,
            messageId
        );
        
        return messageId;
    }
}
