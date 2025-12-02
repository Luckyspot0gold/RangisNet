// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RangisPayment
 * @dev Multi-sensory pre-validated micropayment contract for Avalanche x402
 * @author Reality Protocol LLC
 * 
 * This contract integrates with the RangisNet Probability Tensor Engine (PTE)
 * to enable pre-validated transactions with multi-sensory feedback.
 * 
 * Features:
 * - PRM (Probability Resonance Metric) validation
 * - Harmonic frequency verification (432-1432 Hz)
 * - On-chain transaction tracking
 * - Gas-efficient micropayments
 */
contract RangisPayment {
    struct Transaction {
        address sender;
        address recipient;
        uint256 amount;
        uint256 prm;           // Probability Resonance Metric (scaled by 1000)
        uint256 resonanceFreq; // Harmonic frequency (432-1432 Hz)
        bool validated;
        uint256 timestamp;
    }

    mapping(address => uint256) public balances;
    mapping(bytes32 => Transaction) public transactions;
    
    uint256 public constant MIN_PRM = 300; // 0.3 threshold (scaled by 1000)
    uint256 public constant MIN_FREQUENCY = 432;
    uint256 public constant MAX_FREQUENCY = 1432;
    
    uint256 public totalTransactions;
    uint256 public totalValidated;
    uint256 public totalRejected;
    
    event TransactionValidated(
        bytes32 indexed txId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 prm,
        uint256 resonanceFreq
    );
    
    event TransactionRejected(
        bytes32 indexed txId,
        address indexed sender,
        uint256 prm,
        string reason
    );
    
    event Withdrawal(
        address indexed account,
        uint256 amount
    );

    /**
     * @dev Process micropayment with PTE pre-validation
     * @param recipient Address to send funds to
     * @param prm Probability Resonance Metric from PTE (scaled by 1000, e.g., 700 = 0.7)
     * @param resonanceFreq Harmonic frequency from PTE (432-1432 Hz)
     */
    function processMicropayment(
        address recipient,
        uint256 prm,
        uint256 resonanceFreq
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        
        totalTransactions++;
        
        bytes32 txId = keccak256(
            abi.encodePacked(msg.sender, recipient, msg.value, block.timestamp, totalTransactions)
        );
        
        // Validate PRM threshold
        if (prm < MIN_PRM) {
            totalRejected++;
            emit TransactionRejected(txId, msg.sender, prm, "PRM below threshold");
            revert("Transaction rejected: Low market confidence");
        }
        
        // Validate resonance frequency
        if (resonanceFreq < MIN_FREQUENCY || resonanceFreq > MAX_FREQUENCY) {
            totalRejected++;
            emit TransactionRejected(txId, msg.sender, prm, "Invalid frequency");
            revert("Transaction rejected: Invalid resonance frequency");
        }
        
        // Store transaction
        transactions[txId] = Transaction({
            sender: msg.sender,
            recipient: recipient,
            amount: msg.value,
            prm: prm,
            resonanceFreq: resonanceFreq,
            validated: true,
            timestamp: block.timestamp
        });
        
        // Transfer funds
        balances[recipient] += msg.value;
        totalValidated++;
        
        emit TransactionValidated(
            txId,
            msg.sender,
            recipient,
            msg.value,
            prm,
            resonanceFreq
        );
    }
    
    /**
     * @dev Withdraw balance
     */
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        balances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Get transaction details
     */
    function getTransaction(bytes32 txId) external view returns (Transaction memory) {
        return transactions[txId];
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 total,
        uint256 validated,
        uint256 rejected,
        uint256 successRate
    ) {
        total = totalTransactions;
        validated = totalValidated;
        rejected = totalRejected;
        successRate = total > 0 ? (validated * 100) / total : 0;
    }
    
    /**
     * @dev Get balance for an address
     */
    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RangisPayment {
  IERC20 public usdc; // Fuji USDC
  mapping(address => uint256) public balances;

  event PaymentProcessed(address user, uint256 amount, bool valid);

  constructor(address _usdc) { usdc = IERC20(_usdc); }

  function processMicropayment(uint256 amount, bytes calldata prmData) external {
    require(usdc.transferFrom(msg.sender, address(this), amount), "Payment failed");
    (bool valid, uint256 omega) = abi.decode(prmData, (bool, uint256)); // PTE output
    if (valid && omega > 432) {
      balances[msg.sender] += amount; // Credit on resonance
    }
    emit PaymentProcessed(msg.sender, amount, valid);
  }
}
