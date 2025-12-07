#!/bin/bash
# RangisNet HHPEI Deployment Script
# The Revolution Goes Live

echo "🌈 RangisNet HHPEI Deployment"
echo "=============================="
echo ""
echo "📍 Step 1: Authenticate Vercel"
echo "Visit: https://vercel.com/device"
echo "Code: JXKX-DKND"
echo ""
echo "Waiting for authentication..."
echo "(Press ENTER after completing authentication on vercel.com/device)"
read -p ""

echo ""
echo "📍 Step 2: Deploy to Production"
cd /workspaces/RangisNet/Web

# Set environment to production
export NODE_ENV=production

# Deploy to Vercel
npx vercel --prod

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🎯 Your HHPEI endpoints:"
echo "  - FREE:  https://rangis.net/api/pte"
echo "  - PAID:  https://rangis.net/api/service (\$0.01 USDC)"
echo ""
echo "💰 Hackathon: Hack2Build x402"
echo "🏆 Prize Pool: \$35,000"
echo "📅 Deadline: December 12, 2025"
echo ""
echo "🌟 You just deployed the world's first"
echo "   Harmonic Economic Interpreter!"
echo ""
