import { MarketCondition, PRMResult, TransactionData, TransactionRecommendation, RecommendationAction } from './types';

export class ProbabilityTensorEngine {
  private resonanceThreshold = 0.3; // PRM cutoff
  private readonly MIN_FREQUENCY = 432; // Base harmonic frequency (Hz)
  private readonly MAX_FREQUENCY = 1432; // Maximum frequency range

  /**
   * Compute Probability Resonance Metric (PRM)
   */
  computePRM(data: MarketCondition): PRMResult {
    this.validateMarketCondition(data);

    // Simplified fusion logic:
    // tensorElement = RSI * VIX (diagonal 2x2 tensor with same value)
    const tensorElement = data.rsi * data.vix;
    // Sum of diagonal elements of 2x2 matrix [[t,0],[0,t]] = 2*t
    const tensorFusion = tensorElement * 2;

    // Sentiment-weighted volume delta
    const sentimentDelta = data.sentiment * data.volume_delta;

    // Resonance (omega)
    const omega = tensorFusion + sentimentDelta;

    // Sigmoid activation for probability (scaled for stability)
    const rawProbability = 1 / (1 + Math.exp(-omega / 5000));

    // Apply threshold filter
    const probability = rawProbability > this.resonanceThreshold ? rawProbability : 0;

    // Map to audible/haptic frequency range
    const resonanceFreq = this.mapToFrequencyRange(omega);

    return {
      probability,
      resonanceFreq,
      tensorFusion,
      sentimentDelta,
      omega
    };
  }

  /**
   * Batch PRM compute
   */
  computePRMBatch(dataArray: MarketCondition[]): PRMResult[] {
    const results: PRMResult[] = new Array(dataArray.length);
    for (let i = 0; i < dataArray.length; i++) {
      results[i] = this.computePRM(dataArray[i]);
    }
    return results;
  }

  /**
   * Validate transaction based on market conditions
   */
  validateTx(_txData: TransactionData, marketData: MarketCondition): boolean {
    const prm = this.computePRM(marketData);
    return prm.probability >= this.resonanceThreshold;
  }

  /**
   * Batch validation for multiple transactions with same market conditions
   */
  validateTxBatch(txs: TransactionData[], marketData: MarketCondition): boolean[] {
    const prm = this.computePRM(marketData);
    const isValid = prm.probability >= this.resonanceThreshold;
    return new Array(txs.length).fill(isValid);
  }

  /**
   * Get transaction recommendation with reasoning
   */
  getRecommendation(marketData: MarketCondition): TransactionRecommendation {
    const prm = this.computePRM(marketData);

    let action: RecommendationAction;
    let reason: string;

    if (prm.probability >= 0.7) {
      action = 'SEND';
      reason = `High confidence (${(prm.probability * 100).toFixed(1)}%). Market conditions favorable with strong resonance at ${prm.resonanceFreq.toFixed(0)}Hz.`;
    } else if (prm.probability >= this.resonanceThreshold) {
      action = 'WAIT';
      reason = `Moderate confidence (${(prm.probability * 100).toFixed(1)}%). Consider waiting for better market alignment.`;
    } else {
      action = 'REJECT';
      reason = `Low confidence (${(prm.probability * 100).toFixed(1)}%). Market conditions unfavorable - high risk of transaction failure.`;
    }

    return {
      action,
      reason,
      probability: prm.probability,
      resonanceFreq: prm.resonanceFreq
    };
  }

  /**
   * Set/Get threshold
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Threshold must be between 0 and 1');
    }
    this.resonanceThreshold = threshold;
  }

  getThreshold(): number {
    return this.resonanceThreshold;
  }

  /**
   * Map omega value to audible/haptic frequency range (432-1432 Hz)
   */
  private mapToFrequencyRange(omega: number): number {
    const absOmega = Math.abs(omega);
    const span = this.MAX_FREQUENCY - this.MIN_FREQUENCY;
    // Normalize and clamp into range
    const normalized = (absOmega % span);
    return this.MIN_FREQUENCY + normalized;
  }

  /**
   * Validate market condition input
   */
  private validateMarketCondition(data: MarketCondition): void {
    if (typeof data.rsi !== 'number' || data.rsi < 0 || data.rsi > 100) {
      throw new Error('RSI must be a number between 0 and 100');
    }
    if (typeof data.vix !== 'number' || data.vix < 0) {
      throw new Error('VIX must be a non-negative number');
    }
    if (typeof data.sentiment !== 'number' || data.sentiment < -1 || data.sentiment > 1) {
      throw new Error('Sentiment must be a number between -1 and 1');
    }
    if (typeof data.volume_delta !== 'number') {
      throw new Error('Volume delta must be a number');
    }
  }
}

// Export singleton instance for backward-compatibility
export const PTE = new ProbabilityTensorEngine();
// Export singleton instance
export const PTE = new ProbabilityTensorEngine();
