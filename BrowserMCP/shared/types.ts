export interface MarketCondition {
  rsi: number;           // Relative Strength Index (0-100)
  vix: number;           // Volatility Index
  sentiment: number;     // Market sentiment (-1 to 1)
  volume_delta: number;  // Volume change ratio
}

export interface PRMResult {
  probability: number;      // Transaction success probability (0-1)
  resonanceFreq: number;    // Harmonic frequency in Hz (432-1432)
  tensorFusion?: number;    // Tensor product result
  sentimentDelta?: number;  // Sentiment-weighted volume
  omega?: number;           // Raw resonance value
}

export interface TransactionData {
  from: string;
  to: string;
  value: number;
  gasLimit?: number;
  data?: string;
}

export type RecommendationAction = 'SEND' | 'WAIT' | 'REJECT';

export interface TransactionRecommendation {
  action: RecommendationAction;
  reason: string;
  probability: number;
  resonanceFreq: number;
}
