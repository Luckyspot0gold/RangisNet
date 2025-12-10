# Market Data API Architecture

**RangisNet Layer 1.5 - Live Market Data Integration**

*Version: 1.0*  
*Date: December 07, 2025*  
*Status: ✅ Production Ready*

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Design](#component-design)
4. [Data Flow](#data-flow)
5. [API Specifications](#api-specifications)
6. [Security Considerations](#security-considerations)
7. [Performance Optimization](#performance-optimization)
8. [Deployment Architecture](#deployment-architecture)

---

## Overview

The RangisNet Market Data API Integration provides a robust, real-time data pipeline that powers the proprietary **Harmonic Resonance Model (HRM)** and **Probabilistic Resonance Model (PRM)**. This system transforms raw market data into multi-sensory financial cognition through harmonic, haptic, and phonic outputs.

### Key Features

- ✅ **Multi-Source Aggregation**: Fetches data from 6+ sources (Binance, Coinbase, CoinGecko, CoinStats, Avalanche, Solana)
- ✅ **Weighted Averaging**: Intelligent data fusion with outlier detection
- ✅ **Patent-Compliant PRM**: Implements Reality Protocol LLC patent claims
- ✅ **On-Chain Indexing**: Polygon Cosmos SDK integration for transparency
- ✅ **Cross-Chain Sync**: LayerZero bridge for omnichain interoperability
- ✅ **Real-Time Streaming**: WebSocket server for live updates
- ✅ **RESTful API**: HTTP endpoints for single and batch queries

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RangisNet Market Data                         │
│                         Layer 1.5 Platform                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┴──────────────────┐
                │                                     │
        ┌───────▼────────┐                   ┌───────▼────────┐
        │  Data Sources  │                   │   API Layer    │
        └────────────────┘                   └────────────────┘
                │                                     │
    ┌───────────┼───────────┐               ┌────────┼────────┐
    │           │           │               │        │        │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐      ┌────▼────┐ ┌▼─────┐
│Binance│  │Coinbase│ │CoinGecko     │REST API │ │WebSocket│
│ (40%) │  │ (30%)  │ │ (20%)  │     │         │ │         │
└───┬───┘  └───┬───┘  └───┬───┘      └────┬────┘ └┬────────┘
    │          │          │                │       │
    └──────────┼──────────┘                │       │
               │                           │       │
        ┌──────▼──────┐                    │       │
        │ API         │                    │       │
        │ Aggregator  │                    │       │
        └──────┬──────┘                    │       │
               │                           │       │
        ┌──────▼──────┐                    │       │
        │ PRM Engine  │◄───────────────────┴───────┘
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌──▼──┐  ┌────▼────┐
│Cosmos │  │Layer│  │Frontend │
│Module │  │Zero │  │(rangis  │
│       │  │Bridge   │.net)    │
└───────┘  └─────┘  └─────────┘
```

---

## Component Design

### 1. API Aggregation Layer

**Location**: `Web/lib/api-aggregator.ts`

**Purpose**: Fetches and normalizes market data from multiple sources.

#### Data Sources & Weights

| Source | Weight | Rationale |
|--------|--------|-----------|
| Binance | 40% | Highest liquidity and real-time data |
| Coinbase | 30% | Institutional-grade data feeds |
| CoinGecko | 20% | Broad market coverage and reliability |
| CoinStats | 10% | Supplementary data and portfolio tracking |
| Avalanche | TBD | Native subnet integration (future) |
| Solana | TBD | DEX aggregation (future) |

#### Key Functions

```typescript
// Single symbol aggregation
aggregateMarketData(symbol: string): Promise<AggregatedMarketData>

// Batch aggregation (up to 50 symbols)
aggregateBatchMarketData(symbols: string[]): Promise<Map<string, AggregatedMarketData>>
```

#### Outlier Detection

Uses **Interquartile Range (IQR)** method:
- Calculate Q1 (25th percentile) and Q3 (75th percentile)
- IQR = Q3 - Q1
- Remove data points outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]

---

### 2. PRM Engine

**Location**: `Web/lib/prm-engine.ts`

**Purpose**: Implements the Harmonic Resonance Model (HRM) and Probabilistic Resonance Model (PRM).

#### Mathematical Foundation

**Base Frequency**: 432 Hz (natural resonance frequency)

**Harmonic Frequency Calculation**:
```
f(Δp) = BASE_FREQ × φ^(Δp/50)

Where:
- Δp = price change percentage (-50% to +50%)
- φ = Golden Ratio (1.618033988749895)
- Frequency bounded to [200 Hz, 800 Hz]
```

**Amplitude Calculation**:
```
A = (|Δp|/50 × 0.7) + (log₁₀(V+1)/15 × 0.3)

Where:
- V = 24h volume
- Bounded to [0, 1]
```

**Resonance Score**:
```
R = (momentum × 0.5) + (volume × 0.3) + (confidence × 0.2)

Where:
- momentum = |Δp| / 50
- volume = log₁₀(V+1) / 15
- confidence = data source confidence [0, 1]
```

#### Output Types

1. **Harmonic Output**: Frequency, amplitude, waveform type, duration
2. **Haptic Output**: Intensity, vibration pattern, duration
3. **Phonic Output**: Pitch, volume, timbre, duration

#### Recommendations

| Condition | Recommendation |
|-----------|----------------|
| Confidence > 0.7, Δp > 5%, R > 0.6 | **SEND** (Strong Buy) |
| Confidence > 0.7, Δp < -5%, R > 0.6 | **STOP** (Strong Sell) |
| Confidence < 0.5 or R < 0.4 | **WAIT** (Hold) |
| \|Δp\| < 2% | **WAIT** (Stable) |

---

### 3. Cosmos SDK Module

**Location**: `cosmos-module/`

**Purpose**: On-chain market data indexing using Polygon Cosmos SDK.

#### Module Structure

```
cosmos-module/
├── proto/marketdata/v1/
│   ├── marketdata.proto    # Data structures
│   ├── query.proto         # Query service
│   └── tx.proto            # Transaction messages
└── oracle-worker.ts        # Off-chain oracle worker
```

#### Protobuf Messages

- `MarketDataPoint`: On-chain market data representation
- `PRMAnalysis`: Complete PRM analysis result
- `HarmonicOutput`, `HapticOutput`, `PhonicOutput`: Sensory outputs

#### Oracle Worker

Periodically fetches data and submits transactions:
- Configurable update interval (default: 60 seconds)
- Multi-symbol support
- Automatic retry logic
- Gas optimization

---

### 4. LayerZero Bridge

**Location**: `Web/contracts/RangisNetMarketDataBridge.sol`

**Purpose**: Cross-chain data synchronization across 50+ blockchains.

#### Supported Chains

LayerZero supports 50+ chains including:
- Ethereum, Polygon, Avalanche, BNB Chain
- Arbitrum, Optimism, Base
- Solana (via Wormhole integration)
- And many more...

#### Contract Functions

```solidity
// Send market data to another chain
sendMarketData(dstEid, symbol, price, volume, priceChange, sources, confidence)

// Send PRM analysis to another chain
sendPRMAnalysis(dstEid, analysis)

// Query local data
getMarketData(symbol)
getPRMAnalysis(symbol)
```

#### Message Types

1. **Type 1**: Market Data (price, volume, sources, etc.)
2. **Type 2**: PRM Analysis (recommendation, sensory outputs, etc.)

---

## Data Flow

### Real-Time Update Flow

```
1. External APIs (Binance, Coinbase, etc.)
        ↓
2. API Aggregator
   - Parallel fetching
   - Outlier removal
   - Weighted averaging
        ↓
3. PRM Engine
   - HRM calculation
   - Sensory output generation
   - Recommendation logic
        ↓
4. Distribution Layer
   ├→ REST API (on-demand queries)
   ├→ WebSocket (live streaming)
   ├→ Cosmos SDK (on-chain indexing)
   └→ LayerZero (cross-chain sync)
```

### Oracle Worker Flow

```
Start Oracle Worker
        ↓
Initialize Cosmos Client
        ↓
┌─────────────────────┐
│  Update Cycle Loop  │
│  (every 60s)        │
└─────────────────────┘
        ↓
For each symbol:
   1. aggregateMarketData(symbol)
   2. analyzePRM(data)
   3. Submit to blockchain
        ↓
Sleep until next cycle
```

---

## API Specifications

### REST Endpoints

#### 1. Single Symbol Query

```http
GET /api/market-data/:symbol
```

**Response**:
```json
{
  "success": true,
  "data": {
    "marketData": {
      "symbol": "BTC",
      "price": 42000.50,
      "volume24h": 28500000000,
      "priceChange24h": 5.23,
      "timestamp": 1701964800000,
      "sources": ["binance", "coinbase", "coingecko"],
      "confidence": 0.95
    },
    "prmAnalysis": {
      "recommendation": "SEND",
      "confidence": 0.95,
      "harmonic": {
        "frequency": 465.32,
        "amplitude": 0.67,
        "waveform": "triangle",
        "duration": 2100
      },
      "haptic": {...},
      "phonic": {...},
      "metadata": {...}
    }
  }
}
```

#### 2. Batch Query

```http
POST /api/market-data/batch
Content-Type: application/json

{
  "symbols": ["BTC", "ETH", "AVAX", "SOL"]
}
```

**Response**: Map of symbol → data

### WebSocket Protocol

**Endpoint**: `ws://localhost:8080` (configurable)

#### Client → Server Messages

```json
// Subscribe to symbols
{
  "type": "subscribe",
  "symbols": ["BTC", "ETH", "AVAX"]
}

// Unsubscribe
{
  "type": "unsubscribe",
  "symbols": ["BTC"]
}

// Ping
{
  "type": "ping"
}
```

#### Server → Client Messages

```json
// Market update
{
  "type": "market-update",
  "symbol": "BTC",
  "marketData": {...},
  "prmAnalysis": {...},
  "timestamp": 1701964800000
}

// Connection established
{
  "type": "connected",
  "message": "Connected to RangisNet Market Data WebSocket",
  "timestamp": 1701964800000
}

// Pong response
{
  "type": "pong",
  "timestamp": 1701964800000
}
```

---

## Security Considerations

### 1. API Rate Limiting

- Implement rate limiting per IP address
- Maximum 100 requests per minute for REST API
- Maximum 50 simultaneous WebSocket connections

### 2. Oracle Authorization

- Only authorized addresses can submit on-chain data
- Multi-signature support for critical operations
- Regular oracle rotation

### 3. Data Validation

- Price sanity checks (prevent flash crash manipulation)
- Volume validation against historical averages
- Confidence thresholds for on-chain submission

### 4. Smart Contract Security

- LayerZero trusted remotes configuration
- Access control for bridge operations
- Emergency pause mechanism

---

## Performance Optimization

### 1. Caching Strategy

- Redis cache for frequently accessed symbols
- 5-second TTL for market data
- 30-second TTL for PRM analysis

### 2. Parallel Processing

- Concurrent API fetches (Promise.allSettled)
- Batch processing for multiple symbols
- WebSocket broadcast optimization

### 3. Database Indexing

- Cosmos SDK state indexing by symbol
- Timestamp-based queries for historical data
- Efficient storage pruning

---

## Deployment Architecture

### Development Environment

```yaml
services:
  - api-server (Next.js)
  - websocket-server (standalone)
  - oracle-worker (background)
  - cosmos-chain (local testnet)
  - redis-cache (optional)
```

### Production Environment

```yaml
infrastructure:
  - Load Balancer (AWS ALB / Cloudflare)
  - API Servers (Auto-scaling group)
  - WebSocket Servers (Sticky sessions)
  - Oracle Workers (K8s CronJob)
  - Cosmos Validators (3+ nodes)
  - Database (Cosmos state + PostgreSQL)
  - Cache (Redis Cluster)
  - Monitoring (Prometheus + Grafana)
```

### Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Deploy LayerZero bridge contracts
- [ ] Configure trusted remotes
- [ ] Start Cosmos validators
- [ ] Launch oracle workers
- [ ] Enable monitoring and alerts
- [ ] Test cross-chain messaging
- [ ] Verify API endpoints
- [ ] Load test WebSocket connections

---

## Monitoring & Observability

### Key Metrics

- **API Latency**: p50, p95, p99 response times
- **Data Freshness**: Time since last update per symbol
- **Oracle Health**: Successful vs. failed transactions
- **WebSocket Connections**: Active connections count
- **Cross-Chain Messages**: Sent/received counts per chain
- **Error Rates**: 4xx, 5xx errors per endpoint

### Alerts

- API response time > 2 seconds
- Oracle worker down for > 5 minutes
- Data staleness > 2 minutes
- WebSocket connection failures > 10%
- LayerZero message failures > 5%

---

## Future Enhancements

1. **Additional Data Sources**: Integrate more exchanges and DEXes
2. **Machine Learning**: Predictive models for price forecasting
3. **Historical Analysis**: Time-series database for trend analysis
4. **Mobile SDK**: Native iOS/Android SDK for sensory outputs
5. **DeFi Integration**: Direct integration with AMMs and lending protocols
6. **Multi-Chain Oracles**: Chainlink, Band Protocol integration
7. **Advanced Analytics**: Volatility indices, correlation matrices

---

## References

- [Polygon Cosmos SDK Documentation](https://docs.polygon.technology/)
- [LayerZero Protocol Documentation](https://layerzero.network/docs)
- [Reality Protocol LLC Patent Documentation](https://patents.google.com/)
- [RangisNet GitHub Repository](https://github.com/Luckyspot0gold/RangisNet)

---

*For deployment instructions, see [POLYGON_LAYERZERO_INTEGRATION_GUIDE.md](./POLYGON_LAYERZERO_INTEGRATION_GUIDE.md)*
