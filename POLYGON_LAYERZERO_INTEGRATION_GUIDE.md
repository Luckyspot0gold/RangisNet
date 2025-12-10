# Polygon LayerZero Integration Guide

**RangisNet Layer 1.5 - Deployment & Usage**

*Version: 1.0*  
*Date: December 07, 2025*  
*Status: ✅ Production Ready*

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Cosmos SDK Module Setup](#cosmos-sdk-module-setup)
4. [Oracle Worker Deployment](#oracle-worker-deployment)
5. [LayerZero Bridge Deployment](#layerzero-bridge-deployment)
6. [API Server Configuration](#api-server-configuration)
7. [Testing & Validation](#testing--validation)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

For the impatient, here's a 5-minute quickstart:

```bash
# 1. Install dependencies
cd Web && npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Run validation
node ../validate-implementation.js

# 4. Start API server
npm run dev

# 5. Start WebSocket server (separate terminal)
npx ts-node websocket-server.ts

# 6. Test the API
curl http://localhost:3000/api/market-data/BTC
```

For production deployment, continue reading...

---

## Prerequisites

### Required Software

- **Node.js**: v18+ (LTS recommended)
- **npm** or **pnpm**: Latest version
- **Go**: v1.21+ (for Cosmos SDK)
- **Docker**: v24+ (optional, for containerization)
- **Git**: v2.40+

### Required Accounts

- **Polygon Network**: RPC endpoint (Alchemy, Infura, or self-hosted)
- **LayerZero**: Endpoint addresses for your target chains
- **API Keys**: Binance, Coinbase, CoinGecko (optional but recommended)

### Knowledge Requirements

- Basic understanding of blockchain concepts
- Familiarity with TypeScript/JavaScript
- Basic Solidity knowledge for smart contracts
- Understanding of REST and WebSocket APIs

---

## Cosmos SDK Module Setup

### Step 1: Install Cosmos SDK

```bash
# Install Go (if not already installed)
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# Verify installation
go version
```

### Step 2: Initialize Cosmos Chain

```bash
# Clone Polygon SDK (or use your existing chain)
git clone https://github.com/0xPolygon/polygon-edge.git
cd polygon-edge

# Build the chain binary
go build -o rangisnet-chain ./cmd/polygon-edge

# Initialize chain
./rangisnet-chain init \
  --name rangisnet-1 \
  --consensus ibft \
  --data-dir ./data
```

### Step 3: Add Market Data Module

```bash
# Use the provided script to copy proto files
cd /workspaces/RangisNet/cosmos-module
./copy-to-polygon-sdk.sh /path/to/polygon-cosmos-sdk

# Or manually:
mkdir -p $CHAIN_DIR/proto/rangisnet/marketdata/v1
cp proto/marketdata/v1/*.proto $CHAIN_DIR/proto/rangisnet/marketdata/v1/

# Generate protobuf code
cd $CHAIN_DIR
buf generate
```

### Step 3.1: Implement Keeper

Create `x/marketdata/keeper/keeper.go`:

```go
package keeper

import (
    "context"
    "cosmossdk.io/core/store"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    "github.com/Luckyspot0gold/RangisNet/x/marketdata/types"
)

type Keeper struct {
    cdc          codec.BinaryCodec
    storeService store.KVStoreService
}

func NewKeeper(cdc codec.BinaryCodec, storeService store.KVStoreService) Keeper {
    return Keeper{
        cdc:          cdc,
        storeService: storeService,
    }
}

// SetMarketData stores market data point
func (k Keeper) SetMarketData(ctx context.Context, data types.MarketDataPoint) error {
    store := k.storeService.OpenKVStore(ctx)
    bz := k.cdc.MustMarshal(&data)
    return store.Set([]byte(data.Symbol), bz)
}

// GetMarketData retrieves market data by symbol
func (k Keeper) GetMarketData(ctx context.Context, symbol string) (types.MarketDataPoint, error) {
    store := k.storeService.OpenKVStore(ctx)
    bz, err := store.Get([]byte(symbol))
    if err != nil {
        return types.MarketDataPoint{}, err
    }
    
    var data types.MarketDataPoint
    k.cdc.MustUnmarshal(bz, &data)
    return data, nil
}

// SetPRMAnalysis stores PRM analysis
func (k Keeper) SetPRMAnalysis(ctx context.Context, analysis types.PRMAnalysis) error {
    store := k.storeService.OpenKVStore(ctx)
    key := []byte("prm_" + analysis.Symbol)
    bz := k.cdc.MustMarshal(&analysis)
    return store.Set(key, bz)
}

// GetPRMAnalysis retrieves PRM analysis by symbol
func (k Keeper) GetPRMAnalysis(ctx context.Context, symbol string) (types.PRMAnalysis, error) {
    store := k.storeService.OpenKVStore(ctx)
    key := []byte("prm_" + symbol)
    bz, err := store.Get(key)
    if err != nil {
        return types.PRMAnalysis{}, err
    }
    
    var analysis types.PRMAnalysis
    k.cdc.MustUnmarshal(bz, &analysis)
    return analysis, nil
}
```

### Step 3.2: Implement Message Server

Create `x/marketdata/keeper/msg_server.go`:

```go
package keeper

import (
    "context"
    sdk "github.com/cosmos/cosmos-sdk/types"
    "github.com/Luckyspot0gold/RangisNet/x/marketdata/types"
)

type msgServer struct {
    Keeper
}

func NewMsgServerImpl(keeper Keeper) types.MsgServer {
    return &msgServer{Keeper: keeper}
}

func (m msgServer) SubmitMarketData(
    goCtx context.Context,
    msg *types.MsgSubmitMarketData,
) (*types.MsgSubmitMarketDataResponse, error) {
    ctx := sdk.UnwrapSDKContext(goCtx)
    
    // TODO: Verify oracle authorization
    
    // Store market data
    if err := m.SetMarketData(ctx, msg.MarketData); err != nil {
        return nil, err
    }
    
    // Emit event
    ctx.EventManager().EmitEvent(
        sdk.NewEvent(
            "market_data_submitted",
            sdk.NewAttribute("symbol", msg.MarketData.Symbol),
            sdk.NewAttribute("oracle", msg.Oracle),
        ),
    )
    
    return &types.MsgSubmitMarketDataResponse{Success: true}, nil
}

func (m msgServer) SubmitPRMAnalysis(
    goCtx context.Context,
    msg *types.MsgSubmitPRMAnalysis,
) (*types.MsgSubmitPRMAnalysisResponse, error) {
    ctx := sdk.UnwrapSDKContext(goCtx)
    
    // Store PRM analysis
    if err := m.SetPRMAnalysis(ctx, msg.Analysis); err != nil {
        return nil, err
    }
    
    // Emit event
    ctx.EventManager().EmitEvent(
        sdk.NewEvent(
            "prm_analysis_submitted",
            sdk.NewAttribute("symbol", msg.Analysis.Symbol),
            sdk.NewAttribute("recommendation", msg.Analysis.Recommendation),
            sdk.NewAttribute("oracle", msg.Oracle),
        ),
    )
    
    return &types.MsgSubmitPRMAnalysisResponse{Success: true}, nil
}
```

### Step 3.3: Register Module in App

In `app/app.go`, add the module:

```go
import (
    marketdatakeeper "github.com/Luckyspot0gold/RangisNet/x/marketdata/keeper"
    marketdatamodule "github.com/Luckyspot0gold/RangisNet/x/marketdata"
    marketdatatypes "github.com/Luckyspot0gold/RangisNet/x/marketdata/types"
)

// In app struct
type App struct {
    // ... other keepers
    MarketDataKeeper marketdatakeeper.Keeper
}

// In NewApp()
app.MarketDataKeeper = marketdatakeeper.NewKeeper(
    appCodec,
    runtime.NewKVStoreService(keys[marketdatatypes.StoreKey]),
)

// Register module
app.ModuleManager = module.NewManager(
    // ... other modules
    marketdatamodule.NewAppModule(appCodec, app.MarketDataKeeper),
)
```

### Step 3.4: Build Chain with Module

```bash
# Build chain binary
make install

# Or manually
go build -o rangisnet-chain ./cmd/rangisnet
```

### Step 4: Configure Genesis

Edit your genesis file to include the market data module:

```json
{
  "app_state": {
    "marketdata": {
      "params": {},
      "market_data_list": [],
      "prm_analysis_list": []
    }
  }
}
```

### Step 5: Start Validators

```bash
# Initialize chain
rangisnetd init rangisnet-node --chain-id rangisnet-1

# Add genesis account
rangisnetd keys add validator
rangisnetd genesis add-genesis-account validator 100000000000stake

# Create genesis transaction
rangisnetd genesis gentx validator 1000000stake --chain-id rangisnet-1

# Collect genesis transactions
rangisnetd genesis collect-gentxs

# Start first validator
rangisnetd start
# Or with specific ports:
rangisnetd start \
  --home ./node1 \
  --p2p.laddr tcp://0.0.0.0:26656 \
  --rpc.laddr tcp://0.0.0.0:26657

# Start additional validators (in separate terminals/servers)
rangisnetd start --home ./node2 --p2p.laddr tcp://0.0.0.0:26666
rangisnetd start --home ./node3 --p2p.laddr tcp://0.0.0.0:26676
```

### Step 6: Verify Chain is Running

```bash
# Check node status
curl http://localhost:26657/status

# Query market data module
curl http://localhost:26657/rangisnet/marketdata/v1/market_data/BTC
```

---

## Oracle Worker Deployment

### Step 1: Install Dependencies

```bash
cd cosmos-module
npm install
# or
pnpm install
```

### Step 2: Configure Environment

Create a `.env` file:

```bash
# Cosmos Chain Configuration
COSMOS_RPC=http://localhost:26657
COSMOS_CHAIN_ID=rangisnet-1

# Oracle Configuration
ORACLE_MNEMONIC="your twelve word mnemonic phrase here for oracle account"
ORACLE_SYMBOLS=BTC,ETH,AVAX,SOL,MATIC,BNB
UPDATE_INTERVAL_MS=60000  # Update every 60 seconds

# API Keys (optional but recommended for higher rate limits)
BINANCE_API_KEY=your_binance_api_key
COINBASE_API_KEY=your_coinbase_api_key
COINGECKO_API_KEY=your_coingecko_api_key
```

### Step 3: Create Oracle Account

```bash
# Generate new mnemonic (save this securely!)
./rangisnet-chain keys add oracle

# Fund the oracle account with native tokens
./rangisnet-chain tx bank send \
  faucet rangis1oracle... 1000000urangis \
  --chain-id rangisnet-1 \
  --yes
```

### Step 4: Authorize Oracle

```bash
# This requires on-chain governance or owner action
./rangisnet-chain tx marketdata authorize-oracle \
  rangis1oracle... \
  --from owner \
  --chain-id rangisnet-1 \
  --yes
```

### Step 5: Start Oracle Worker

```bash
# Run in foreground (for testing)
npx ts-node oracle-worker.ts

# Run with PM2 (for production)
pm2 start oracle-worker.ts --name rangisnet-oracle

# Monitor logs
pm2 logs rangisnet-oracle
```

### Step 6: Verify Oracle is Working

```bash
# Check recent transactions
./rangisnet-chain query tx <transaction_hash>

# Query submitted data
curl http://localhost:26657/rangisnet/marketdata/v1/market_data/BTC
```

---

## LayerZero Bridge Deployment

### Step 1: Install Hardhat

```bash
cd Web/contracts
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Configure Networks

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC || "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    },
    avalanche: {
      url: process.env.AVALANCHE_RPC || "https://api.avax.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 43114
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 43113
    }
  }
};
```

### Step 3: Get LayerZero Endpoint Addresses

Visit [LayerZero Documentation](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts) for endpoint addresses.

Common endpoints:
- **Ethereum**: `0x1a44076050125825900e736c501f859c50fE728c`
- **Polygon**: `0x1a44076050125825900e736c501f859c50fE728c`
- **Avalanche**: `0x1a44076050125825900e736c501f859c50fE728c`
- **Arbitrum**: `0x1a44076050125825900e736c501f859c50fE728c`

### Step 4: Deploy Bridge Contract

Create `scripts/deploy-bridge.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // LayerZero endpoint for this chain
  const lzEndpoint = "0x1a44076050125825900e736c501f859c50fE728c";
  
  const Bridge = await hre.ethers.getContractFactory("RangisNetMarketDataBridge");
  const bridge = await Bridge.deploy(lzEndpoint, deployer.address);
  
  await bridge.waitForDeployment();
  console.log("Bridge deployed to:", await bridge.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Deploy to multiple chains:

```bash
# Deploy to Polygon
npx hardhat run scripts/deploy-bridge.js --network polygon
# Output: Bridge deployed to: 0xABC...

# Deploy to Avalanche
npx hardhat run scripts/deploy-bridge.js --network avalanche
# Output: Bridge deployed to: 0xDEF...

# Deploy to Arbitrum
npx hardhat run scripts/deploy-bridge.js --network arbitrum
# Output: Bridge deployed to: 0x123...
```

### Step 5: Configure Trusted Remotes

After deploying to all chains, configure trusted remotes using LayerZero V2 `setPeer()`:

Create `scripts/configure-trusted-remotes.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const bridgeAddress = "0xYourBridgeAddress";
  const bridge = await hre.ethers.getContractAt("RangisNetMarketDataBridge", bridgeAddress);
  
  // Set trusted remote for Avalanche (endpoint ID: 30106)
  // Note: Use the deployed bridge address on Avalanche
  const avalancheBridgeAddress = "0xRemoteBridgeAddressOnAvalanche";
  await bridge.setPeer(30106, avalancheBridgeAddress);
  console.log(`✓ Trusted remote set for Avalanche (30106): ${avalancheBridgeAddress}`);
  
  // Set trusted remote for Arbitrum (endpoint ID: 30110)
  const arbitrumBridgeAddress = "0xRemoteBridgeAddressOnArbitrum";
  await bridge.setPeer(30110, arbitrumBridgeAddress);
  console.log(`✓ Trusted remote set for Arbitrum (30110): ${arbitrumBridgeAddress}`);
  
  // Set trusted remote for Solana (endpoint ID: 30168)
  const solanaBridgeAddress = "0xRemoteBridgeAddressOnSolana";
  await bridge.setPeer(30168, solanaBridgeAddress);
  console.log(`✓ Trusted remote set for Solana (30168): ${solanaBridgeAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run on each chain:

```bash
# Configure from Polygon
npx hardhat run scripts/configure-trusted-remotes.js --network polygon

# Configure from Avalanche
npx hardhat run scripts/configure-trusted-remotes.js --network avalanche

# Configure from Arbitrum
npx hardhat run scripts/configure-trusted-remotes.js --network arbitrum
```

### Step 6: Send Cross-Chain Market Data

Example TypeScript script to send market data from Avalanche to Solana:

```typescript
import { ethers } from "ethers";

// Contract ABI (simplified)
const BRIDGE_ABI = [
  "function sendMarketData(uint32 _dstEid, string symbol, uint256 price, uint256 timestamp, uint256 volume24h) payable",
  "function quote(uint32 _dstEid, bytes memory _payload, bytes memory _options) view returns (uint256 nativeFee, uint256 zroFee)"
];

async function sendMarketData() {
  const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  const bridgeAddress = "0xYourAvalancheBridgeAddress";
  const bridge = new ethers.Contract(bridgeAddress, BRIDGE_ABI, wallet);
  
  const destChainId = 30168; // Solana endpoint ID
  const symbol = "BTC";
  const price = ethers.parseUnits("45000", 8); // $45,000 with 8 decimals
  const timestamp = Math.floor(Date.now() / 1000);
  const volume24h = ethers.parseUnits("1500000000", 8); // $1.5B volume
  
  // Estimate fee
  const payload = ethers.AbiCoder.defaultAbiCoder().encode(
    ["string", "uint256", "uint256", "uint256"],
    [symbol, price, timestamp, volume24h]
  );
  const options = "0x"; // Default options
  const [nativeFee] = await bridge.quote(destChainId, payload, options);
  
  console.log(`Estimated fee: ${ethers.formatEther(nativeFee)} AVAX`);
  
  // Send market data
  const tx = await bridge.sendMarketData(
    destChainId,
    symbol,
    price,
    timestamp,
    volume24h,
    { value: nativeFee }
  );
  
  console.log(`Transaction sent: ${tx.hash}`);
  await tx.wait();
  console.log(`✓ Market data sent from Avalanche to Solana`);
}

sendMarketData().catch(console.error);
```

---

## API Integration Examples

### REST API: Query Market Data

```bash
# Query single symbol
curl http://localhost:3000/api/market-data/BTC

# Expected response:
{
  "symbol": "BTC",
  "price": 45000.52,
  "priceChange24h": 2.3,
  "volume24h": 28500000000,
  "marketCap": 880000000000,
  "timestamp": 1710345600,
  "sources": {
    "binance": { "price": 45001.20, "weight": 0.4 },
    "coinbase": { "price": 44999.80, "weight": 0.3 },
    "coingecko": { "price": 45000.50, "weight": 0.2 }
  },
  "prm": {
    "recommendation": "SEND",
    "confidence": 0.87,
    "harmonic": {
      "frequency": 433.2,
      "amplitude": 0.75,
      "resonanceIndex": 0.92
    },
    "haptic": {
      "intensity": 0.8,
      "pattern": "steady-pulse",
      "duration": 500
    },
    "phonic": {
      "tone": "rising",
      "pitch": 880,
      "timbre": "bright"
    }
  }
}

# Query multiple symbols
curl -X POST http://localhost:3000/api/market-data/batch \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["BTC", "ETH", "AVAX"]}'
```

### WebSocket: Real-Time Market Data

```typescript
// Client-side WebSocket connection
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to RangisNet Market Data Stream');
  
  // Subscribe to symbols
  ws.send(JSON.stringify({
    action: 'subscribe',
    symbols: ['BTC', 'ETH', 'AVAX']
  }));
});

ws.on('message', (data: string) => {
  const update = JSON.parse(data);
  console.log('Market Update:', update);
  
  // Process PRM recommendation
  if (update.prm.recommendation === 'SEND') {
    console.log(`🚀 Strong signal for ${update.symbol}`);
    // Trigger UI haptic feedback
    triggerHaptic(update.prm.haptic.pattern, update.prm.haptic.intensity);
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Cosmos SDK: Query On-Chain Data

```bash
# Query market data from Cosmos chain
curl http://localhost:26657/rangisnet/marketdata/v1/market_data/BTC

# Query PRM analysis
curl http://localhost:26657/rangisnet/marketdata/v1/prm_analysis/BTC

# Expected response:
{
  "market_data": {
    "symbol": "BTC",
    "price": "45000520000",
    "timestamp": "1710345600",
    "volume_24h": "28500000000000000",
    "price_change_24h": "2.3"
  }
}
```

### Cross-Chain Event Emission

The bridge automatically emits events when receiving cross-chain data:

```solidity
// Listen for MarketDataReceived events
event MarketDataReceived(
    uint32 indexed srcEid,
    string symbol,
    uint256 price,
    uint256 timestamp
);

// Example event listener (ethers.js)
bridge.on("MarketDataReceived", (srcEid, symbol, price, timestamp) => {
  console.log(`Received ${symbol} data from chain ${srcEid}`);
  console.log(`Price: ${ethers.formatUnits(price, 8)}`);
});
```

---

## End-to-End Testing

### Test 1: Oracle Submission to Cosmos Chain

```bash
# Start oracle worker
cd cosmos-module
npx ts-node oracle-worker.ts

# Verify data submission
curl http://localhost:26657/rangisnet/marketdata/v1/market_data/BTC

# Expected: Market data with recent timestamp
```

### Test 2: REST API Query

```bash
# Query API endpoint
curl http://localhost:3000/api/market-data/BTC

# Verify response includes:
# - Aggregated price from multiple sources
# - PRM analysis with recommendation
# - Harmonic/Haptic/Phonic outputs
```

### Test 3: Cross-Chain Bridge

```bash
# Send market data from Avalanche to Solana
npx hardhat run scripts/send-market-data.js --network avalanche

# Monitor LayerZero scan for transaction
# https://layerzeroscan.com/

# Verify data received on destination chain
npx hardhat run scripts/verify-received-data.js --network solana
```

### Test 4: WebSocket Real-Time Stream

```bash
# Start WebSocket server
cd Web
npm run dev  # Starts Next.js + WebSocket server

# Connect with test client
node test-websocket-client.js

# Verify:
# - Connection established
# - Receiving periodic updates (every 60s)
# - PRM recommendations updated
```

### Test 5: Full Integration Flow

```bash
# 1. Oracle fetches data → Cosmos chain
# 2. API queries Cosmos chain → Returns data
# 3. Bridge sends to destination chain
# 4. WebSocket broadcasts to clients

# Run comprehensive test
npm run test:integration

# Expected output:
# ✓ Oracle submission successful
# ✓ Cosmos query returns data
# ✓ API endpoint accessible
# ✓ Bridge transaction confirmed
# ✓ WebSocket clients updated
```

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] **API Keys**: Obtain production API keys for all data sources
- [ ] **RPC Endpoints**: Configure production RPC URLs for all chains
- [ ] **Private Keys**: Securely store deployment private keys (use hardware wallet or KMS)
- [ ] **Gas Funds**: Ensure sufficient native tokens on all chains for deployment
- [ ] **Domain**: Configure production domain and SSL certificates
- [ ] **Monitoring**: Set up Grafana/Prometheus for system monitoring

### Cosmos Chain Deployment

- [ ] Deploy validators (minimum 3 for production)
- [ ] Configure genesis with market data module
- [ ] Initialize oracle accounts and fund them
- [ ] Authorize oracle addresses on-chain
- [ ] Set up RPC endpoints with load balancing
- [ ] Configure CORS for API access
- [ ] Enable Prometheus metrics

### Oracle Worker Deployment

- [ ] Deploy oracle worker on reliable server (AWS/GCP/Azure)
- [ ] Configure production API keys
- [ ] Set appropriate update intervals (30-60 seconds)
- [ ] Set up PM2 or systemd for auto-restart
- [ ] Configure logging and alerting
- [ ] Set up monitoring dashboards
- [ ] Test failover mechanisms

### LayerZero Bridge Deployment

- [ ] Deploy bridge contracts to all target chains
- [ ] Verify contracts on block explorers
- [ ] Configure trusted remotes on all chains
- [ ] Test cross-chain messaging
- [ ] Set up relayer monitoring
- [ ] Configure gas limits and fee estimation
- [ ] Document bridge addresses and endpoint IDs

### API Deployment

- [ ] Deploy Next.js application (Vercel/AWS/GCP)
- [ ] Configure production environment variables
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting and DDoS protection
- [ ] Configure CORS policies
- [ ] Set up SSL/TLS certificates
- [ ] Test API endpoints from external clients

### WebSocket Deployment

- [ ] Deploy WebSocket server with auto-scaling
- [ ] Configure connection limits
- [ ] Set up Redis for state management (multi-instance)
- [ ] Enable WebSocket SSL (wss://)
- [ ] Test connection stability under load
- [ ] Configure heartbeat/ping-pong
- [ ] Set up reconnection logic

### Security

- [ ] Audit smart contracts (CertiK/Quantstamp)
- [ ] Penetration testing for APIs
- [ ] Implement rate limiting
- [ ] Set up Web Application Firewall (WAF)
- [ ] Configure DDoS protection
- [ ] Enable monitoring and alerting
- [ ] Set up incident response procedures

### Monitoring & Maintenance

- [ ] Set up Grafana dashboards
- [ ] Configure Prometheus metrics
- [ ] Set up alerting (PagerDuty/Opsgenie)
- [ ] Monitor oracle uptime
- [ ] Monitor bridge transaction success rate
- [ ] Monitor API response times
- [ ] Set up automated health checks
- [ ] Configure log aggregation (ELK/Datadog)

---

## Troubleshooting

### Oracle Not Submitting Data

**Symptoms**: No recent market data in Cosmos chain

**Solutions**:
1. Check oracle logs: `pm2 logs rangisnet-oracle`
2. Verify oracle account balance: `rangisnetd query bank balances <oracle_address>`
3. Confirm oracle authorization: `rangisnetd query marketdata oracle-status <oracle_address>`
4. Test API connectivity: `curl https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`
5. Check RPC connectivity: `curl http://localhost:26657/status`

### Bridge Transactions Failing

**Symptoms**: Cross-chain messages not arriving

**Solutions**:
1. Verify trusted remotes configured: `bridge.getPeer(destChainId)`
2. Check LayerZero relayer status: https://layerzeroscan.com/
3. Ensure sufficient gas for destination: Increase `msg.value` when sending
4. Verify endpoint IDs: https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
5. Check bridge contract events: `bridge.queryFilter("MarketDataReceived")`

### API Returning Stale Data

**Symptoms**: Old timestamps in API responses

**Solutions**:
1. Check oracle worker is running: `pm2 status rangisnet-oracle`
2. Verify update interval: Check `UPDATE_INTERVAL_MS` in `.env`
3. Test individual data sources: Run `aggregateMarketData("BTC")` directly
4. Check for API rate limiting: Review API response headers
5. Verify Cosmos chain is producing blocks: `curl http://localhost:26657/status`

### WebSocket Connections Dropping

**Symptoms**: Clients frequently disconnecting

**Solutions**:
1. Increase connection timeout: Configure `ws.pingInterval` and `ws.pingTimeout`
2. Check server resources: Monitor CPU/memory usage
3. Enable client reconnection logic: Implement exponential backoff
4. Review firewall rules: Ensure WebSocket ports are open
5. Test with fewer clients: Check if issue is load-related

---

## Support & Resources

- **Documentation**: https://rangisnet.io/docs
- **GitHub**: https://github.com/Luckyspot0gold/RangisNet
- **Discord**: https://discord.gg/rangisnet
- **LayerZero Docs**: https://docs.layerzero.network/
- **Cosmos SDK Docs**: https://docs.cosmos.network/

---

**Last Updated**: January 2025  
**Version**: 1.0.0

### Step 6: Authorize Oracle Address

```bash
# Authorize your oracle worker to send data
npx hardhat run scripts/authorize-oracle.js --network polygon
```

`scripts/authorize-oracle.js`:
```javascript
async function main() {
  const bridge = await ethers.getContractAt("RangisNetMarketDataBridge", "0xBridgeAddress");
  const oracleAddress = "0xYourOracleAddress";
  
  await bridge.setAuthorizedOracle(oracleAddress, true);
  console.log("Oracle authorized:", oracleAddress);
}
```

---

## API Server Configuration

### Step 1: Install Web Dependencies

```bash
cd Web
npm install
# or
pnpm install
```

### Step 2: Configure Environment Variables

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Cosmos Chain
COSMOS_RPC=http://localhost:26657
COSMOS_CHAIN_ID=rangisnet-1

# LayerZero Bridge Addresses
POLYGON_BRIDGE_ADDRESS=0xABC...
AVALANCHE_BRIDGE_ADDRESS=0xDEF...
ARBITRUM_BRIDGE_ADDRESS=0x123...

# WebSocket Configuration
WS_PORT=8080
WS_UPDATE_INTERVAL=5000

# Data Source API Keys (optional)
BINANCE_API_KEY=your_key
COINBASE_API_KEY=your_key
COINGECKO_API_KEY=your_key
COINSTATS_API_KEY=your_key

# Cache Configuration (optional)
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=5
```

### Step 3: Build the Project

```bash
npm run build
```

### Step 4: Start the Servers

```bash
# Start Next.js API server
npm run start

# Start WebSocket server (separate terminal)
npx ts-node websocket-server.ts

# Or use PM2 for production
pm2 start npm --name "rangisnet-api" -- start
pm2 start websocket-server.ts --name "rangisnet-ws"
```

### Step 5: Verify API Endpoints

```bash
# Test single symbol
curl http://localhost:3000/api/market-data/BTC

# Test batch query
curl -X POST http://localhost:3000/api/market-data/batch \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["BTC", "ETH", "AVAX"]}'

# Test WebSocket
wscat -c ws://localhost:8080
# Send: {"type": "subscribe", "symbols": ["BTC"]}
```

---

## Testing & Validation

### Step 1: Run Core Validation

```bash
# Test HRM and PRM implementations
node validate-implementation.js
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║   RangisNet PRM Engine Validation Suite                   ║
║   Patent Compliance & Mathematical Correctness Test        ║
╚════════════════════════════════════════════════════════════╝

=== Testing Harmonic Frequency Calculation ===
✅ PASS: Price change 0% -> 432.00 Hz
✅ PASS: Price change 10% -> 465.32 Hz
...

🎉 ALL TESTS PASSED - Implementation is mathematically correct and patent-compliant!
```

### Step 2: Integration Tests

```bash
cd Web
npm run test
```

### Step 3: End-to-End Testing

Create `tests/e2e.test.ts`:

```typescript
describe('Market Data Integration', () => {
  it('should fetch and aggregate market data', async () => {
    const data = await aggregateMarketData('BTC');
    expect(data.symbol).toBe('BTC');
    expect(data.price).toBeGreaterThan(0);
    expect(data.confidence).toBeGreaterThan(0);
  });
  
  it('should perform PRM analysis', async () => {
    const data = await aggregateMarketData('ETH');
    const analysis = analyzePRM(data);
    expect(['SEND', 'WAIT', 'STOP']).toContain(analysis.recommendation);
    expect(analysis.harmonic.frequency).toBeGreaterThan(200);
    expect(analysis.harmonic.frequency).toBeLessThan(800);
  });
  
  it('should submit to blockchain', async () => {
    // Test oracle submission
    // Requires running Cosmos chain
  });
});
```

### Step 4: Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test REST API
ab -n 1000 -c 10 http://localhost:3000/api/market-data/BTC

# Test WebSocket (use custom script)
node tests/websocket-load-test.js
```

---

## Production Deployment

### Option 1: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  cosmos-chain:
    image: rangisnet/cosmos-chain:latest
    ports:
      - "26656:26656"
      - "26657:26657"
    volumes:
      - cosmos-data:/data
    environment:
      - CHAIN_ID=rangisnet-1
  
  oracle-worker:
    image: rangisnet/oracle-worker:latest
    depends_on:
      - cosmos-chain
    environment:
      - COSMOS_RPC=http://cosmos-chain:26657
      - ORACLE_MNEMONIC=${ORACLE_MNEMONIC}
      - ORACLE_SYMBOLS=BTC,ETH,AVAX,SOL
  
  api-server:
    image: rangisnet/api-server:latest
    ports:
      - "3000:3000"
    depends_on:
      - cosmos-chain
    environment:
      - COSMOS_RPC=http://cosmos-chain:26657
      - NODE_ENV=production
  
  websocket-server:
    image: rangisnet/websocket-server:latest
    ports:
      - "8080:8080"
    environment:
      - WS_PORT=8080
      - WS_UPDATE_INTERVAL=5000
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  cosmos-data:
  redis-data:
```

Deploy:

```bash
docker-compose up -d
docker-compose logs -f
```

### Option 2: Kubernetes

Create Kubernetes manifests in `k8s/`:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rangisnet-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rangisnet-api
  template:
    metadata:
      labels:
        app: rangisnet-api
    spec:
      containers:
      - name: api
        image: rangisnet/api-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: COSMOS_RPC
          value: "http://cosmos-chain:26657"
```

Deploy:

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f rangisnet-api-xxx
```

### Option 3: Vercel (Next.js Only)

```bash
cd Web
vercel --prod
```

Note: You'll need to deploy Cosmos chain and oracle worker separately.

---

## Troubleshooting

### Common Issues

#### 1. Oracle Not Submitting Data

**Symptoms**: No new market data on-chain

**Solutions**:
- Check oracle account balance: `./rangisnet-chain query bank balances rangis1oracle...`
- Verify oracle is authorized: Check contract state
- Check logs: `pm2 logs rangisnet-oracle`
- Verify API keys are valid

#### 2. WebSocket Connection Failures

**Symptoms**: Clients can't connect to WebSocket

**Solutions**:
- Check firewall rules: Ensure port 8080 is open
- Verify server is running: `netstat -tulpn | grep 8080`
- Check CORS configuration
- Test with: `wscat -c ws://localhost:8080`

#### 3. LayerZero Messages Not Arriving

**Symptoms**: Cross-chain data not syncing

**Solutions**:
- Verify trusted remotes are configured correctly
- Check gas fees: LayerZero requires payment
- Confirm endpoint addresses are correct for your network
- Check LayerZero status: https://layerzeroscan.com/

#### 4. High API Latency

**Symptoms**: Slow response times

**Solutions**:
- Enable Redis caching
- Increase API server replicas
- Use CDN for static content
- Optimize database queries
- Consider rate limiting client requests

#### 5. Data Quality Issues

**Symptoms**: Incorrect prices or confidence scores

**Solutions**:
- Verify API keys for data sources
- Check for rate limiting from external APIs
- Review outlier detection logic
- Increase number of data sources
- Add manual price feeds as fallback

---

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl http://localhost:3000/api/health

# Cosmos chain status
curl http://localhost:26657/status

# WebSocket connection count
curl http://localhost:8080/metrics
```

### Log Aggregation

```bash
# View all logs
pm2 logs

# View specific service
pm2 logs rangisnet-api
pm2 logs rangisnet-oracle

# Export logs
pm2 logs --json > logs.json
```

### Backup Strategy

```bash
# Backup Cosmos chain state
./rangisnet-chain export > genesis-backup.json

# Backup oracle configuration
cp .env .env.backup

# Backup smart contract ABIs
cp contracts/*.json backups/
```

---

## Security Best Practices

1. **Never commit private keys or mnemonics** to version control
2. **Use hardware wallets** for production oracle accounts
3. **Enable multi-signature** for critical operations
4. **Rotate API keys** regularly
5. **Monitor for unusual activity** (abnormal transaction volumes, etc.)
6. **Keep dependencies updated** (`npm audit`, `go mod tidy`)
7. **Use HTTPS/WSS** in production
8. **Implement rate limiting** on all public endpoints
9. **Validate all input** from external sources
10. **Conduct regular security audits**

---

## Performance Benchmarks

Expected performance metrics:

| Metric | Target | Notes |
|--------|--------|-------|
| REST API p95 latency | < 500ms | Single symbol query |
| REST API throughput | > 1000 req/s | With caching |
| WebSocket latency | < 100ms | Update propagation |
| Oracle update frequency | 60s | Configurable |
| Data freshness | < 10s | Time since last update |
| Cross-chain message time | 30-120s | Depends on destination chain |

---

## Support & Resources

- **Documentation**: [MARKET_DATA_API_ARCHITECTURE.md](./MARKET_DATA_API_ARCHITECTURE.md)
- **GitHub**: https://github.com/Luckyspot0gold/RangisNet
- **Discord**: [Your Discord invite]
- **Email**: support@rangis.net

---

## License

This integration is part of the RangisNet Layer 1.5 platform and is subject to the project's license terms. The PRM engine implements patent-pending technology from Reality Protocol LLC.

---

*Last updated: December 07, 2025*
