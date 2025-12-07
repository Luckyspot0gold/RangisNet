# RangisNet Web Setup Guide

## Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

## Installation

```bash
# Navigate to Web directory
cd Web

# Install dependencies (npm or pnpm works)
npm install
# OR
pnpm install

# Copy environment template
cp .env.example .env.local
```

## Environment Variables

Create `.env.local` with:

```env
# Avalanche Fuji
AVALANCHE_RPC_FUJI=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
THIRDWEB_SECRET_KEY=your_secret_key_here

# x402 Payment Protocol
NEXT_PUBLIC_X402_PROVIDER=https://provider.x402.org
X402_FACILITATOR_ADDRESS=your_facilitator_address

# HHPEI Service
HHPEI_SERVICE_PRICE=10000  # $0.01 USDC (6 decimals)
```

## Development

```bash
# Start Next.js dev server
npm run dev

# Access at http://localhost:3000
```

## Testing Locally

### Option 1: Next.js Dev Server (Recommended)
```bash
npm run dev
# Open http://localhost:3000
```

### Option 2: Static HTML Demo
```bash
# Serve Public directory
cd Web/Public
python3 -m http.server 8000
# Open http://localhost:8000/Tuner.html
```

## Production Deployment

### Deploy to Vercel

```bash
# Method 1: Using Vercel CLI
npm install -g vercel
vercel --prod

# Method 2: Using deploy script
npm run deploy
```

### Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `AVALANCHE_RPC_FUJI`
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- `THIRDWEB_SECRET_KEY`
- `NEXT_PUBLIC_X402_PROVIDER`
- `X402_FACILITATOR_ADDRESS`
- `HHPEI_SERVICE_PRICE`

## API Endpoints

After deployment, access:

### Free Endpoint
```
GET https://your-domain.vercel.app/api/pte
```

### Paid HHPEI Service (x402)
```
GET https://your-domain.vercel.app/api/service
POST https://your-domain.vercel.app/api/service
```
Requires: x402 payment header (402-Token-ID)

## Testing x402 Payments

```bash
# From project root
./test-x402-payment.sh
```

## Contract Deployment

```bash
cd Web/contracts
npm install
npx hardhat run scripts/deploy-rangis.ts --network fuji
```

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### x402 payment failing
1. Check USDC balance on Avalanche Fuji
2. Verify facilitator address is correct
3. Ensure x402 provider is accessible

### Next.js build errors
```bash
npm run build
# Check for TypeScript errors
```

## Architecture

- **Frontend**: Next.js 14 + React + Three.js
- **Blockchain**: Avalanche Fuji (C-Chain) + Custom Subnet
- **Payments**: x402 Protocol via Thirdweb
- **Smart Contracts**: Solidity (Hardhat)
- **APIs**: Next.js API routes (/api/pte, /api/service)

## Quick Links

- [Full Deployment Guide](./HHPEI-DEPLOYMENT.md)
- [Thirdweb Integration](./THIRDWEB-X402-INTEGRATION.md)
- [Build Success](./BUILD-SUCCESS.md)
- [Architecture Docs](../docs/architecture/overview.md)
