# RangisNet Docker Deployment

## Quick Start

### Build and Run Locally

```bash
# From repository root
docker build -t rangisnet -f docker/Dockerfile .
docker run -p 8000:8000 rangisnet
```

### Using Docker Compose

```bash
# Start backend
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

## Configuration

The Docker setup includes:
- Node.js 22 runtime
- Python 3 for PTE engine calculations
- Port 8000 for backend API
- Health check endpoint

## Environment Variables

Create a `.env` file in the repository root:

```bash
# Avalanche Network
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CHAIN_ID=43113

# Contract Addresses
RANGIS_PAYMENT_ADDRESS=0x...
USDC_ADDRESS=0x5425890298aed601595a70AB815c96711a31Bc65

# Optional: API Keys
THE_TIE_API_KEY=
PYTH_API_KEY=
```

## Services

### PTE Engine Backend

The backend provides:
- Market data analysis endpoints
- PRM calculation API
- Sensory mapping services
- Health check at `/health`

## Development

For local development without Docker, see `/Web/QUICKSTART.md`

## Production Deployment

For production deployment:
1. Use multi-stage build for minimal image size
2. Configure environment variables via secrets
3. Deploy to Vercel (frontend) + Docker container (backend)
4. Use Avalanche Fuji testnet for MVP

## Troubleshooting

**Container won't start:**
```bash
docker logs <container-id>
```

**Port already in use:**
```bash
docker run -p 8001:8000 rangisnet  # Use different port
```

**Rebuild after changes:**
```bash
docker build --no-cache -t rangisnet -f docker/Dockerfile .
```
