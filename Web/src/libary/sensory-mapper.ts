import { Mapper } from '@rangisnet/sensory-mapper';

const prm = PTE.computePRM(marketData);
const sensory = Mapper.mapSensory(prm);

// Display to user
showRecommendation(sensory.recommendation);
playTone(sensory.harmonic);
vibrate(sensory.haptic);
// src/sensory-mapper.ts
if (probability >= 0.7) {
  return {
    harmonic: this.mapToRange(resonanceFreq, 1000, 1432),
    haptic: 'Pulse (strong, confident)',
    phonic: 'Sine (calm, smooth)',
    recommendation: 'SEND',
    // ...
  };
}
import { PTE } from './pte-engine'; // Link to Path 1

export class SensoryMapper {
  mapToAudio(prm: {probability: number; resonanceFreq: number;}): {freq: number; duration: number;} {
    // Sonification: Market calm (low VIX) = soothing 432Hz; volatility = rising tones
    const baseFreq = 432 + (1 - prm.probability) * 200; // Scale to 432-632Hz
    return { freq: prm.resonanceFreq || baseFreq, duration: 500 }; // ms pulse
  }

  mapToHaptic(prm: {probability: number;}): {intensity: number; pattern: 'buzz' | 'pulse';} {
    // Haptics: Success = gentle pulse; failure = intense buzz (<50ms latency)
    const intensity = prm.probability * 100;
    return { intensity, pattern: intensity > 0.7 ? 'pulse' : 'buzz' };
  }

  mapToVisual(prm: {resonanceFreq: number;}): {color: string; wave: string;} {
    // Cymatics: Freq to color/wave (e.g., high freq = blue sine waves)
    const hue = (prm.resonanceFreq % 360);
    return { color: `hsl(${hue}, 70%, 50%)`, wave: 'sine' }; // For WebGL render
  }
}

// Global mapper instance
export const Mapper = new SensoryMapper();
