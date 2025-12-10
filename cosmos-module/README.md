# RangisNet Cosmos SDK Module

This directory contains the Cosmos SDK `x/marketdata` module and oracle worker for RangisNet's on-chain market data indexing.

## Directory Structure

```
cosmos-module/
├── proto/marketdata/v1/     # Protobuf definitions
│   ├── marketdata.proto     # Data structures
│   ├── query.proto          # Query service
│   └── tx.proto             # Transaction messages
├── oracle-worker.ts         # Oracle worker implementation
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `COSMOS_RPC`: RPC endpoint of your Cosmos chain
- `COSMOS_CHAIN_ID`: Chain ID (e.g., rangisnet-1)
- `ORACLE_MNEMONIC`: Oracle account mnemonic (keep secure!)
- `ORACLE_SYMBOLS`: Comma-separated list of symbols to track
- `UPDATE_INTERVAL_MS`: Update frequency in milliseconds

### 3. Create Oracle Account

```bash
# Generate new account
./rangisnet-chain keys add oracle

# Fund the account
./rangisnet-chain tx bank send faucet <oracle-address> 1000000urangis --yes
```

## Running the Oracle

### Development

```bash
npm run dev
```

### Production

```bash
npm start
# or use PM2
pm2 start oracle-worker.ts --name rangisnet-oracle
```

## Protobuf Compilation

If you need to regenerate protobuf code:

```bash
# Install buf
go install github.com/bufbuild/buf/cmd/buf@latest

# Generate code
buf generate
```

## Architecture

The oracle worker:
1. Fetches market data from the API aggregator
2. Performs PRM analysis
3. Submits both to the Cosmos chain
4. Repeats at configured interval

```
Oracle Worker Loop:
├── Fetch market data (api-aggregator.ts)
├── Analyze with PRM (prm-engine.ts)
├── Submit to blockchain
└── Sleep until next cycle
```

## Messages

### MsgSubmitMarketData

Submits aggregated market data to the chain.

### MsgSubmitPRMAnalysis

Submits PRM analysis results to the chain.

## Queries

### GetMarketData

Query market data for a specific symbol.

```bash
curl http://localhost:26657/rangisnet/marketdata/v1/market_data/BTC
```

### GetPRMAnalysis

Query PRM analysis for a specific symbol.

```bash
curl http://localhost:26657/rangisnet/marketdata/v1/prm_analysis/BTC
```

## Monitoring

```bash
# View logs with PM2
pm2 logs rangisnet-oracle

# Check oracle balance
./rangisnet-chain query bank balances <oracle-address>

# View recent transactions
./rangisnet-chain query tx <tx-hash>
```

## Troubleshooting

**Issue**: Oracle not submitting transactions
- Check oracle account balance
- Verify oracle is authorized on-chain
- Check network connectivity to RPC endpoint

**Issue**: High gas fees
- Adjust gas price in oracle-worker.ts
- Increase update interval to reduce transaction frequency

**Issue**: Data quality problems
- Verify API keys are set correctly
- Check external API rate limits
- Review outlier detection settings in api-aggregator.ts

## Security

- **Never commit** `.env` file or mnemonic to version control
- Use hardware wallet for production oracle accounts
- Enable multi-signature for critical operations
- Regularly rotate API keys
- Monitor for unusual transaction patterns

## License

Part of RangisNet Layer 1.5 platform
