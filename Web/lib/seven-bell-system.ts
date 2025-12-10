/**
 * 7-Bell Harmonic System for RangisHeartbeat
 */

export interface BellConfiguration {
  id: number;
  name: string;
  frequency: number;
  audioEffect: string;
  vocalRange: string;
  bassLevel: string;
  color: string;
  hexColor: string;
  emotionalState: string;
  marketCondition: string;
}

export const SEVEN_BELLS: BellConfiguration[] = [
  {
    id: 7, name: 'Harmony', frequency: 1266, audioEffect: 'Applause',
    vocalRange: 'High', bassLevel: 'Medium High Bass', color: 'White',
    hexColor: '#FFFFFF', emotionalState: 'Euphoria', marketCondition: 'Strong Bull Market (>20% gain)'
  },
  {
    id: 6, name: 'Power Chord', frequency: 888, audioEffect: 'Cheers',
    vocalRange: 'Tenor', bassLevel: 'Medium Low Bass', color: 'Bright Green',
    hexColor: '#00FF00', emotionalState: 'Confidence', marketCondition: 'Bull Market (10-20% gain)'
  },
  {
    id: 5, name: '5th', frequency: 646, audioEffect: 'Buzz',
    vocalRange: 'Alto', bassLevel: 'Low High Bass', color: 'Light Yellow',
    hexColor: '#FFFF99', emotionalState: 'Optimism', marketCondition: 'Moderate Gain (5-10%)'
  },
  {
    id: 4, name: 'Choir', frequency: 432, audioEffect: 'Humm',
    vocalRange: 'Whistle in note C', bassLevel: '0.5/0.5 Bass (Balanced)', color: 'Blue',
    hexColor: '#0000FF', emotionalState: 'Calm', marketCondition: 'Neutral/Stable (-5% to +5%)'
  },
  {
    id: 3, name: 'Alto', frequency: 215, audioEffect: 'Buzz',
    vocalRange: 'Heartbeat Base Pulse', bassLevel: 'Medium Bass', color: 'Light Orange',
    hexColor: '#FFB366', emotionalState: 'Caution', marketCondition: 'Slight Decline (-5% to -10%)'
  },
  {
    id: 2, name: 'Soprano', frequency: 1111.11, audioEffect: 'Screech',
    vocalRange: 'High Soprano', bassLevel: 'Medium Bass', color: 'Red',
    hexColor: '#FF0000', emotionalState: 'Fear', marketCondition: 'Bear Market (-10% to -20%)'
  },
  {
    id: 1, name: 'Fire-Alarm', frequency: 86, audioEffect: 'Shattering Glass',
    vocalRange: 'Sub-Bass', bassLevel: 'High Bass', color: 'Black',
    hexColor: '#000000', emotionalState: 'Panic', marketCondition: 'Crash (<-20%)'
  }
];

export function calculateActiveBell(
  priceChange24h: number, volatility: number, volume: number, sentiment: number = 0.5
): BellConfiguration {
  if (priceChange24h >= 20) return SEVEN_BELLS[0];
  if (priceChange24h >= 10) return SEVEN_BELLS[1];
  if (priceChange24h >= 5) return SEVEN_BELLS[2];
  if (priceChange24h >= -5) return SEVEN_BELLS[3];
  if (priceChange24h >= -10) return SEVEN_BELLS[4];
  if (priceChange24h >= -20) return SEVEN_BELLS[5];
  return SEVEN_BELLS[6];
}

export function calculateFearGreedIndex(
  priceChange: number, volatility: number, volume: number, momentum: number
): number {
  const priceScore = Math.min(100, Math.max(0, (priceChange + 20) * 2.5));
  const volatilityScore = Math.min(100, Math.max(0, 100 - (volatility * 100)));
  const volumeScore = Math.min(100, Math.max(0, volume * 100));
  const momentumScore = Math.min(100, Math.max(0, (momentum + 1) * 50));
  return priceScore * 0.35 + volatilityScore * 0.25 + volumeScore * 0.20 + momentumScore * 0.20;
}
