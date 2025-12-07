#!/bin/bash
set -e

echo "💰 RangisNet x402 + Teleporter Integration Test"
echo "==============================================="

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found. Run 'cp .env.example .env' and configure it."
    exit 1
fi

# Check required variables
if [ -z "$PK" ] || [ -z "$FUNDED_ADDRESS" ]; then
    echo "❌ Missing PK or FUNDED_ADDRESS in .env"
    exit 1
fi

# Determine RPC URL
RPC_URL=${1:-${FUJI_RPC_URL:-"https://api.avax-test.network/ext/bc/C/rpc"}}
echo "🌐 RPC: $RPC_URL"

# Check for cast (Foundry)
if ! command -v cast &> /dev/null; then
    echo "❌ Foundry 'cast' not found. Install: curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

echo ""
echo "Test 1: Checking wallet balance..."
BALANCE=$(cast balance $FUNDED_ADDRESS --rpc-url $RPC_URL)
BALANCE_ETH=$(cast --to-unit $BALANCE ether)
echo "✅ Balance: $BALANCE_ETH AVAX"

if (( $(echo "$BALANCE_ETH < 0.1" | bc -l) )); then
    echo "⚠️  Low balance! Get test funds from: https://faucet.avax.network/"
    echo "    Use coupon code: Hack2Build_payments"
fi

echo ""
echo "Test 2: Checking gas price (x402 threshold)..."
GAS_PRICE=$(cast gas-price --rpc-url $RPC_URL)
GAS_PRICE_GWEI=$(cast --to-unit $GAS_PRICE gwei)
echo "✅ Gas Price: $GAS_PRICE_GWEI Gwei"

# x402 threshold: 0.000001 AVAX = 1000 Gwei (at 21000 gas)
THRESHOLD_GWEI=1000
if (( $(echo "$GAS_PRICE_GWEI < $THRESHOLD_GWEI" | bc -l) )); then
    echo "✅ SUCCESS: Gas price is below x402 threshold!"
else
    echo "⚠️  WARNING: Gas price exceeds x402 threshold ($THRESHOLD_GWEI Gwei)"
fi

echo ""
echo "Test 3: Encoding sensory PRM data..."
# Encode: probability 0.8 (80%), frequency 528 Hz
PRM_DATA=$(cast calldata "encodePRM(uint256,uint256)" 80 528)
echo "✅ PRM Data: $PRM_DATA"

echo ""
echo "Test 4: Sending Teleporter message (if contract deployed)..."

if [ -z "$HARMONIC_CONTRACT" ] || [ "$HARMONIC_CONTRACT" == "0xYourHarmonicConcesusAddressHere" ]; then
    echo "⚠️  HARMONIC_CONTRACT not set in .env. Skipping Teleporter test."
    echo "    Deploy contracts first: forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PK --broadcast"
else
    echo "📡 Sending to HarmonicConcesus contract: $HARMONIC_CONTRACT"
    
    # Send sensory message via Teleporter
    TX_HASH=$(cast send \
        --rpc-url $RPC_URL \
        --private-key $PK \
        $HARMONIC_CONTRACT \
        "sendSensoryMessage(bytes32,bytes)" \
        $FUJI_DISPATCH_BLOCKCHAIN_ID_HEX \
        $PRM_DATA \
        --value 0.000001ether)
    
    echo "✅ Transaction sent: $TX_HASH"
    
    # Wait for confirmation
    echo "⏳ Waiting for confirmation..."
    RECEIPT=$(cast receipt $TX_HASH --rpc-url $RPC_URL)
    
    if echo "$RECEIPT" | grep -q "status.*1"; then
        echo "✅ Transaction confirmed!"
        echo ""
        echo "🎉 x402 Teleporter Test Complete!"
        echo "=================================="
        echo "Check Teleporter Explorer:"
        echo "https://subnets-test.avax.network/c-chain/tx/$TX_HASH"
    else
        echo "❌ Transaction failed. Check receipt:"
        echo "$RECEIPT"
        exit 1
    fi
fi

echo ""
echo "Summary:"
echo "--------"
echo "✅ Wallet funded: $BALANCE_ETH AVAX"
echo "✅ Gas price: $GAS_PRICE_GWEI Gwei (x402 compliant: $([ $(echo "$GAS_PRICE_GWEI < $THRESHOLD_GWEI" | bc -l) -eq 1 ] && echo "YES" || echo "NO"))"
echo "✅ PRM encoding: Working"
echo "✅ Teleporter: $([ -z "$TX_HASH" ] && echo "Skipped (no contract)" || echo "Sent ($TX_HASH)")"
echo ""
echo "Next Steps:"
echo "1. Deploy contracts: forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PK --broadcast"
echo "2. Update .env with deployed addresses"
echo "3. Re-run this script to test end-to-end flow"
echo ""
