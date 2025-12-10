#!/bin/bash
# X402-RS FACILITATOR DEPLOYMENT SCRIPT
# Production deployment for RangisNet x402 payment gateway

set -e

echo "🚀 Deploying x402-rs Facilitator for RangisNet..."
echo "================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Copy .env.example to .env and configure your settings."
    exit 1
fi

# Validate required environment variables
source .env

if [ -z "$RPC_URL_AVALANCHE_FUJI" ]; then
    echo "❌ ERROR: RPC_URL_AVALANCHE_FUJI not set in .env"
    exit 1
fi

if [ -z "$EVM_PRIVATE_KEY" ] || [ "$EVM_PRIVATE_KEY" = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" ]; then
    echo "❌ ERROR: EVM_PRIVATE_KEY not set or using example key"
    echo "Generate a real private key and update .env"
    exit 1
fi

echo "✅ Environment validated"

# Pull latest x402-rs image
echo ""
echo "📥 Pulling latest x402-rs facilitator image..."
docker pull ukstv/x402-facilitator:latest

# Stop existing container if running
echo ""
echo "🛑 Stopping existing facilitator (if running)..."
docker-compose down 2>/dev/null || true

# Start facilitator
echo ""
echo "🚀 Starting x402-rs facilitator..."
docker-compose up -d

# Wait for health check
echo ""
echo "⏳ Waiting for facilitator to be ready..."
sleep 5

# Health check
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Facilitator is healthy!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ ERROR: Facilitator failed to start"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

# Display status
echo ""
echo "================================================="
echo "✅ X402-RS FACILITATOR DEPLOYED SUCCESSFULLY!"
echo "================================================="
echo ""
echo "🌐 Facilitator URL: http://localhost:8080"
echo "📊 Health Check: http://localhost:8080/health"
echo "📋 Logs: docker-compose logs -f"
echo ""

# Get network status
echo "🌍 Supported Networks:"
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
echo "$HEALTH_RESPONSE" | jq -r '.networks[]' | while read network; do
    echo "   ✅ $network"
done

echo ""
echo "🔗 Next Steps:"
echo "   1. Update RangisNet API to point to: http://localhost:8080"
echo "   2. Test payment flow with Fuji testnet"
echo "   3. Monitor with: docker-compose logs -f"
echo "   4. (Optional) Configure OpenTelemetry for production monitoring"
echo ""
echo "🎯 X402 Integration Complete! Rangi's payments are LIVE! 🔥"
