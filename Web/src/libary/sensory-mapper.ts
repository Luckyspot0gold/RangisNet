import { Mapper } from '@rangisnet/sensory-mapper';

const prm = PTE.computePRM(marketData);
const sensory = Mapper.mapSensory(prm);

// Display to user
showRecommendation(sensory.recommendation);
playTone(sensory.harmonic);
vibrate(sensory.haptic);
