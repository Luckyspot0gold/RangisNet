# Consensus Harmonic Signals (CHS)
_The Rhythmic Language Validators Use to Maintain Network Harmony_

Consensus Harmonic Signals (CHS) are periodic, low-bandwidth heartbeat
messages exchanged between validators and nodes. They encode the “health”
of each validator in harmonic form.

CHS are NOT part of the base consensus algorithm — they are an
optimization layer that reduces:
- validator desync,
- orphaned blocks,
- congestion,
- unnecessary gas spikes, and
- instability during volatile periods.

---

## 1. Purpose of CHS

CHS allows nodes to:
- detect drift early,
- anticipate instability,
- coordinate gossip timing,
- smooth the load across validators.

This results in:
- lower latency,
- fewer wasted tx retries,
- more efficient block production.

---

## 2. CHS Structure
