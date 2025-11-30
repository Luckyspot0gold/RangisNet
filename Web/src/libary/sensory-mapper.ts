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
