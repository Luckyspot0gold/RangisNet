#!/bin/bash
# Quick Setup: Fiat Off-Ramp Integration
# Avalanche Hack2Build x402 - December 7, 2025

set -e

echo "🏦 RangisNet Fiat Off-Ramp Setup"
echo "================================="
echo ""

# Check if in Web directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from /Web directory"
    echo "   cd /workspaces/RangisNet/Web"
    exit 1
fi

echo "📦 Step 1: Install Transak SDK"
echo "-------------------------------"
npm install @transak/transak-sdk
echo "✅ Transak SDK installed"
echo ""

echo "🔑 Step 2: Setup API Keys"
echo "-------------------------"
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << 'EOF'
# Avalanche Fuji
AVALANCHE_RPC_FUJI=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113

# Thirdweb (existing)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
THIRDWEB_SECRET_KEY=your_secret_key_here

# Transak Off-Ramp (NEW!)
NEXT_PUBLIC_TRANSAK_API_KEY=your_staging_key_here
TRANSAK_ENVIRONMENT=STAGING

# x402 Payments
NEXT_PUBLIC_X402_PROVIDER=https://provider.x402.org

# Contract Addresses (update after deployment)
NEXT_PUBLIC_IBP_WALLET_ADDRESS=0x...
EOF
    echo "✅ Created .env.local"
else
    echo "ℹ️  .env.local exists - add these lines:"
    echo ""
    echo "NEXT_PUBLIC_TRANSAK_API_KEY=your_staging_key_here"
    echo "TRANSAK_ENVIRONMENT=STAGING"
    echo "NEXT_PUBLIC_IBP_WALLET_ADDRESS=0x..."
fi
echo ""

echo "📋 Step 3: Get Transak API Key"
echo "------------------------------"
echo "1. Visit: https://transak.com/developers"
echo "2. Sign up with project details:"
echo "   - Name: RangisNet"
echo "   - Use Case: Avalanche Hack2Build x402"
echo "   - Network: Avalanche (Fuji + Mainnet)"
echo "3. Copy STAGING API key (instant)"
echo "4. Paste into .env.local"
echo ""
read -p "Press ENTER when API key is added..."
echo ""

echo "🔨 Step 4: Deploy Off-Ramp Contract"
echo "-----------------------------------"
cd contracts
if [ ! -d "node_modules" ]; then
    echo "Installing contract dependencies..."
    npm install
fi

echo "Deploying IBPWalletWithOfframp to Fuji..."
npx hardhat run scripts/deploy-ibpwallet-offramp.ts --network fuji

echo ""
echo "✅ Contract deployed!"
echo ""
read -p "Copy contract address and paste into .env.local, then press ENTER..."
cd ..
echo ""

echo "🧪 Step 5: Test Off-Ramp Flow"
echo "-----------------------------"
echo "Starting Next.js dev server..."
npm run dev &
DEV_PID=$!
sleep 5

echo ""
echo "Test cashout at: http://localhost:3000"
echo ""
echo "Test flow:"
echo "1. Connect wallet (Thirdweb)"
echo "2. Deposit 10 USDC"
echo "3. Click 'Cash Out to Bank'"
echo "4. Complete Transak KYC (test mode)"
echo "5. Verify funds locked on-chain"
echo ""
read -p "Press ENTER when testing is complete..."

# Stop dev server
kill $DEV_PID 2>/dev/null || true
echo ""

echo "📝 Step 6: Update Documentation"
echo "-------------------------------"
echo "Updating README.md..."

if ! grep -q "Fiat Off-Ramp" ../README.md; then
    cat >> ../README.md << 'EOF'

## 💸 Fiat Off-Ramp

Cash out crypto directly to your bank account:

```typescript
import { cashOutToBank } from './lib/transakOfframp';

// Cash out 100 USDC to USD
await cashOutToBank(
  walletAddress,
  100,
  'USD'
);
```

**Supported**:
- 150+ countries
- 60+ fiat currencies
- Bank transfers, cards, mobile money
- 2.99% fee (competitive with exchanges)

Powered by Transak.
EOF
    echo "✅ README.md updated"
else
    echo "ℹ️  README.md already has off-ramp section"
fi
echo ""

echo "🎬 Step 7: Record Demo"
echo "---------------------"
echo "Update your demo video to show:"
echo "1. User trades AVAX → USDC (existing)"
echo "2. User clicks 'Cash Out' button (NEW!)"
echo "3. Transak widget opens"
echo "4. User enters bank details"
echo "5. Confirmation: 'USD arriving in 1-3 days'"
echo ""
echo "This shows the COMPLETE circular economy!"
echo ""

echo "✅ Off-Ramp Setup Complete!"
echo "==========================="
echo ""
echo "📋 Checklist:"
echo "- [x] Transak SDK installed"
echo "- [x] API key configured"
echo "- [x] Contract deployed"
echo "- [x] Testing complete"
echo "- [x] Documentation updated"
echo ""
echo "🚀 Next Steps:"
echo "1. Record demo video with cashout"
echo "2. Test full flow one more time"
echo "3. Deploy to Vercel: vercel --prod"
echo "4. Submit to Hack2Build!"
echo ""
echo "💰 You now have full fiat integration!"
echo "   Users can: Buy → Trade → Cash Out"
echo ""
echo "🏆 This gives you a HUGE advantage in judging!"
echo ""
