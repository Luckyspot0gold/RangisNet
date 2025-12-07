#!/bin/bash
# RangisNet MVP Launch Script - Hack2Build x402 Victory
# December 5, 2025 - 8 Days to Demo

set -e

echo "🎵 RangisNet: The Sensory Revolution - MVP Launch"
echo "=================================================="
echo ""

# Check current directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run from /workspaces/RangisNet/Web"
    exit 1
fi

echo "📦 Step 1: Environment Check"
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Edit .env.local with your keys:"
    echo "   - NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
    echo "   - NEXT_PUBLIC_CONTRACT (Fuji address)"
fi

echo ""
echo "🔨 Step 2: Build Check"
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful - 113 kB bundle"
else
    echo "❌ Build failed - check errors above"
    exit 1
fi

echo ""
echo "🚀 Step 3: Deployment Options"
echo ""
echo "Choose deployment method:"
echo "  1) Vercel Production (rangis.net)"
echo "  2) Docker Local (localhost:8000)"
echo "  3) GitHub Codespace (crispy-train-*.github.dev)"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Deploying to Vercel..."
        echo "1. Run: vercel login"
        echo "2. Run: vercel --prod"
        echo "3. Set Root Directory: Web"
        echo "4. Configure domain: rangis.net"
        ;;
    2)
        echo ""
        echo "🐳 Building Docker image..."
        cd ..
        docker build -t rangis-mvp .
        echo "✅ Starting container on port 8000..."
        docker run -d -p 8000:8000 --name rangis rangis-mvp
        echo ""
        echo "✅ RangisNet running at http://localhost:8000"
        echo "   API: http://localhost:8000/api/pte"
        echo ""
        echo "Stop with: docker stop rangis && docker rm rangis"
        ;;
    3)
        echo ""
        echo "☁️  GitHub Codespace Setup:"
        echo "1. Open Ports tab in VS Code"
        echo "2. Forward port 3000 (or 8000 if Docker)"
        echo "3. Set visibility: Public"
        echo "4. Copy URL: https://crispy-train-*.github.dev"
        echo ""
        echo "Starting dev server..."
        npm run dev
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✨ Launch complete!"
echo ""
echo "📡 Test PTE API:"
echo "curl -X POST https://your-url/api/pte \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"command\":\"Buy AVAX\",\"pair\":\"AVAX/USD\",\"amount\":\"0.01\"}'"
echo ""
echo "🎯 Next Steps for Hack2Build:"
echo "  1. Fund Fuji wallet (2 AVAX from Hub faucet)"
echo "  2. Deploy Thirdweb integration (3 mins)"
echo "  3. Test Youmio haptics (navigator.vibrate)"
echo "  4. Record 8s demo video"
echo "  5. Submit by Dec 12!"
echo ""
echo "🏆 432Hz Seamless - Let's win this! 🎵"
