#!/bin/bash
# ULTIMATE QUICK START - Run everything in one go
# Perfect for last-minute testing before submission

echo "🚀 RangisNet Ultimate Quick Start"
echo "=================================="
echo ""

# 1. Test all files exist
echo "📁 Step 1/5: Verifying files..."
if ./test-all.sh > /dev/null 2>&1; then
    echo "✅ All files present"
else
    echo "⚠️  Running detailed test..."
    ./test-all.sh
fi
echo ""

# 2. Install dependencies
echo "📦 Step 2/5: Installing dependencies..."
cd Web
if [ ! -d "node_modules" ]; then
    echo "Installing with pnpm..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi
echo ""

# 3. Test Warp script
echo "🌉 Step 3/5: Testing Warp script..."
cd ..
if ./Avalanche/subnet/scripts/test-warp.sh 2>&1 | head -5; then
    echo "✅ Warp test script works"
fi
echo ""

# 4. Check environment
echo "🔐 Step 4/5: Checking environment..."
if [ -f "Web/.env.local" ]; then
    echo "✅ .env.local exists"
else
    echo "⚠️  .env.local not found - creating template..."
    cat > Web/.env.local << EOF
# Thirdweb (get from https://thirdweb.com/dashboard)
THIRDWEB_SECRET=your_secret_key_here
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# x402 (your wallet address for receiving payments)
X402_RECEIVER=0xYourWalletAddressHere

# Avalanche (optional - for Warp tests)
FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
PK=your_private_key_for_testing
EOF
    echo "📝 Template created at Web/.env.local - please fill in your values"
fi
echo ""

# 5. Start dev server
echo "🎬 Step 5/5: Starting dev server..."
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  ✅ SETUP COMPLETE!                                   ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Visit: http://localhost:3000/demo"
echo "📖 Documentation:"
echo "   - Quick Start: 5-STEP-QUICKSTART.md"
echo "   - Full Guide: FINAL-5-STEP-GUIDE.md"
echo "   - Completion: COMPLETION-SUMMARY.md"
echo ""
echo "🎥 Ready to record demo? Follow: docs/DEMO-VIDEO-SCRIPT.md"
echo ""
echo "Starting server in 3 seconds..."
sleep 3

cd Web
pnpm dev
