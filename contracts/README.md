# RangisNet Smart Contracts

## Overview

This directory contains Solidity smart contracts for RangisNet's x402 payment integration on Avalanche Fuji testnet.

## Contracts

### RangisPayment.sol

The core micropayment contract enabling instant USDC payments for premium features.

**Key Features:**
- USDC micropayments (ERC20)
- PRM validation integration
- User withdrawal functionality
- Owner access control (OpenZeppelin Ownable)
- Event emission for tracking
- Gas-optimized for Avalanche

**Functions:**
- `processMicropayment(uint256 amount, bytes calldata prmData)`: Process a micropayment with PRM validation
- `withdraw(uint256 amount)`: Allow users to withdraw their credited balance
- `ownerWithdraw(uint256 amount)`: Allow contract owner to withdraw accumulated fees

**Events:**
- `PaymentProcessed(address indexed user, uint256 amount)`: Emitted on successful payment
- `Withdrawal(address indexed user, uint256 amount)`: Emitted on user withdrawal

## Deployment

### Fuji Testnet

```bash
# Deploy contract
cd Web/contracts
npx hardhat run scripts/deploy.ts --network fuji
```

**Deployed Addresses:**
- RangisPayment: `<pending deployment>`
- USDC (Fuji): `0x5425890298aed601595a70AB815c96711a31Bc65`

## Integration

```typescript
import { ethers } from 'ethers';

// Connect to contract
const contract = new ethers.Contract(
  RANGIS_PAYMENT_ADDRESS,
  RangisPaymentABI,
  signer
);

// Process micropayment
const prmData = ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [true]);
await contract.processMicropayment(
  ethers.parseUnits('1', 6), // 1 USDC
  prmData
);

// Withdraw user balance
await contract.withdraw(ethers.parseUnits('0.5', 6)); // Withdraw 0.5 USDC
```

## Testing

```bash
cd Web/contracts
npx hardhat test
```

## Security

- OpenZeppelin Ownable for access control
- OpenZeppelin ERC20 interface for USDC
- Input validation on all functions
- Withdrawal mechanism for users and owner
- Event logging for auditability
