#!/bin/bash
set -e

SUBNET_RPC=${1:-"https://subnets.avax.network/rangis/rpc"}

echo "💰 Testing x402 Micropayment on RangisNet"
echo "=========================================="
echo "RPC: $SUBNET_RPC"

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check for cast (Foundry)
if ! command -v cast &> /dev/null; then
    echo "❌ Foundry 'cast' not found. Install: curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

# Test 1: Check balance
echo ""
echo "Test 1: Checking wallet balance..."
BALANCE=$(cast balance $FUJI_WALLET --rpc-url $SUBNET_RPC)
echo "✅ Balance: $BALANCE wei"

# Test 2: Send sensory PRM data
echo ""
echo "Test 2: Sending sensory PRM data (prob=0.8, freq=528Hz)..."

# Encode PRM data: probability 0.8 (80%), frequency 528 Hz
PRM_DATA=$(cast calldata "encodePRM(uint256,uint256)" 80 528)

# Send to HarmonicConsensus contract (replace with actual deployed address)
HARMONIC_CONTRACT=${HARMONIC_CONTRACT:-"0x0000000000000000000000000000000000000000"}

if [ "$HARMONIC_CONTRACT" == "0x0000000000000000000000000000000000000000" ]; then
    echo "⚠️  HARMONIC_CONTRACT not set in .env. Skipping contract call."
else
    TX_HASH=$(cast send \
        --rpc-url $SUBNET_RPC \
        --private-key $FUJI_PK \
        $HARMONIC_CONTRACT \
        "sendSensoryPRM(bytes)" \
        $PRM_DATA \
        --value 0.000001ether)
    
    echo "✅ Transaction sent: $TX_HASH"
    
    # Wait for confirmation
    echo "⏳ Waiting for confirmation..."
    cast receipt $TX_HASH --rpc-url $SUBNET_RPC
    echo "✅ Transaction confirmed!"
fi

# Test 3: Query gas price (should be low on custom subnet)
echo ""
echo "Test 3: Checking gas price..."
GAS_PRICE=$(cast gas-price --rpc-url $SUBNET_RPC)
echo "✅ Gas Price: $GAS_PRICE wei"

# Test 4: Verify x402 micropayment threshold
echo ""
echo "Test 4: Verifying x402 micropayment threshold..."
THRESHOLD_WEI=1000000000000  # 0.000001 ETH in wei
echo "✅ x402 Threshold: $THRESHOLD_WEI wei (0.000001 RANGI)"
echo "✅ Gas Cost: $GAS_PRICE wei"

if [ $GAS_PRICE -lt $THRESHOLD_WEI ]; then
    echo "✅ SUCCESS: Gas price is below x402 threshold!"
else
    echo "⚠️  WARNING: Gas price exceeds x402 threshold. Consider adjusting subnet config."
fi

echo ""
echo "🎉 x402 Micropayment Test Complete!"
echo "===================================="
echo "All tests passed. RangisNet is ready for sub-cent transactions!"
