// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title IBPWallet with Fiat Off-Ramp Support
 * @notice Extended IBPWallet with bank cashout integration (Transak/MoonPay)
 * @dev Adds off-ramp functionality for competition submission
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IBPWalletWithOfframp is ReentrancyGuard, Ownable {
    
    struct Wallet {
        address owner;
        uint256 nativeBalance;
        mapping(address => uint256) tokenBalances;
        uint256 reputationScore;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 failedTrades;
        uint256 totalVolume;
        bool active;
        uint256 createdAt;
    }
    
    struct OfframpRequest {
        address wallet;
        address token;          // USDC address
        uint256 amount;         // Amount to cash out
        string fiatCurrency;    // USD, EUR, etc.
        string bankDetails;     // Encrypted bank info (stored off-chain)
        uint256 requestedAt;
        uint256 completedAt;
        bool completed;
        string txHash;          // Off-ramp provider transaction ID
    }
    
    // State
    mapping(address => Wallet) private wallets;
    mapping(address => bool) public isAuthorizedAgent;
    mapping(uint256 => OfframpRequest) public offrampRequests;
    uint256 public offrampRequestCount;
    
    // Off-ramp providers
    mapping(address => bool) public authorizedOfframpProviders;
    
    // Constants
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant INITIAL_REPUTATION = 500;
    uint256 public offrampFeePercent = 299; // 2.99% (basis points)
    
    // Events
    event WalletCreated(address indexed owner, uint256 initialReputation);
    event Deposited(address indexed owner, address token, uint256 amount);
    event Withdrawn(address indexed owner, address token, uint256 amount);
    event OfframpRequested(
        uint256 indexed requestId,
        address indexed wallet,
        address token,
        uint256 amount,
        string fiatCurrency
    );
    event OfframpCompleted(
        uint256 indexed requestId,
        address indexed wallet,
        uint256 amount,
        string txHash
    );
    event OfframpProviderAuthorized(address indexed provider, bool authorized);
    
    modifier onlyAuthorizedAgent() {
        require(isAuthorizedAgent[msg.sender], "Not authorized agent");
        _;
    }
    
    modifier onlyAuthorizedOfframpProvider() {
        require(authorizedOfframpProviders[msg.sender], "Not authorized offramp provider");
        _;
    }
    
    constructor() {
        isAuthorizedAgent[msg.sender] = true;
    }
    
    /**
     * @notice Create new wallet
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
     * @notice Withdraw ERC20 tokens to user's address
     */
    function withdrawToken(address token, uint256 amount) external nonReentrant {
        require(wallets[msg.sender].active, "Wallet not active");
        require(wallets[msg.sender].tokenBalances[token] >= amount, "Insufficient balance");
        
        wallets[msg.sender].tokenBalances[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, token, amount);
    }
    
    /**
     * @notice REQUEST FIAT OFF-RAMP (Cash out to bank account)
     * @dev Initiates withdrawal to fiat currency via Transak/MoonPay
     * @param token Address of token to cash out (typically USDC)
     * @param amount Amount to cash out (in token decimals)
     * @param fiatCurrency Target fiat currency (USD, EUR, etc.)
     * @param bankDetailsHash Hash of encrypted bank details (stored off-chain)
     */
    function requestOfframp(
        address token,
        uint256 amount,
        string calldata fiatCurrency,
        string calldata bankDetailsHash
    ) external nonReentrant returns (uint256 requestId) {
        require(wallets[msg.sender].active, "Wallet not active");
        require(wallets[msg.sender].tokenBalances[token] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        
        // Calculate fee (2.99% default)
        uint256 fee = (amount * offrampFeePercent) / 10000;
        uint256 netAmount = amount - fee;
        
        // Lock funds
        wallets[msg.sender].tokenBalances[token] -= amount;
        
        // Create off-ramp request
        requestId = offrampRequestCount++;
        OfframpRequest storage request = offrampRequests[requestId];
        request.wallet = msg.sender;
        request.token = token;
        request.amount = netAmount;
        request.fiatCurrency = fiatCurrency;
        request.bankDetails = bankDetailsHash;
        request.requestedAt = block.timestamp;
        request.completed = false;
        
        emit OfframpRequested(requestId, msg.sender, token, netAmount, fiatCurrency);
        
        return requestId;
    }
    
    /**
     * @notice COMPLETE OFF-RAMP (Called by Transak/MoonPay webhook)
     * @dev Marks off-ramp as completed after provider confirms fiat transfer
     * @param requestId The off-ramp request ID
     * @param txHash Transaction hash from off-ramp provider
     */
    function completeOfframp(
        uint256 requestId,
        string calldata txHash
    ) external onlyAuthorizedOfframpProvider {
        OfframpRequest storage request = offrampRequests[requestId];
        require(!request.completed, "Already completed");
        require(request.wallet != address(0), "Invalid request");
        
        request.completed = true;
        request.completedAt = block.timestamp;
        request.txHash = txHash;
        
        emit OfframpCompleted(requestId, request.wallet, request.amount, txHash);
    }
    
    /**
     * @notice CANCEL OFF-RAMP (if provider fails)
     * @dev Returns funds to user if off-ramp fails
     * @param requestId The off-ramp request ID
     */
    function cancelOfframp(uint256 requestId) external {
        OfframpRequest storage request = offrampRequests[requestId];
        require(request.wallet == msg.sender, "Not your request");
        require(!request.completed, "Already completed");
        require(block.timestamp > request.requestedAt + 24 hours, "Wait 24h before cancel");
        
        // Return funds
        wallets[msg.sender].tokenBalances[request.token] += request.amount;
        
        request.completed = true; // Mark as completed (cancelled)
        request.txHash = "CANCELLED";
    }
    
    /**
     * @notice Get off-ramp request details
     */
    function getOfframpRequest(uint256 requestId) external view returns (
        address wallet,
        address token,
        uint256 amount,
        string memory fiatCurrency,
        uint256 requestedAt,
        uint256 completedAt,
        bool completed,
        string memory txHash
    ) {
        OfframpRequest storage request = offrampRequests[requestId];
        return (
            request.wallet,
            request.token,
            request.amount,
            request.fiatCurrency,
            request.requestedAt,
            request.completedAt,
            request.completed,
            request.txHash
        );
    }
    
    /**
     * @notice Get user's off-ramp requests (helper for frontend)
     */
    function getUserOfframpRequests(address user) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count user's requests
        for (uint256 i = 0; i < offrampRequestCount; i++) {
            if (offrampRequests[i].wallet == user) {
                count++;
            }
        }
        
        // Collect request IDs
        uint256[] memory requestIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < offrampRequestCount; i++) {
            if (offrampRequests[i].wallet == user) {
                requestIds[index] = i;
                index++;
            }
        }
        
        return requestIds;
    }
    
    /**
     * @notice Check token balance
     */
    function checkTokenBalance(address owner, address token) external view returns (uint256) {
        return wallets[owner].tokenBalances[token];
    }
    
    /**
     * @notice Authorize off-ramp provider (Transak, MoonPay, etc.)
     */
    function authorizeOfframpProvider(address provider, bool authorized) external onlyOwner {
        authorizedOfframpProviders[provider] = authorized;
        emit OfframpProviderAuthorized(provider, authorized);
    }
    
    /**
     * @notice Set off-ramp fee percentage (basis points)
     */
    function setOfframpFee(uint256 feePercent) external onlyOwner {
        require(feePercent <= 1000, "Fee too high"); // Max 10%
        offrampFeePercent = feePercent;
    }
    
    /**
     * @notice Authorize agent contract
     */
    function authorizeAgent(address agent, bool authorized) external onlyOwner {
        isAuthorizedAgent[agent] = authorized;
    }
}
