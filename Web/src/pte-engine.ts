import { MarketCondition, PRMResult, TransactionData, TransactionRecommendation, RecommendationAction } from './types';

export class ProbabilityTensorEngine {
  private resonanceThreshold = 0.3; // PRM cutoff from McCrea equation
  private readonly MIN_FREQUENCY = 432; // Base harmonic frequency (Hz)
  private readonly MAX_FREQUENCY = 1432; // Maximum frequency range

  /**
   * Compute Probability Resonance Metric (PRM) using McCrea Equation
   * P = σ(ω) where ω = tensorFusion + sentimentDelta
   * tensorFusion = sum(RSI ⊗ VIX)
   * sentimentDelta = sentiment * volume_delta
   */
  computePRM(data: MarketCondition): PRMResult {
    // Validate input data
    this.validateMarketCondition(data);

    // Create 2x2 diagonal tensors for quantum simulation
    // RSI tensor: [[RSI, 0], [0, RSI]]
    // VIX tensor: [[VIX, 0], [0, VIX]]
    // Tensor product (element-wise multiplication for diagonal matrices):
    // [[RSI*VIX, 0], [0, RSI*VIX]]
    const tensorElement = data.rsi * data.vix;
    const tensorFusion = tensorElement * 2; // Sum of diagonal elements
    
    // Sentiment-weighted volume delta
    const sentimentDelta = data.sentiment * data.volume_delta;
    
    // Resonance frequency (omega)
    const omega = tensorFusion + sentimentDelta;
    
    // Sigmoid activation for probability (0-1)
    const rawProbability = 1 / (1 + Math.exp(-omega / 5000)); // Scaled sigmoid
    
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
   * Validate transaction based on market conditions
   * Returns true if PRM probability meets threshold
   */
  validateTx(txData: TransactionData, marketData: MarketCondition): boolean {
    const prm = this.computePRM(marketData);
    return prm.probability >= this.resonanceThreshold;
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
   * Set custom resonance threshold
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Threshold must be between 0 and 1');
    }
    this.resonanceThreshold = threshold;
  }

  /**
   * Get current threshold
   */
  getThreshold(): number {
    return this.resonanceThreshold;
  }

  /**
   * Map omega value to audible/haptic frequency range (432-1432 Hz)
   */
  private mapToFrequencyRange(omega: number): number {
    const absOmega = Math.abs(omega);
    const normalized = absOmega % 1000;
    return normalized + this.MIN_FREQUENCY;
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

// Export singleton instance for use in HTF
export const PTE = new ProbabilityTensorEngine();
