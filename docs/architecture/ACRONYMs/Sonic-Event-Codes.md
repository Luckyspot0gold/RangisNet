# Sonic Event Codes (SEC)
_The Sound Language of RangisNet_

Sonic Event Codes (SEC) are compact, symbolic messages that encode
meaningful changes in asset state, market state, or network health.

SEC serves three purposes:
1. To notify humans through sound or vibration.
2. To notify bots and agents with ultra-low-latency packets.
3. To compress complex state transitions into < 128 bytes.

---

## 1. What Is an SEC?

An SEC is a small packet:
Where:
- **event_id** = category of change  
- **fingerprint_ref** = pointer or hash to the Harmonic Fingerprint  
- **severity_level** = 0–5  
- **timestamp** = ms resolution  

Example categories:
- `SEC.VOLATILITY_SPIKE`
- `SEC.CONGESTION_RISING`
- `SEC.LIQUIDITY_DRAIN`
- `SEC.FINALIZATION_CONFIRMED`
- `SEC.BRIDGE_UNSTABLE`

---

## 2. SEC Sound Codes

Every SEC corresponds to a unique sonic signature:

| Category | Sound Example | Meaning |
|---------|---------------|---------|
| Congestion Rising | Low rumble | Delay recommended |
| Opportunity Spike | Crisp upward ping | Possible favorable window |
| Warning | Distortion + rising tempo | High risk |
| Confirmation | Clear bell tone | Tx confirmed |

---

## 3. Why SEC Matter

They provide:
- real-time intuition  
- gas-saving timing guidance  
- protection from risky conditions  
- data feeds for AI agents  

SEC are the **heartbeat signals** of the network.

---

## 4. SEC Minimal Encoding Standard
Typical size: **40–80 bytes**

---

## 5. Use Cases

- Wallet alerting  
- Bot throttling  
- UX animation triggers  
- Rangi Sensory API (sound/haptics)  
- Cross-chain HEF wrapping  

SEC are the smallest unit of expressive intelligence in the system.
