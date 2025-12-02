#!/bin/bash
set -e

echo "🚀 RangisNet Avalanche Subnet Deployment Script"
echo "================================================"

# Check prerequisites
if ! command -v avalanche &> /dev/null; then
    echo "❌ Avalanche CLI not found. Installing..."
    curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
    export PATH=$PATH:$HOME/.avalanche-cli/bin
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found. Please create one with FUJI_PK and other required variables."
    exit 1
fi

# Step 1: Create Subnet
echo "📝 Step 1: Creating RangisNet subnet..."
avalanche subnet create rangis \
    --config-dir config/ \
    --genesis config/rangis-genesis.json \
    --evm \
    --chain-id 99999 \
    --token-name RANGI \
    --token-symbol RANGI

# Step 2: Add Validator
echo "👥 Step 2: Adding validator..."
if [ ! -f validators/node1.json ]; then
    echo "⚠️  Validator config not found. Generating keys..."
    avalanche key create node1 --file validators/node1.json
fi

avalanche subnet add-validator rangis \
    --config-dir config/ \
    --validators-file validators/node1.json

# Step 3: Bootstrap Subnet
echo "🔗 Step 3: Bootstrapping subnet..."
avalanche subnet bootstrap rangis \
    --config-dir config/

# Step 4: Deploy to Fuji Testnet
echo "🌐 Step 4: Deploying to Fuji testnet..."
avalanche subnet deploy rangis \
    --fuji \
    --private-key-file ~/.avalanche/key \
    --config-dir config/

# Get subnet RPC endpoint
SUBNET_RPC=$(avalanche subnet describe rangis --fuji | grep "RPC URL" | awk '{print $NF}')
echo "✅ Subnet RPC: $SUBNET_RPC"

# Step 5: Deploy Smart Contracts
echo "📜 Step 5: Deploying smart contracts..."
if command -v forge &> /dev/null; then
    cd Web
    forge script scripts/Deploy.s.sol:DeployScript \
        --rpc-url $SUBNET_RPC \
        --private-key $FUJI_PK \
        --broadcast \
        --verify
    cd ..
else
    echo "⚠️  Foundry not installed. Skipping contract deployment."
fi

# Step 6: Test x402 Payment
echo "💰 Step 6: Testing x402 micropayment..."
if [ -f scripts/test-x402-payment.sh ]; then
    chmod +x scripts/test-x402-payment.sh
    ./scripts/test-x402-payment.sh $SUBNET_RPC
else
    echo "⚠️  x402 test script not found. Skipping."
fi

# Final Output
echo ""
echo "🎉 RangisNet Subnet Deployment Complete!"
echo "========================================"
echo "Chain ID: 99999"
echo "Token: RANGI"
echo "RPC URL: $SUBNET_RPC"
echo "Explorer: https://subnets.avax.network/rangis"
echo ""
echo "Add to MetaMask:"
echo "  Network Name: RangisNet"
echo "  RPC URL: $SUBNET_RPC"
echo "  Chain ID: 99999"
echo "  Currency Symbol: RANGI"
echo ""
echo "Next Steps:"
echo "1. Update .env with SUBNET_RPC=$SUBNET_RPC"
echo "2. Test PTE integration: pnpm test"
echo "3. Start ICM relayer: docker-compose up relayer"
echo ""
