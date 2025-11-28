# RangisNet Architecture Overview
_The Harmonic Execution Layer for Multi-Sensory Markets_

RangisNet is a blockchain-adjacent execution layer that translates raw
asset and network data into **harmonic signals**. These signals are then
used to:

- Improve human understanding of markets (multi-sensory UX)
- Optimize transaction timing (fewer reverts, less gas waste)
- Reduce latency and network congestion (smarter scheduling)
- Protect users from lost assets due to poor conditions or bad timing

At a high level, RangisNet is composed of the following layers:

1. **Data Ingestion Layer**  
   Collects on-chain and off-chain data about assets, transactions, and
   network health.

2. **Harmonic Engine (Harmonic Execution Layer)**  
   Transforms numeric state into **Harmonic Fingerprints** and **Sonic
   Event Codes (SEC)**.

3. **Encoding & Transport Layer**  
   Encodes harmonic data into compact, chain-agnostic formats such as
   **Harmonic Envelope Format (HEF)** and broadcasts them to clients,
   wallets, dApps, and other chains.

4. **Optimization & Protection Layer**  
   Uses harmonics to:
   - Predict congestion and gas spikes
   - Guide users and bots toward optimal transaction windows
   - Avoid failure modes that cause lost gas or stuck assets

5. **Experience Layer (Rangi’s Heartbeat)**  
   Converts harmonic data into:
   - Audio (soundscapes, alerts)
   - Haptics (vibrations, patterns)
   - Visuals (colors, waves, motion)
   Making markets understandable to any human, not just chart readers.

---

## Layer 1: Data Ingestion

**Inputs:**

- Asset prices and trades
- Order book depth and liquidity
- Volatility measures (e.g., rolling σ, RSI, MACD)
- Gas prices, mempool size, block fill ratio
- Validator and node health metrics
- Cross-chain bridge status (where applicable)

**Sources:**

- Native chain RPC / indexers
- Oracles
- Off-chain data streams
- Internal RangisNet analyzers

The Data Ingestion Layer normalizes these inputs into a common schema:

```text
AssetState {
  asset_id
  price
  volume
  volatility
  liquidity
  open_interest
  funding_rate
  timestamp
}

NetworkState {
  chain_id
  gas_price
  mempool_load
  block_fill
  avg_block_time
  validator_health_score
  timestamp
}
