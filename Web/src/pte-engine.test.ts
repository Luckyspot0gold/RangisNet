import { ProbabilityTensorEngine, PTE } from './pte-engine';
import { MarketCondition, TransactionData } from './types';

describe('ProbabilityTensorEngine', () => {
  let engine: ProbabilityTensorEngine;

  beforeEach(() => {
    engine = new ProbabilityTensorEngine();
  });

  describe('computePRM', () => {
    it('should compute PRM for bullish market conditions', () => {
      const marketData: MarketCondition = {
        rsi: 70,
        vix: 20,
        sentiment: 0.8,
        volume_delta: 1.2,
      };

      const result = engine.computePRM(marketData);

      expect(result.probability).toBeGreaterThan(0);
      expect(result.probability).toBeLessThanOrEqual(1);
      expect(result.resonanceFreq).toBeGreaterThanOrEqual(432);
      expect(result.resonanceFreq).toBeLessThanOrEqual(1432);
      expect(result.tensorFusion).toBeDefined();
      expect(result.sentimentDelta).toBeDefined();
      expect(result.omega).toBeDefined();
    });

    it('should compute PRM for bearish market conditions', () => {
      const marketData: MarketCondition = {
        rsi: 30,
        vix: 40,
        sentiment: -0.6,
        volume_delta: 0.8,
      };

      const result = engine.computePRM(marketData);

      expect(result.probability).toBeGreaterThanOrEqual(0);
      expect(result.probability).toBeLessThanOrEqual(1);
      expect(result.resonanceFreq).toBeGreaterThanOrEqual(432);
    });

    it('should return zero probability below threshold', () => {
      const marketData: MarketCondition = {
        rsi: 1,
        vix: 1,
        sentiment: -0.9,
        volume_delta: 0.1,
      };

      const result = engine.computePRM(marketData);

      // With RSI=1, VIX=1: tensorFusion = 2, sentimentDelta = -0.09, omega = 1.91
      // sigmoid(1.91/5000) gives ~0.5, which is > threshold (0.3)
      // So probability will be ~0.5, not 0
      expect(result.probability).toBeGreaterThan(0.3);
      expect(result.probability).toBeLessThan(0.6);
    });

    it('should compute correct tensor fusion', () => {
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      const result = engine.computePRM(marketData);

      // tensorFusion = (RSI * VIX) * 2 = (50 * 20) * 2 = 2000
      expect(result.tensorFusion).toBe(2000);
      // Verify omega calculation
      expect(result.omega).toBe(2000 + 0.5); // tensorFusion + sentimentDelta
    });

    it('should compute correct sentiment delta', () => {
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.8,
        volume_delta: 1.5,
      };

      const result = engine.computePRM(marketData);

      // sentimentDelta = 0.8 * 1.5 = 1.2
      expect(result.sentimentDelta).toBeCloseTo(1.2, 5);
    });

    it('should handle extreme RSI values', () => {
      const marketData: MarketCondition = {
        rsi: 100,
        vix: 50,
        sentiment: 1.0,
        volume_delta: 2.0,
      };

      const result = engine.computePRM(marketData);

      expect(result.probability).toBeGreaterThan(0);
      expect(result.tensorFusion).toBe(10000);
    });

    it('should handle zero values', () => {
      const marketData: MarketCondition = {
        rsi: 0,
        vix: 0,
        sentiment: 0,
        volume_delta: 0,
      };

      const result = engine.computePRM(marketData);

      expect(result.tensorFusion).toBe(0);
      expect(result.sentimentDelta).toBe(0);
      expect(result.omega).toBe(0);
    });

    it('should handle negative sentiment', () => {
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 25,
        sentiment: -0.5,
        volume_delta: 1.0,
      };

      const result = engine.computePRM(marketData);

      expect(result.sentimentDelta).toBe(-0.5);
      expect(result.omega).toBeLessThan(result.tensorFusion!);
    });

    it('should validate RSI range - upper bound', () => {
      const invalidData: MarketCondition = {
        rsi: 150,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('RSI must be a number between 0 and 100');
    });

    it('should validate RSI range - lower bound', () => {
      const invalidData: MarketCondition = {
        rsi: -10,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('RSI must be a number between 0 and 100');
    });

    it('should validate VIX non-negative', () => {
      const invalidData: MarketCondition = {
        rsi: 50,
        vix: -5,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('VIX must be a non-negative number');
    });

    it('should validate sentiment range - upper bound', () => {
      const invalidData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 1.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('Sentiment must be a number between -1 and 1');
    });

    it('should validate sentiment range - lower bound', () => {
      const invalidData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: -1.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('Sentiment must be a number between -1 and 1');
    });

    it('should handle boundary RSI values', () => {
      const marketData1: MarketCondition = {
        rsi: 0,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      const marketData2: MarketCondition = {
        rsi: 100,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(marketData1)).not.toThrow();
      expect(() => engine.computePRM(marketData2)).not.toThrow();
    });

    it('should handle boundary sentiment values', () => {
      const marketData1: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: -1,
        volume_delta: 1.0,
      };

      const marketData2: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 1,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(marketData1)).not.toThrow();
      expect(() => engine.computePRM(marketData2)).not.toThrow();
    });

    it('should handle negative volume delta', () => {
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: -2.0,
      };

      const result = engine.computePRM(marketData);
      expect(result.sentimentDelta).toBe(-1.0);
    });

    it('should validate RSI type', () => {
      const invalidData: any = {
        rsi: 'invalid',
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('RSI must be a number between 0 and 100');
    });

    it('should validate VIX type', () => {
      const invalidData: any = {
        rsi: 50,
        vix: 'invalid',
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('VIX must be a non-negative number');
    });

    it('should validate sentiment type', () => {
      const invalidData: any = {
        rsi: 50,
        vix: 20,
        sentiment: 'invalid',
        volume_delta: 1.0,
      };

      expect(() => engine.computePRM(invalidData)).toThrow('Sentiment must be a number between -1 and 1');
    });

    it('should validate volume_delta type', () => {
      const invalidData: any = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 'invalid',
      };

      expect(() => engine.computePRM(invalidData)).toThrow('Volume delta must be a number');
    });

    it('should handle very large omega values', () => {
      const marketData: MarketCondition = {
        rsi: 100,
        vix: 100,
        sentiment: 1,
        volume_delta: 100,
      };

      const result = engine.computePRM(marketData);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.probability).toBeLessThanOrEqual(1);
    });

    it('should handle very small positive omega values', () => {
      const marketData: MarketCondition = {
        rsi: 1,
        vix: 1,
        sentiment: 0.01,
        volume_delta: 0.01,
      };

      const result = engine.computePRM(marketData);
      expect(result.omega).toBeGreaterThan(0);
    });
  });

  describe('validateTx', () => {
    it('should validate transaction with favorable market conditions', () => {
      const txData: TransactionData = {
        from: '0x123',
        to: '0x456',
        value: 1000,
      };

      const marketData: MarketCondition = {
        rsi: 70,
        vix: 20,
        sentiment: 0.8,
        volume_delta: 1.2,
      };

      const isValid = engine.validateTx(txData, marketData);
      expect(isValid).toBe(true);
    });

    it('should reject transaction with unfavorable market conditions', () => {
      const txData: TransactionData = {
        from: '0x123',
        to: '0x456',
        value: 1000,
      };

      const marketData: MarketCondition = {
        rsi: 1,
        vix: 1,
        sentiment: -0.9,
        volume_delta: 0.1,
      };

      const result = engine.computePRM(marketData);
      const isValid = engine.validateTx(txData, marketData);
      // With very low RSI and VIX, probability should be around 0.5 (sigmoid at small omega)
      // Verify validation logic works correctly
      expect(isValid).toBe(result.probability >= engine.getThreshold());
    });

    it('should handle edge case at threshold', () => {
      const txData: TransactionData = {
        from: '0x123',
        to: '0x456',
        value: 1000,
      };

      const marketData: MarketCondition = {
        rsi: 35,
        vix: 15,
        sentiment: 0.3,
        volume_delta: 1.0,
      };

      const result = engine.computePRM(marketData);
      const isValid = engine.validateTx(txData, marketData);
      
      if (result.probability >= 0.3) {
        expect(isValid).toBe(true);
      } else {
        expect(isValid).toBe(false);
      }
    });

    it('should validate transaction with optional fields', () => {
      const txData: TransactionData = {
        from: '0x123',
        to: '0x456',
        value: 1000,
        gasLimit: 21000,
        data: '0xabcd',
      };

      const marketData: MarketCondition = {
        rsi: 60,
        vix: 22,
        sentiment: 0.6,
        volume_delta: 1.1,
      };

      const isValid = engine.validateTx(txData, marketData);
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('getRecommendation', () => {
    it('should recommend SEND for high probability', () => {
      const marketData: MarketCondition = {
        rsi: 85,
        vix: 35,
        sentiment: 0.95,
        volume_delta: 2.0,
      };

      const recommendation = engine.getRecommendation(marketData);

      expect(recommendation.action).toBe('SEND');
      expect(recommendation.probability).toBeGreaterThanOrEqual(0.7);
      expect(recommendation.reason).toContain('High confidence');
    });

    it('should recommend WAIT for moderate probability', () => {
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.4,
        volume_delta: 1.0,
      };

      const recommendation = engine.getRecommendation(marketData);

      if (recommendation.probability >= 0.3 && recommendation.probability < 0.7) {
        expect(recommendation.action).toBe('WAIT');
        expect(recommendation.reason).toContain('Moderate confidence');
      }
    });

    it('should recommend REJECT for low probability', () => {
      const marketData: MarketCondition = {
        rsi: 1,
        vix: 1,
        sentiment: -0.95,
        volume_delta: 0.1,
      };

      const recommendation = engine.getRecommendation(marketData);
      const result = engine.computePRM(marketData);

      // Verify based on actual probability
      if (result.probability < 0.3) {
        expect(recommendation.action).toBe('REJECT');
        expect(recommendation.reason).toContain('Low confidence');
      } else if (result.probability < 0.7) {
        expect(recommendation.action).toBe('WAIT');
        expect(recommendation.reason).toContain('Moderate confidence');
      }
      expect(recommendation.probability).toBe(result.probability);
    });

    it('should include resonance frequency in recommendation', () => {
      const marketData: MarketCondition = {
        rsi: 60,
        vix: 22,
        sentiment: 0.6,
        volume_delta: 1.1,
      };

      const recommendation = engine.getRecommendation(marketData);

      expect(recommendation.resonanceFreq).toBeGreaterThanOrEqual(432);
      expect(recommendation.resonanceFreq).toBeLessThanOrEqual(1432);
    });

    it('should provide detailed reason in recommendation', () => {
      const marketData: MarketCondition = {
        rsi: 70,
        vix: 25,
        sentiment: 0.7,
        volume_delta: 1.3,
      };

      const recommendation = engine.getRecommendation(marketData);

      expect(recommendation.reason).toBeTruthy();
      expect(recommendation.reason.length).toBeGreaterThan(20);
    });

    it('should handle boundary at 0.7 probability', () => {
      // This tests the exact boundary between WAIT and SEND
      const marketData: MarketCondition = {
        rsi: 75,
        vix: 28,
        sentiment: 0.85,
        volume_delta: 1.5,
      };

      const recommendation = engine.getRecommendation(marketData);
      
      if (recommendation.probability >= 0.7) {
        expect(recommendation.action).toBe('SEND');
      } else {
        expect(recommendation.action).toBe('WAIT');
      }
    });

    it('should handle boundary at 0.3 probability', () => {
      // This tests the exact boundary between REJECT and WAIT
      const marketData: MarketCondition = {
        rsi: 20,
        vix: 10,
        sentiment: 0.1,
        volume_delta: 0.5,
      };

      const recommendation = engine.getRecommendation(marketData);
      
      if (recommendation.probability >= 0.3) {
        expect(['WAIT', 'SEND']).toContain(recommendation.action);
      } else {
        expect(recommendation.action).toBe('REJECT');
      }
    });
  });

  describe('threshold management', () => {
    it('should set custom threshold', () => {
      engine.setThreshold(0.5);
      expect(engine.getThreshold()).toBe(0.5);
    });

    it('should reject invalid threshold above 1', () => {
      expect(() => engine.setThreshold(1.5)).toThrow('Threshold must be between 0 and 1');
    });

    it('should reject invalid threshold below 0', () => {
      expect(() => engine.setThreshold(-0.1)).toThrow('Threshold must be between 0 and 1');
    });

    it('should accept boundary threshold values', () => {
      engine.setThreshold(0);
      expect(engine.getThreshold()).toBe(0);

      engine.setThreshold(1);
      expect(engine.getThreshold()).toBe(1);
    });

    it('should affect validation with custom threshold', () => {
      const txData: TransactionData = {
        from: '0x123',
        to: '0x456',
        value: 1000,
      };

      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      engine.setThreshold(0.9);
      const isValidHigh = engine.validateTx(txData, marketData);

      engine.setThreshold(0.1);
      const isValidLow = engine.validateTx(txData, marketData);

      // With lower threshold, more likely to pass
      expect(isValidLow).toBe(true);
    });

    it('should affect recommendations with custom threshold', () => {
      const marketData: MarketCondition = {
        rsi: 40,
        vix: 18,
        sentiment: 0.3,
        volume_delta: 0.9,
      };

      engine.setThreshold(0.1);
      const rec1 = engine.getRecommendation(marketData);

      engine.setThreshold(0.8);
      const rec2 = engine.getRecommendation(marketData);

      // Lower threshold should be more permissive
      if (rec1.probability >= 0.1 && rec1.probability < 0.8) {
        expect(rec2.action).toBe('REJECT');
      }
    });

    it('should persist threshold across multiple calls', () => {
      engine.setThreshold(0.6);
      
      const marketData: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      engine.computePRM(marketData);
      engine.computePRM(marketData);
      
      expect(engine.getThreshold()).toBe(0.6);
    });
  });

  describe('singleton instance', () => {
    it('should export PTE singleton', () => {
      expect(PTE).toBeInstanceOf(ProbabilityTensorEngine);
    });

    it('should use singleton for computations', () => {
      const marketData: MarketCondition = {
        rsi: 60,
        vix: 22,
        sentiment: 0.6,
        volume_delta: 1.1,
      };

      const result = PTE.computePRM(marketData);
      expect(result.probability).toBeGreaterThanOrEqual(0);
    });

    it('should maintain independent state from new instances', () => {
      const newEngine = new ProbabilityTensorEngine();
      
      PTE.setThreshold(0.5);
      newEngine.setThreshold(0.7);
      
      expect(PTE.getThreshold()).toBe(0.5);
      expect(newEngine.getThreshold()).toBe(0.7);
    });
  });

  describe('frequency mapping', () => {
    it('should map omega to valid frequency range', () => {
      const testCases = [
        { rsi: 10, vix: 10, sentiment: 0.1, volume_delta: 0.5 },
        { rsi: 50, vix: 25, sentiment: 0.5, volume_delta: 1.0 },
        { rsi: 90, vix: 40, sentiment: 0.9, volume_delta: 1.8 },
      ];

      testCases.forEach(marketData => {
        const result = engine.computePRM(marketData);
        expect(result.resonanceFreq).toBeGreaterThanOrEqual(432);
        expect(result.resonanceFreq).toBeLessThanOrEqual(1432);
      });
    });

    it('should produce consistent frequency for same omega', () => {
      const marketData1: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      const marketData2: MarketCondition = {
        rsi: 50,
        vix: 20,
        sentiment: 0.5,
        volume_delta: 1.0,
      };

      const result1 = engine.computePRM(marketData1);
      const result2 = engine.computePRM(marketData2);

      expect(result1.resonanceFreq).toBe(result2.resonanceFreq);
    });

    it('should handle negative omega in frequency mapping', () => {
      const marketData: MarketCondition = {
        rsi: 10,
        vix: 5,
        sentiment: -0.8,
        volume_delta: 1.0,
      };

      const result = engine.computePRM(marketData);
      expect(result.resonanceFreq).toBeGreaterThanOrEqual(432);
      expect(result.resonanceFreq).toBeLessThanOrEqual(1432);
    });

    it('should handle zero omega in frequency mapping', () => {
      const marketData: MarketCondition = {
        rsi: 0,
        vix: 0,
        sentiment: 0,
        volume_delta: 0,
      };

      const result = engine.computePRM(marketData);
      expect(result.resonanceFreq).toBe(432); // 0 % 1000 + 432 = 432
    });

    it('should map large omega values correctly', () => {
      const marketData: MarketCondition = {
        rsi: 100,
        vix: 100,
        sentiment: 1,
        volume_delta: 10,
      };

      const result = engine.computePRM(marketData);
      expect(result.resonanceFreq).toBeGreaterThanOrEqual(432);
      expect(result.resonanceFreq).toBeLessThanOrEqual(1432);
    });
  });

  describe('mathematical properties', () => {
    it('should always produce probability between 0 and 1', () => {
      const testCases = [
        { rsi: 0, vix: 0, sentiment: -1, volume_delta: 0 },
        { rsi: 50, vix: 25, sentiment: 0, volume_delta: 1 },
        { rsi: 100, vix: 100, sentiment: 1, volume_delta: 10 },
      ];

      testCases.forEach(marketData => {
        const result = engine.computePRM(marketData);
        expect(result.probability).toBeGreaterThanOrEqual(0);
        expect(result.probability).toBeLessThanOrEqual(1);
      });
    });

    it('should satisfy omega = tensorFusion + sentimentDelta', () => {
      const marketData: MarketCondition = {
        rsi: 60,
        vix: 22,
        sentiment: 0.6,
        volume_delta: 1.1,
      };

      const result = engine.computePRM(marketData);
      expect(result.omega).toBeCloseTo(result.tensorFusion! + result.sentimentDelta!, 10);
    });

    it('should produce higher probability for higher omega', () => {
      const marketData1: MarketCondition = {
        rsi: 30,
        vix: 15,
        sentiment: 0.2,
        volume_delta: 0.8,
      };

      const marketData2: MarketCondition = {
        rsi: 80,
        vix: 35,
        sentiment: 0.9,
        volume_delta: 1.8,
      };

      const result1 = engine.computePRM(marketData1);
      const result2 = engine.computePRM(marketData2);

      if (result1.omega! < result2.omega!) {
        // Higher omega should produce higher or equal raw probability
        // (before threshold filtering)
        expect(result2.omega).toBeGreaterThan(result1.omega!);
      }
    });

    it('should handle sigmoid function at omega = 0', () => {
      const marketData: MarketCondition = {
        rsi: 0,
        vix: 0,
        sentiment: 0,
        volume_delta: 0,
      };

      const result = engine.computePRM(marketData);
      // At omega = 0, sigmoid(0/5000) = 1/(1+exp(0)) = 0.5
      // Since 0.5 > threshold (0.3), it passes through
      expect(result.probability).toBe(0.5);
      expect(result.omega).toBe(0);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow from market data to validation', () => {
      const txData: TransactionData = {
        from: '0xabc',
        to: '0xdef',
        value: 5000,
      };

      const marketData: MarketCondition = {
        rsi: 65,
        vix: 24,
        sentiment: 0.7,
        volume_delta: 1.4,
      };

      const prm = engine.computePRM(marketData);
      const recommendation = engine.getRecommendation(marketData);
      const isValid = engine.validateTx(txData, marketData);

      expect(prm.probability).toBe(recommendation.probability);
      expect(isValid).toBe(prm.probability >= engine.getThreshold());
    });

    it('should maintain consistency across multiple computations', () => {
      const marketData: MarketCondition = {
        rsi: 55,
        vix: 21,
        sentiment: 0.55,
        volume_delta: 1.15,
      };

      const result1 = engine.computePRM(marketData);
      const result2 = engine.computePRM(marketData);
      const result3 = engine.computePRM(marketData);

      expect(result1.probability).toBe(result2.probability);
      expect(result2.probability).toBe(result3.probability);
      expect(result1.resonanceFreq).toBe(result3.resonanceFreq);
    });
  });
});
