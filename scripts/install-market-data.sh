#!/bin/bash

# RangisNet Market Data Integration - Installation Script
# This script installs all dependencies for the live market data pipeline

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   RangisNet Market Data Integration - Installation         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version is too old (${NODE_VERSION})${NC}"
    echo "Please upgrade to Node.js v18 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm --version) detected${NC}"
echo ""

# Install Web dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installing Web dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd Web

if [ -f "package-lock.json" ]; then
    echo "Using npm..."
    npm install
elif [ -f "pnpm-lock.yaml" ]; then
    echo "Using pnpm..."
    if ! command -v pnpm &> /dev/null; then
        echo "Installing pnpm..."
        npm install -g pnpm
    fi
    pnpm install
else
    echo "No lockfile found, using npm..."
    npm install
fi

echo -e "${GREEN}✓ Web dependencies installed${NC}"
echo ""

# Install Cosmos module dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installing Cosmos module dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd ../cosmos-module

npm install

echo -e "${GREEN}✓ Cosmos module dependencies installed${NC}"
echo ""

# Create environment files if they don't exist
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up environment files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Web .env.local
if [ ! -f "../Web/.env.local" ]; then
    if [ -f "../Web/.env.example" ]; then
        cp ../Web/.env.example ../Web/.env.local
        echo -e "${YELLOW}⚠ Created Web/.env.local from .env.example${NC}"
        echo -e "${YELLOW}  Please edit this file with your configuration${NC}"
    else
        echo -e "${YELLOW}⚠ No .env.example found in Web directory${NC}"
    fi
else
    echo -e "${GREEN}✓ Web/.env.local already exists${NC}"
fi

# Cosmos module .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠ Created cosmos-module/.env from .env.example${NC}"
        echo -e "${YELLOW}  Please edit this file with your oracle configuration${NC}"
    fi
else
    echo -e "${GREEN}✓ cosmos-module/.env already exists${NC}"
fi

echo ""

# Run validation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Running implementation validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd ..

if node validate-implementation.js; then
    echo ""
    echo -e "${GREEN}✓ All validation tests passed!${NC}"
else
    echo ""
    echo -e "${RED}✗ Some validation tests failed${NC}"
    echo "Please review the output above"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Installation Complete!                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit Web/.env.local"
echo "   - Edit cosmos-module/.env"
echo ""
echo "2. Start the development servers:"
echo "   ${GREEN}cd Web && npm run dev${NC}                    # API server"
echo "   ${GREEN}cd Web && npx ts-node websocket-server.ts${NC} # WebSocket server"
echo "   ${GREEN}cd cosmos-module && npm run dev${NC}           # Oracle worker"
echo ""
echo "3. Test the API:"
echo "   ${GREEN}curl http://localhost:3000/api/market-data/BTC${NC}"
echo ""
echo "4. Read the documentation:"
echo "   - MARKET_DATA_API_ARCHITECTURE.md"
echo "   - POLYGON_LAYERZERO_INTEGRATION_GUIDE.md"
echo "   - MARKET_DATA_IMPLEMENTATION_COMPLETE.md"
echo ""
echo "For production deployment, see POLYGON_LAYERZERO_INTEGRATION_GUIDE.md"
echo ""
