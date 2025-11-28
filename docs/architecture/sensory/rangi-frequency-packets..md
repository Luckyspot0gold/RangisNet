# Rangi Frequency Packets (RFP)
_Compact Sonic Payloads for Audio & Haptic Engines_

Rangi Frequency Packets (RFP) are minimal audio/haptic payloads derived
directly from harmonic vectors. These packets allow ultra-fast playback
of tones, pulses, or effects without recomputation.

RFP’s goal is speed.

---

## 1. RFP Structure
RFP { freq amp timbre_code rhythm_pattern duration_ms }
---

## 2. Why RFP Exists

HEF is too large to feed audio engines directly.  
SEC is too event-focused.

RFP is the perfect middle layer:
- compact  
- fast  
- real-time  

Used for:
- tonal cues  
- haptic stings  
- environmental soundscapes  

---

## 3. Conversion Rules
freq = harmonic_vector.base_freq amp = harmonic_vector.amplitude timbre = harmonic_vector.timbre_code rhythm = harmonic_vector.rhythm_pattern
---

## 4. Playback Modes

- **Pulse Mode** → short alerts  
- **Wave Mode** → continuous tone  
- **Pattern Mode** → repeating rhythm  
- **Burst Mode** → volatility or danger  

---

## 5. Integrations

RFP packets integrate with:
- WebAudio  
- iOS Core Haptics  
- Android Vibration API  
- Unity audio/haptics  
- VR controllers  

---

## 6. Why RFP Matters

RFP gives you:
- sub-10ms response times  
- crisp feedback  
- fast sensory alerts  

RFP is the **sonic payload layer** of RangisNet.
