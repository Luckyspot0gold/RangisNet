# 🚀 RangisNet - Deployment Guide

## ✅ Build Successful!

The Next.js build completed successfully. `.next` directory created with all assets.

## 📦 Deployment Options

### Option 1: Docker (Recommended for Demo)

**Note**: Docker daemon is not available in current environment. To deploy with Docker on your local machine:

```bash
# 1. Copy repository to local machine
git clone https://github.com/Luckyspot0gold/RangisNet.git
cd RangisNet

# 2. Build Docker image
docker build -t rangisnet:latest .

# 3. Run container
docker run -d -p 3000:3000 \
  --name rangisnet \
  -e THIRDWEB_SECRET="your_secret" \
  -e X402_RECEIVER="your_wallet" \
  rangisnet:latest

# 4. Visit http://localhost:3000
```

### Option 2: Vercel (Currently Size Limited)

The Vercel deployment encountered an Edge Function size limit (1.07 MB > 1 MB limit).

**Workaround**: Deploy as Node.js runtime instead of Edge:

```bash
cd Web
# Remove edge runtime from api/service/route.ts
vercel --prod
```

### Option 3: Direct npm start

```bash
cd /workspaces/RangisNet/Web
npm start
# Visit http://localhost:3000
```

### Option 4: Run Demo Script

```bash
cd /workspaces/RangisNet
./demo-script.sh
```

This will:
- Start the Next.js server
- Show a 30-second pitch
- Run live API demos
- Display key metrics
- Perfect for screen recording!

## 🎥 Recording Your Video

Use the demo script for a professional presentation:

```bash
# Start recording your screen
./demo-script.sh

# The script will:
# 1. Start the server
# 2. Display pitch points
# 3. Run live API calls
# 4. Show technical specs
# 5. Demonstrate x402 payments
```

## 🌐 Live URLs

- **Frontend**: http://localhost:3000
- **FREE API**: http://localhost:3000/api/pte
- **PAID API**: http://localhost:3000/api/service (requires $0.01 USDC)
- **Demo Page**: http://localhost:3000/demo
- **Feel Page**: http://localhost:3000/feel

## 📋 Environment Variables

Create `.env.local` in `/Web`:

```env
# Thirdweb
THIRDWEB_SECRET=your_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

# x402 Payment
X402_RECEIVER=0xYourWalletAddress

# Avalanche
AVALANCHE_RPC_FUJI=https://api.avax-test.network/ext/bc/C/rpc
USDC_FUJI=0x5425890298aed601595a70AB815c96711a31Bc65

# Teleporter/ICM
NEXT_PUBLIC_TELEPORTER_MESSENGER=0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf
NEXT_PUBLIC_DFK_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## ✅ What's Working

- ✅ TypeScript compilation successful
- ✅ All imports resolved
- ✅ Build artifacts created (.next directory)
- ✅ API routes configured
- ✅ x402 payment integration
- ✅ PTE engine operational
- ✅ Sensory mapper ready
- ✅ ICM/Teleporter integrated

## 🎯 Submission Checklist

- [x] Working product built
- [x] Docker configuration created
- [x] Demo script ready
- [ ] Video recorded (use demo-script.sh)
- [ ] Deployed to production
- [x] GitHub repository updated
- [x] Documentation complete

## 🏆 Hack2Build Submission

**Project**: RangisNet - Harmonic Economic Interpreter
**Track**: x402 Micropayments
**Deadline**: December 12, 2025
**Prize Pool**: $35,000

Good luck! 🌈
