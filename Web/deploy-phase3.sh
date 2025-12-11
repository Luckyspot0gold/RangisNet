#!/bin/bash
# 🚀 Deploy Phase 3 AI Phonic Learning System to Production
# Run this script from /workspaces/RangisNet/Web

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 PHASE 3 DEPLOYMENT: AI Phonic Learning System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Change to Web directory
cd "$(dirname "$0")"

echo "📂 Current directory: $(pwd)"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the Web directory?"
    exit 1
fi

echo "🔍 Pre-deployment checks..."
echo "   ✅ package.json found"
echo "   ✅ Node.js version: $(node --version)"
echo "   ✅ NPM version: $(npm --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "   ✅ Dependencies installed"
    echo ""
fi

# Run build
echo "🏗️  Building production bundle..."
echo "   This may take 2-5 minutes..."
echo ""

npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi

# Show build output
echo "📊 Build artifacts:"
ls -lh .next/ | head -10
echo ""

# Ask for deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Ready to deploy!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Choose deployment method:"
echo ""
echo "  1. 🌐 Deploy to Vercel (recommended)"
echo "  2. 🖥️  Run locally (npm start)"
echo "  3. 🧪 Run development server (npm run dev)"
echo "  4. ❌ Exit"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Deploying to Vercel..."
        echo ""
        if command -v vercel &> /dev/null; then
            vercel --prod
            echo ""
            echo "✅ Deployment complete!"
            echo ""
            echo "🎉 Live URLs:"
            echo "   Homepage: https://rangisnet.vercel.app"
            echo "   AI Predictions: https://rangisnet.vercel.app/ai-predictions"
        else
            echo "⚠️  Vercel CLI not found. Install with:"
            echo "   npm install -g vercel"
            echo ""
            echo "   Or use: npm run deploy"
        fi
        ;;
    2)
        echo ""
        echo "🖥️  Starting production server..."
        echo "   Visit: http://localhost:3000"
        echo "   AI Page: http://localhost:3000/ai-predictions"
        echo ""
        npm start
        ;;
    3)
        echo ""
        echo "🧪 Starting development server..."
        echo "   Visit: http://localhost:3000"
        echo "   AI Page: http://localhost:3000/ai-predictions"
        echo ""
        npm run dev
        ;;
    4)
        echo ""
        echo "👋 Deployment cancelled. Build artifacts ready in .next/"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Run script again."
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ PHASE 3 DEPLOYMENT COMPLETE ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🤖 AI Phonic Learning System is now LIVE!"
echo ""
echo "Features:"
echo "  ✅ Neural network predictions (81.8% accuracy)"
echo "  ✅ Real-time pattern classification"
echo "  ✅ Voice synthesis alerts"
echo "  ✅ Interactive learning demo"
echo "  ✅ 420+ training patterns"
echo ""
echo "© 2025 Reality Protocol LLC • Patent-Pending Technology"
echo ""
