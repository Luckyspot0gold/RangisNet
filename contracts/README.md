# RangisNet Smart Contracts

## Overview

This directory contains Solidity smart contracts for RangisNet's x402 payment integration on Avalanche Fuji testnet.

## Contracts

### RangisPayment.sol

The core micropayment contract enabling instant USDC payments for premium features.

**Key Features:**
- USDC micropayments (ERC20)
- PRM validation integration
- Event emission for tracking
- Gas-optimized for Avalanche

**Functions:**
- `processMicropayment(uint256 amount, bytes calldata prmData)`: Process a micropayment with PRM validation

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
const prmData = ethers.utils.defaultAbiCoder.encode(['bool'], [true]);
await contract.processMicropayment(
  ethers.utils.parseUnits('1', 6), // 1 USDC
  prmData
);
```

## Testing

```bash
cd Web/contracts
npx hardhat test
```

## Security

- OpenZeppelin ERC20 interface for USDC
- Input validation on all functions
- Event logging for auditability
