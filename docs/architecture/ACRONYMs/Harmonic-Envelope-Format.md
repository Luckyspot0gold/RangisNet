# Harmonic Envelope Format (HEF)
_A Chain-Agnostic Standard for Harmonic Intelligence_

The Harmonic Envelope Format (HEF) is the primary transport format for
harmonic data. It carries both asset state and harmonic fingerprints in a
unified, small, efficient structure.

HEF packets can be:
- written on-chain,
- sent off-chain,
- bridged cross-chain,
- played as audio,
- interpreted by bots.

---

## 1. HEF Structure
Typical size: **96–240 bytes**

---

## 2. State Vector Definition

StateVector can contain:
- price
- volatility
- liquidity
- order flow
- funding rate
- mempool load
- block fill
- validator health

This is the **raw math**.

---

## 3. Harmonic Vector Definition

HarmonicVector contains:

| Param | Meaning |
|-------|---------|
| base_freq | equilibrium or drift |
| detune_ratio | deviation from ideal |
| amplitude | risk or urgency |
| timbre_code | quality of state |
| rhythm_pattern | clustering effects |

This is the **human meaning**.

---

## 4. Why HEF Matters

HEF compresses:
- multiple indicators  
- multiple risk signatures  
- network stress  
into *one multi-sensory packet*.

It allows:
- wallets to buzz  
- dashboards to ripple  
- bots to throttle  
- music engines to generate tones  
- VR/AR transitions  

HEF is the **universal language of harmonic markets**.

---

## 5. HEF Validation Rules

1. checksum must validate  
2. timestamp must not exceed drift window  
3. amplitude ∈ [0, 1]  
4. base_freq ∈ [380 Hz, 480 Hz]  
5. timbre_code ∈ integer buckets [0–12]  

---

## 6. HEF Transport Methods

- WebSockets  
- gRPC  
- custom HDL streams (Harmonic Data Link)  
- on-chain logs  
- L2 calldata  
- sidecar files  

HEF is the package that moves harmonics through the network.
