// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppReceiver.sol";

/**
 * @title RangisNetMarketDataBridge
 * @notice LayerZero bridge for cross-chain market data and PRM analysis synchronization
 * @dev Enables RangisNet market data to be sent across 50+ blockchains
 */
contract RangisNetMarketDataBridge is OApp {
    
    // Events
    event MarketDataSent(
        uint32 indexed dstEid,
        string symbol,
        uint256 price,
        uint256 volume24h,
        int256 priceChange24h,
        uint256 timestamp
    );
    
    event MarketDataReceived(
        uint32 indexed srcEid,
        string symbol,
        uint256 price,
        uint256 volume24h,
        int256 priceChange24h,
        uint256 timestamp
    );
    
    event PRMAnalysisSent(
        uint32 indexed dstEid,
        string symbol,
        string recommendation,
        uint256 confidence,
        uint256 resonanceScore
    );
    
    event PRMAnalysisReceived(
        uint32 indexed srcEid,
        string symbol,
        string recommendation,
        uint256 confidence,
        uint256 resonanceScore
    );
    
    // Structs
    struct MarketData {
        string symbol;
        uint256 price;          // Price in wei (18 decimals)
        uint256 volume24h;      // Volume in wei (18 decimals)
        int256 priceChange24h;  // Price change percentage (18 decimals, can be negative)
        uint256 timestamp;
        string[] sources;
        uint256 confidence;     // Confidence score (18 decimals, 0-1)
    }
    
    struct PRMAnalysis {
        string symbol;
        string recommendation;  // SEND, WAIT, or STOP
        uint256 confidence;     // 18 decimals
        HarmonicOutput harmonic;
        HapticOutput haptic;
        PhonicOutput phonic;
        uint256 resonanceScore; // 18 decimals
        uint256 timestamp;
    }
    
    struct HarmonicOutput {
        uint256 frequency;      // Hz (18 decimals)
        uint256 amplitude;      // 0-1 (18 decimals)
        string waveform;        // sine, square, triangle, sawtooth
        uint256 durationMs;
    }
    
    struct HapticOutput {
        uint256 intensity;      // 0-1 (18 decimals)
        uint256[] pattern;      // Array of pulse durations in ms
        uint256 durationMs;
    }
    
    struct PhonicOutput {
        uint256 pitch;          // Hz (18 decimals)
        uint256 volume;         // 0-1 (18 decimals)
        string timbre;
        uint256 durationMs;
    }
    
    // Storage
    mapping(string => MarketData) public latestMarketData;
    mapping(string => PRMAnalysis) public latestPRMAnalysis;
    mapping(address => bool) public authorizedOracles;
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    /**
     * @notice Constructor
     * @param _endpoint LayerZero endpoint address
     * @param _owner Contract owner address
     */
    constructor(
        address _endpoint,
        address _owner
    ) OApp(_endpoint, _owner) {
        authorizedOracles[_owner] = true;
    }
    
    /**
     * @notice Add or remove authorized oracle
     * @param oracle Oracle address
     * @param authorized Authorization status
     */
    function setAuthorizedOracle(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
    }
    
    /**
     * @notice Send market data to another chain
     * @param dstEid Destination chain endpoint ID
     * @param symbol Market symbol
     * @param price Current price
     * @param volume24h 24h volume
     * @param priceChange24h 24h price change percentage
     * @param sources Data sources
     * @param confidence Confidence score
     */
    function sendMarketData(
        uint32 dstEid,
        string memory symbol,
        uint256 price,
        uint256 volume24h,
        int256 priceChange24h,
        string[] memory sources,
        uint256 confidence
    ) external payable onlyAuthorizedOracle {
        
        // Store locally
        latestMarketData[symbol] = MarketData({
            symbol: symbol,
            price: price,
            volume24h: volume24h,
            priceChange24h: priceChange24h,
            timestamp: block.timestamp,
            sources: sources,
            confidence: confidence
        });
        
        // Encode message
        bytes memory payload = abi.encode(
            uint8(1), // Message type: MarketData
            symbol,
            price,
            volume24h,
            priceChange24h,
            block.timestamp,
            sources,
            confidence
        );
        
        // Send via LayerZero
        _lzSend(
            dstEid,
            payload,
            _buildSendOptions(),
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
        
        emit MarketDataSent(
            dstEid,
            symbol,
            price,
            volume24h,
            priceChange24h,
            block.timestamp
        );
    }
    
    /**
     * @notice Send PRM analysis to another chain
     * @param dstEid Destination chain endpoint ID
     * @param analysis PRM analysis data
     */
    function sendPRMAnalysis(
        uint32 dstEid,
        PRMAnalysis memory analysis
    ) external payable onlyAuthorizedOracle {
        
        // Store locally
        analysis.timestamp = block.timestamp;
        latestPRMAnalysis[analysis.symbol] = analysis;
        
        // Encode message
        bytes memory payload = abi.encode(
            uint8(2), // Message type: PRMAnalysis
            analysis
        );
        
        // Send via LayerZero
        _lzSend(
            dstEid,
            payload,
            _buildSendOptions(),
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
        
        emit PRMAnalysisSent(
            dstEid,
            analysis.symbol,
            analysis.recommendation,
            analysis.confidence,
            analysis.resonanceScore
        );
    }
    
    /**
     * @notice Internal function to handle received messages
     * @param _origin Message origin information
     * @param payload Message payload
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        
        uint8 messageType = abi.decode(payload, (uint8));
        
        if (messageType == 1) {
            // Market Data
            (
                ,
                string memory symbol,
                uint256 price,
                uint256 volume24h,
                int256 priceChange24h,
                uint256 timestamp,
                string[] memory sources,
                uint256 confidence
            ) = abi.decode(
                payload,
                (uint8, string, uint256, uint256, int256, uint256, string[], uint256)
            );
            
            latestMarketData[symbol] = MarketData({
                symbol: symbol,
                price: price,
                volume24h: volume24h,
                priceChange24h: priceChange24h,
                timestamp: timestamp,
                sources: sources,
                confidence: confidence
            });
            
            emit MarketDataReceived(
                _origin.srcEid,
                symbol,
                price,
                volume24h,
                priceChange24h,
                timestamp
            );
            
        } else if (messageType == 2) {
            // PRM Analysis
            (, PRMAnalysis memory analysis) = abi.decode(
                payload,
                (uint8, PRMAnalysis)
            );
            
            latestPRMAnalysis[analysis.symbol] = analysis;
            
            emit PRMAnalysisReceived(
                _origin.srcEid,
                analysis.symbol,
                analysis.recommendation,
                analysis.confidence,
                analysis.resonanceScore
            );
        }
    }
    
    /**
     * @notice Build send options for LayerZero
     */
    function _buildSendOptions() internal pure returns (bytes memory) {
        return OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
    }
    
    /**
     * @notice Get market data for a symbol
     * @param symbol Market symbol
     * @return Market data
     */
    function getMarketData(string memory symbol) external view returns (MarketData memory) {
        return latestMarketData[symbol];
    }
    
    /**
     * @notice Get PRM analysis for a symbol
     * @param symbol Market symbol
     * @return PRM analysis
     */
    function getPRMAnalysis(string memory symbol) external view returns (PRMAnalysis memory) {
        return latestPRMAnalysis[symbol];
    }
    
    /**
     * @notice Estimate fee for sending market data
     * @param dstEid Destination chain endpoint ID
     * @return Fee estimate
     */
    function estimateSendFee(
        uint32 dstEid,
        bytes memory payload
    ) external view returns (MessagingFee memory) {
        return _quote(dstEid, payload, _buildSendOptions(), false);
    }
}
