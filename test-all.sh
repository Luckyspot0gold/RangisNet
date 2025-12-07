#!/bin/bash
# Quick Test - Verify all 5 steps are working
# Run this before recording your demo video

set -e

echo "╔═══════════════════════════════════════════════════════╗"
echo "║  🧪 RangisNet 5-Step Integration Test                ║"
echo "║  Verifying all components before demo recording      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_step() {
    local step=$1
    local name=$2
    local command=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Step $step: $name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
}

# Step 1: Check x402 + Thirdweb files
test_step 1 "x402 + Thirdweb Integration" \
    "[ -f Web/lib/x402ThirdwebConnect.ts ] && [ -f Web/lib/thirdwebFacilitator.ts ] && [ -f Web/lib/x402Client.ts ]"

# Step 2: Check Warp test script
test_step 2 "Warp + ICM Test Script" \
    "[ -f Avalanche/subnet/scripts/test-warp.sh ] && [ -x Avalanche/subnet/scripts/test-warp.sh ]"

# Step 3: Check Polly agent
test_step 3 "Polly Agent Brain" \
    "[ -f Web/src/mighty-agent.ts ]"

# Step 4: Check accessibility
test_step 4 "Accessibility Features" \
    "[ -f Web/src/accessibility.ts ]"

# Step 5: Check demo materials
test_step 5 "Demo Materials" \
    "[ -f Web/src/complete-integration.ts ] && [ -f Web/src/app/demo/page.tsx ] && [ -f docs/DEMO-VIDEO-SCRIPT.md ] && [ -f docs/PITCH-DECK-7-SLIDES.md ]"

# Check package.json dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd Web
if grep -q "thirdweb" package.json && grep -q "x402-hono" package.json; then
    echo -e "${GREEN}✅ All required packages in package.json${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Missing required packages${NC}"
    ((FAILED++))
fi
cd ..
echo ""

# Check if node_modules exists
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "Web/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Dependencies not installed - run: cd Web && pnpm install${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                    TEST SUMMARY                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 ALL TESTS PASSED - READY FOR DEMO!               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start dev server: cd Web && pnpm dev"
    echo "2. Open demo page: http://localhost:3000/demo"
    echo "3. Test Warp script: ./Avalanche/subnet/scripts/test-warp.sh"
    echo "4. Record video following: docs/DEMO-VIDEO-SCRIPT.md"
    echo ""
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️  SOME TESTS FAILED - CHECK ABOVE                 ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    exit 1
fi
