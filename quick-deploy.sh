#!/bin/bash
# Quick Deploy Script for Avalanche x402 Hackathon Submission
# RangisNet - Multi-Sensory Financial Cognition Platform

set -e  # Exit on error

echo "🚀 RangisNet Avalanche x402 Quick Deploy"
echo "========================================"
echo ""

# Check current directory
if [ ! -d "Web" ]; then
  echo "❌ Error: Must run from /workspaces/RangisNet directory"
  exit 1
fi

cd Web

echo "📦 Step 1: Installing dependencies..."
pnpm install --frozen-lockfile

echo ""
echo "🔨 Step 2: Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Check errors above."
  exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
  echo "🌐 Step 3: Deploying to Vercel..."
  echo ""
  echo "Choose deployment method:"
  echo "1) Deploy to production (vercel --prod)"
  echo "2) Deploy to preview (vercel)"
  echo "3) Skip deployment (manual later)"
  echo ""
  read -p "Enter choice (1-3): " deploy_choice
  
  case $deploy_choice in
    1)
      echo "Deploying to production..."
      vercel --prod
      ;;
    2)
      echo "Deploying to preview..."
      vercel
      ;;
    3)
      echo "Skipping deployment. Run 'vercel --prod' manually when ready."
      ;;
    *)
      echo "Invalid choice. Skipping deployment."
      ;;
  esac
else
  echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
  echo ""
  echo "Manual deployment options:"
  echo ""
  echo "Option A: Vercel (Recommended)"
  echo "  1. Install Vercel CLI: npm i -g vercel"
  echo "  2. Login: vercel login"
  echo "  3. Deploy: vercel --prod"
  echo ""
  echo "Option B: Google Cloud Run"
  echo "  1. gcloud auth login"
  echo "  2. gcloud config set project rangisnet-production"
  echo "  3. gcloud run deploy rangisnet-heartbeat \\"
  echo "       --source=. \\"
  echo "       --region=us-central1 \\"
  echo "       --allow-unauthenticated \\"
  echo "       --memory=512Mi \\"
  echo "       --cpu=1 \\"
  echo "       --min-instances=0"
  echo ""
fi

echo ""
echo "✅ Build Complete!"
echo ""
echo "📊 Next Steps for Avalanche x402 Submission:"
echo "1. Test live site (curl https://rangis.net)"
echo "2. Create demo video (see AVALANCHE_X402_READINESS.md)"
echo "3. Submit to Avalanche x402 portal"
echo ""
echo "📁 Build output: /workspaces/RangisNet/Web/.next"
echo "📖 Full guide: /workspaces/RangisNet/AVALANCHE_X402_READINESS.md"
echo ""
echo "🏆 YOU'RE READY TO WIN! Good luck!"
