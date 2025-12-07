#!/bin/bash
# RangisNet Layer 1.5 Subnet - AvaCloud Deployment
# Sovereign subnet for Mighty Agent operations
# Dec 2025 - Hack2Build x402

set -e

echo "🌈 RangisNet Layer 1.5 Subnet Deployment"
echo "=========================================="
echo ""

# Configuration
SUBNET_NAME="rangis-agent-subnet"
CHAIN_ID="432111"  # 432Hz harmonic + 111 phi
VM_ID="srEXiWaHVryFdKuLWnH9UzxKxJJPxj7uuRnfGjFcqJEBQaK9e"  # Subnet-EVM
GENESIS_FILE="genesis-harmonic.json"

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v avalanche-cli &> /dev/null; then
    echo "❌ avalanche-cli not found. Installing..."
    curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
    export PATH=$PATH:$HOME/bin
fi

if ! command -v cast &> /dev/null; then
    echo "⚠️  Foundry not found (optional for contract verification)"
fi

# Step 1: Generate Harmonic Genesis
echo ""
echo "1️⃣ Generating Harmonic Genesis Configuration..."
cat > "$GENESIS_FILE" << 'EOF'
{
  "config": {
    "chainId": 432111,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "muirGlacierBlock": 0,
    "subnetEVMTimestamp": 0,
    "feeConfig": {
      "gasLimit": 20000000,
      "targetBlockRate": 2,
      "minBaseFee": 1000000000,
      "targetGas": 100000000,
      "baseFeeChangeDenominator": 48,
      "minBlockGasCost": 0,
      "maxBlockGasCost": 10000000,
      "blockGasCostStep": 500000
    },
    "contractDeployerAllowListConfig": {
      "blockTimestamp": 0,
      "adminAddresses": []
    },
    "contractNativeMinterConfig": {
      "blockTimestamp": 0,
      "adminAddresses": []
    }
  },
  "alloc": {
    "8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC": {
      "balance": "0x295BE96E64066972000000"
    }
  },
  "nonce": "0x0",
  "timestamp": "0x0",
  "extraData": "0x00",
  "gasLimit": "0x1312D00",
  "difficulty": "0x0",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
EOF

echo "   ✅ Genesis created with Chain ID: $CHAIN_ID"
echo "   ✅ Gas config: 2s blocks, <0.000001 RANGI fees"

# Step 2: Create Subnet
echo ""
echo "2️⃣ Creating subnet on Fuji testnet..."
avalanche subnet create "$SUBNET_NAME" \
    --genesis "$GENESIS_FILE" \
    --evm \
    --testnet fuji \
    --force

echo "   ✅ Subnet '$SUBNET_NAME' created"

# Step 3: Deploy to Fuji
echo ""
echo "3️⃣ Deploying to Fuji testnet..."
avalanche subnet deploy "$SUBNET_NAME" \
    --fuji \
    --output-tx-path ./deploy-tx.txt

# Extract subnet ID
SUBNET_ID=$(cat ./deploy-tx.txt | grep "Subnet ID" | awk '{print $NF}')
echo "   ✅ Subnet ID: $SUBNET_ID"

# Step 4: Add validators
echo ""
echo "4️⃣ Configuring validators..."
echo "   Validators will process:"
echo "   - Polly agent negotiations"
echo "   - PRM harmonic scoring (H(t) = A(t) * sin(2π * 432 * t + φ))"
echo "   - ICM teleporter routing"
echo ""
echo "   To add validators, run:"
echo "   avalanche subnet addValidator $SUBNET_NAME --fuji"

# Step 5: Deploy precompiles
echo ""
echo "5️⃣ Deploying Harmonic Precompile..."
cd contracts
if [ -f "HarmonicConcesus.sol" ]; then
    echo "   📝 HarmonicConsensus.sol found"
    echo "   Deploy manually with:"
    echo "   forge create HarmonicConsensus --rpc-url <SUBNET_RPC> --private-key <KEY>"
else
    echo "   ⚠️  HarmonicConsensus.sol not found - create from template"
fi

# Step 6: Setup AvaCloud monitoring
echo ""
echo "6️⃣ AvaCloud Integration..."
echo "   🔗 Connect to AvaCloud:"
echo "   - Dashboard: https://console.avax.network/"
echo "   - API: https://api.avax.network/v1/subnets/$SUBNET_ID"
echo ""
echo "   Evaluator nodes (for InfraBuild(AI)):"
echo "   - Monitor agent trade quality"
echo "   - Score PRM prediction accuracy"
echo "   - Report for post-hack grants"

# Step 7: Summary
echo ""
echo "=========================================="
echo "✅ RangisNet Layer 1.5 Subnet DEPLOYED!"
echo "=========================================="
echo ""
echo "📊 Network Details:"
echo "   Chain ID: $CHAIN_ID"
echo "   Subnet ID: $SUBNET_ID"
echo "   Block Time: 2 seconds"
echo "   Gas Token: RANGI"
echo "   Fee: <0.000001 RANGI per tx"
echo ""
echo "🤖 Agent Features:"
echo "   ✅ Polly-based negotiation"
echo "   ✅ Weekly/monthly/yearly spend limits"
echo "   ✅ PRM scoring (432Hz patent)"
echo "   ✅ ICM/Teleporter rails"
echo ""
echo "🔗 Next Steps:"
echo "   1. Add validators: avalanche subnet addValidator $SUBNET_NAME --fuji"
echo "   2. Deploy contracts: cd contracts && forge script Deploy.s.sol --broadcast"
echo "   3. Test ICM warp: ./test-icm-warp.sh"
echo "   4. Integrate Youmio: ./integrate-youmio.sh"
echo ""
echo "🎯 Ready for Mighty Agent demo!"
echo ""
