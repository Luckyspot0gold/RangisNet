#!/bin/bash
# RangisNet Web - Vercel Deployment Script

set -e

echo "🚀 RangisNet Web Deployment to rangis.net"
echo "=========================================="

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from /workspaces/RangisNet/Web"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Warning: .env.local not found"
    echo "Copy .env.example to .env.local and configure:"
    echo "  - NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
    echo "  - NEXT_PUBLIC_TELEPORTER_MESSENGER"
    echo "  - NEXT_PUBLIC_DFK_CONTRACT"
    echo ""
    read -p "Continue without .env.local? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build check
echo ""
echo "🔨 Running production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

# Deploy to Vercel
echo ""
echo "🌐 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "❌ Vercel CLI not installed"
    echo "Install with: npm i -g vercel"
    exit 1
fi

echo ""
echo "✨ Deployment complete!"
echo "🔗 Visit: https://rangis.net"
echo "🔗 API: https://rangis.net/api/pte"
