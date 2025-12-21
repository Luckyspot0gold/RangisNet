#!/bin/bash

# RangisNet Quick Deploy Script
# Deploys to multiple platforms simultaneously

set -e

echo "🚀 RangisNet Multi-Platform Deployment"
echo "======================================="

# Check if build exists
if [ ! -d "Web/.next" ]; then
    echo "❌ No build found. Building now..."
    cd Web
    npm run build
    cd ..
fi

echo ""
echo "📦 Available Deployment Options:"
echo ""
echo "1. Railway (Recommended - easiest)"
echo "2. Cloudflare Pages (Fast CDN)"
echo "3. Netlify (Simple)"
echo "4. Google Cloud Run (Enterprise)"
echo "5. Simple HTTP Server (Dev/Demo)"
echo ""

read -p "Choose deployment method (1-5): " choice

case $choice in
    1)
        echo "🚂 Deploying to Railway..."
        cd Web
        # Railway CLI deployment
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm i -g @railway/cli
        fi
        railway login
        railway init
        railway up
        ;;
    2)
        echo "☁️ Deploying to Cloudflare Pages..."
        cd Web
        if ! command -v wrangler &> /dev/null; then
            echo "Installing Wrangler CLI..."
            npm i -g wrangler
        fi
        npx wrangler pages deploy .next --project-name=rangisnet
        ;;
    3)
        echo "🌐 Deploying to Netlify..."
        cd Web
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=.next
        ;;
    4)
        echo "☁️ Deploying to Google Cloud Run..."
        ./deploy-gcloud.sh
        ;;
    5)
        echo "🖥️ Starting local server..."
        cd Web
        npm start &
        echo ""
        echo "✅ Server running at http://localhost:3000"
        echo "📄 Landing page at http://localhost:8080/landing.html"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify deployment URL works"
echo "2. Test all features"
echo "3. Update hackathon submission"
echo ""
