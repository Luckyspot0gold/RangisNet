# 🚀 X402-RS FACILITATOR FOR RANGISNET

## **Avalanche C-Chain Payment Gateway**

Production-grade Rust implementation of the x402 protocol for blockchain payments on Avalanche.

---

## 🎯 WHAT THIS DOES

The x402-rs facilitator enables **HTTP 402 Payment Required** responses with on-chain settlement on Avalanche C-Chain.

### **Payment Flow:**
1. **Client requests protected route** → Server responds `402 Payment Required` with payment details
2. **Client signs payment payload** → Submits cryptographically signed USDC payment
3. **Facilitator verifies signature** → Confirms payment matches requirements
4. **Facilitator settles on-chain** → Submits transaction to Avalanche C-Chain
5. **Server grants access** → Client receives protected content

**The facilitator never holds funds** - it only verifies and executes signed payment payloads.

---

## 🏗️ QUICK START

### **1. Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# REQUIRED: Avalanche Fuji testnet RPC
RPC_URL_AVALANCHE_FUJI=https://api.avax-test.network/ext/bc/C/rpc

# REQUIRED: Private key for signing transactions
EVM_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# OPTIONAL: Mainnet (add after testing on Fuji)
# RPC_URL_AVALANCHE=https://api.avax.network/ext/bc/C/rpc
```

### **2. Start facilitator:**
```bash
docker-compose up -d
```

### **3. Verify it's running:**
```bash
curl http://localhost:8080/health
```

**Expected response:** `{"status":"ok","networks":["avalanche-fuji"]}`

---

## 🔌 INTEGRATION WITH RANGISNET

### **Protected Routes:**
- `/rangi-detective` - AI agent dashboard (0.025 USDC per access)
- `/heartbeat` - Real-time market visualization (0.01 USDC per request)
- `/api/agent-scoring` - Truth detection API (0.05 USDC per call)
- `/api/m3-metrics/*` - M3 arsenal metrics (0.02 USDC per symbol)

### **Example: Protect Rust API with x402-axum:**
```rust
use x402_axum::{X402Middleware, Network, USDCDeployment};
use axum::{Router, routing::get};

#[tokio::main]
async fn main() {
    // Connect to your facilitator
    let x402 = X402Middleware::try_from("http://localhost:8080/")
        .unwrap();
    
    // Configure USDC payments on Avalanche Fuji
    let usdc = USDCDeployment::by_network(Network::AvalancheFuji);
    
    // Protect route with 0.025 USDC payment
    let app = Router::new()
        .route("/rangi-detective", 
            get(handler).layer(
                x402.with_price_tag(
                    usdc.amount("0.025")
                        .pay_to("0xYOUR_WALLET_ADDRESS")
                        .unwrap()
                )
            )
        );
    
    // Start server
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

### **Example: AI Agent Sends Payment (x402-reqwest):**
```rust
use x402_reqwest::X402ClientExt;
use alloy_signer_local::PrivateKeySigner;

let signer: PrivateKeySigner = 
    std::env::var("EVM_PRIVATE_KEY")?.parse()?;

let client = reqwest::Client::new()
    .with_payments(signer)
    .prefer(USDCDeployment::by_network(Network::AvalancheFuji))
    .max(USDCDeployment::by_network(Network::AvalancheFuji)
        .amount("1.00")?)
    .build();

// Polly agent sends payment automatically
let res = client
    .get("https://rangis.net/rangi-detective")
    .send()
    .await?;
```

---

## 🌐 NETWORKS SUPPORTED

| Network | RPC Environment Variable | Status |
|---------|--------------------------|--------|
| **Avalanche Fuji Testnet** | `RPC_URL_AVALANCHE_FUJI` | ✅ Active |
| **Avalanche C-Chain Mainnet** | `RPC_URL_AVALANCHE` | 🟡 Optional |

**Recommendation:** Start with Fuji testnet, switch to mainnet after testing.

---

## 📊 MONITORING (OpenTelemetry)

Enable production monitoring with Honeycomb/Grafana:

```bash
# Add to .env
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443
OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=YOUR_API_KEY,x-honeycomb-dataset=x402-rs
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

**Metrics tracked:**
- Payment verification latency
- Settlement transaction status
- HTTP request/response times
- Error rates and types

---

## 🧪 TESTING

### **Test payment flow on Fuji:**

```bash
# 1. Request protected content (should get 402)
curl -v http://localhost:3000/rangi-detective

# Expected: HTTP 402 Payment Required
# Body: { "price": "0.025", "token": "USDC", "network": "avalanche-fuji", "payTo": "0x..." }

# 2. Client signs payment (done automatically by x402-reqwest)

# 3. Submit payment payload
curl -X POST http://localhost:8080/verify \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "0x...",
    "amount": "0.025",
    "token": "USDC",
    "network": "avalanche-fuji",
    "nonce": "12345"
  }'

# Expected: HTTP 200 OK
# Body: { "verified": true, "txHash": "0x..." }

# 4. Access granted - content delivered
```

---

## 🚀 DEPLOYMENT

### **Local Development:**
```bash
docker-compose up
```

### **Production (Cloud):**
```bash
# Pull latest image
docker pull ukstv/x402-facilitator:latest

# Run with production env
docker run -d \
  --name rangis-x402-facilitator \
  --env-file .env.production \
  -p 8080:8080 \
  --restart unless-stopped \
  ukstv/x402-facilitator:latest
```

### **Kubernetes (Helm):**
```yaml
# values.yaml
replicaCount: 3
image:
  repository: ukstv/x402-facilitator
  tag: latest
env:
  - name: RPC_URL_AVALANCHE_FUJI
    value: "https://api.avax-test.network/ext/bc/C/rpc"
  - name: RPC_URL_AVALANCHE
    value: "https://api.avax.network/ext/bc/C/rpc"
  - name: EVM_PRIVATE_KEY
    valueFrom:
      secretKeyRef:
        name: x402-secrets
        key: private-key
```

---

## 🔐 SECURITY

### **Private Key Management:**
- ✅ **Use secrets manager** (AWS Secrets Manager, HashiCorp Vault)
- ✅ **Rotate keys regularly** (monthly recommended)
- ✅ **Separate keys per environment** (testnet ≠ mainnet)
- ❌ **NEVER commit private keys to git**

### **Network Security:**
- Run facilitator behind firewall (only internal services access)
- Use TLS/HTTPS for all RPC connections
- Rate-limit payment verification endpoints
- Monitor for unusual payment patterns

---

## 📚 RESOURCES

- **x402-rs GitHub:** https://github.com/x402-rs/x402-rs
- **x402 Protocol Docs:** https://docs.x402.org
- **Avalanche RPC Docs:** https://docs.avax.network/apis/avalanchego/apis/c-chain
- **USDC on Avalanche:** https://www.circle.com/en/usdc/multichain/avalanche

---

## 🎯 RANGISNET USE CASES

1. **AI Agent Monetization:**
   - Polly agent charges 0.05 USDC per negotiation
   - Rangi detective charges 0.025 USDC per truth detection
   - M3 arsenal charges 0.02 USDC per metric request

2. **API-as-a-Service:**
   - `/api/agent-scoring` - Pay-per-call verification
   - `/api/m3-metrics` - Pay-per-symbol market data
   - Real-time heartbeat visualization (0.01 USDC/min)

3. **Micropayment Content:**
   - Premium market insights (0.10 USDC per article)
   - Historical data access (0.05 USDC per query)
   - Advanced Spinor visualizations (0.15 USDC per session)

---

## 🏆 AVALANCHE HACK2BUILD INTEGRATION

**X402 payment gateway is NOW LIVE:**
- ✅ Facilitator running on Docker
- ✅ Avalanche Fuji testnet supported
- ✅ USDC micropayments enabled
- ✅ AI agents can pay autonomously
- ✅ HTTP 402 protocol implemented
- ✅ OpenTelemetry monitoring ready

**Demo for judges:**
1. Show Rangi detective dashboard (402 response)
2. AI agent sends 0.025 USDC payment
3. Facilitator verifies and settles on-chain
4. Dashboard grants access
5. Display transaction hash on Fuji explorer

**This is production-grade x402 on Avalanche.** 🚀

---

## 💎 NEXT STEPS

1. **Generate testnet private key:**
   ```bash
   npx @avalabs/core-wallet-sdk generate
   ```

2. **Get Fuji testnet AVAX + USDC:**
   - Faucet: https://faucet.avax.network
   - USDC: https://testnet.snowtrace.io/token/0x5425890298aed601595a70AB815c96711a31Bc65

3. **Update `.env` with your keys**

4. **Start facilitator:**
   ```bash
   docker-compose up -d
   ```

5. **Test payment flow** (see Testing section above)

6. **Deploy to production:**
   ```bash
   ./deploy-x402-production.sh
   ```

---

**Built for Avalanche Hack2Build x402 Track**  
**December 9, 2025**  
**"Rangi's Here To Stay"** 🔥

---

*© 2025 Reality Protocol LLC. All Rights Reserved.*
