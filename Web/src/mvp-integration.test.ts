/**
 * MVP Integration Tests
 * 
 * Tests all integrations working together:
 * - The TIE sentiment
 * - Pyth oracles
 * - x402 monetization
 * - Enhanced PTE
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { PTEEngineMVP } from './pte-engine-mvp';
import { getSentimentAPI } from './integrations/the-tie-sentiment';
// import { getPythClient } from './integrations/pyth-oracle';
import { getOracleSuite } from './integrations/oracle-suite';
import { getMonetizationLayer } from './integrations/x402-monetization';

describe('MVP Integration Tests', () => {
  let pteEngine: PTEEngineMVP;

  beforeAll(() => {
    pteEngine = PTEEngineMVP.getInstance();
  });

  describe('The TIE Sentiment Integration', () => {
    it('should fetch sentiment data', async () => {
      const sentimentAPI = getSentimentAPI(true); // Use mock
      const sentiment = await sentimentAPI.fetchSentiment('AVAX');

      expect(sentiment).toBeDefined();
      expect(sentiment.ticker).toBe('AVAX');
      expect(sentiment.score).toBeGreaterThanOrEqual(-1);
      expect(sentiment.score).toBeLessThanOrEqual(1);
      expect(sentiment.confidence).toBeGreaterThan(0);
    });

    it('should calculate sentiment boost correctly', () => {
      const sentimentAPI = getSentimentAPI(true);
      
      // Bullish sentiment
      const bullishBoost = sentimentAPI.calculateSentimentBoost(0.8, 1.0);
      expect(bullishBoost).toBeGreaterThan(1.0);
      expect(bullishBoost).toBeLessThanOrEqual(1.15);

      // Bearish sentiment
      const bearishBoost = sentimentAPI.calculateSentimentBoost(-0.8, 1.0);
      expect(bearishBoost).toBeLessThan(1.0);
      expect(bearishBoost).toBeGreaterThanOrEqual(0.85);

      // Neutral sentiment
      const neutralBoost = sentimentAPI.calculateSentimentBoost(0, 1.0);
      expect(neutralBoost).toBeCloseTo(1.0, 2);
    });

    it('should fetch batch sentiment data', async () => {
      const sentimentAPI = getSentimentAPI(true);
      const tickers = ['AVAX', 'BTC', 'ETH'];
      const sentiments = await sentimentAPI.fetchBatchSentiment(tickers);

      expect(sentiments.size).toBe(3);
      tickers.forEach(ticker => {
        expect(sentiments.has(ticker)).toBe(true);
      });
    });
  });

  describe('Pyth Oracle Integration', () => {
    it('should fetch price data', async () => {
      const pythClient = getPythClient('devnet');
      const priceData = await pythClient.fetchPrice('AVAX/USD');

      expect(priceData).toBeDefined();
      expect(priceData.symbol).toBe('AVAX/USD');
      expect(priceData.price).toBeGreaterThan(0);
      expect(priceData.timestamp).toBeGreaterThan(0);
    });

    it('should fetch market indicators', async () => {
      const pythClient = getPythClient('devnet');
      const indicators = await pythClient.fetchMarketIndicators('AVAX');

      expect(indicators).toBeDefined();
      expect(indicators.vix).toBeGreaterThan(0);
      expect(indicators.rsi).toBeGreaterThanOrEqual(0);
      expect(indicators.rsi).toBeLessThanOrEqual(100);
      expect(indicators.price).toBeGreaterThan(0);
    });

    it('should fetch batch prices', async () => {
      const pythClient = getPythClient('devnet');
      const symbols = ['AVAX/USD', 'BTC/USD', 'ETH/USD'];
      const prices = await pythClient.fetchBatchPrices(symbols);

      expect(prices.size).toBe(3);
      symbols.forEach(symbol => {
        expect(prices.has(symbol)).toBe(true);
      });
    });
  });

  describe('x402 Monetization Integration', () => {
    it('should list premium features', () => {
      const monetization = getMonetizationLayer('0x123...');
      const features = monetization.getPremiumFeatures();

      expect(features.length).toBeGreaterThan(0);
      features.forEach(feature => {
        expect(feature.id).toBeDefined();
        expect(feature.price).toBeGreaterThan(0);
        expect(feature.enabled).toBe(true);
      });
    });

    it('should get feature pricing', () => {
      const monetization = getMonetizationLayer('0x123...');
      const pricing = monetization.getFeaturePricing('dfk_gaming_action');

      expect(pricing).toBeDefined();
      expect(pricing?.price).toBe(0.01);
      expect(pricing?.token).toBe('USDC');
    });

    it('should calculate bundle price', () => {
      const monetization = getMonetizationLayer('0x123...');
      const features = ['dfk_gaming_action', 'premium_haptics'];
      const totalPrice = monetization.calculateBundlePrice(features);

      expect(totalPrice).toBe(0.015); // 0.01 + 0.005
    });

    it('should request feature access', async () => {
      const monetization = getMonetizationLayer('0x123...');
      const access = await monetization.requestFeatureAccess('user123', 'dfk_gaming_action');

      expect(access.requiresPayment).toBe(true);
      expect(access.feature).toBeDefined();
      expect(access.paymentRequest).toBeDefined();
      expect(access.paymentRequest?.amount).toBe(0.01);
    });
  });

  describe('Enhanced PTE Engine', () => {
    it('should compute PRM without enhancements', async () => {
      const result = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: false,
        usePyth: false
      });

      expect(result).toBeDefined();
      expect(result.prm).toBeGreaterThanOrEqual(0);
      expect(result.prm).toBeLessThanOrEqual(1);
      expect(result.recommendation).toMatch(/SEND|WAIT|REJECT/);
      expect(result.frequency).toBeGreaterThanOrEqual(432);
      expect(result.frequency).toBeLessThanOrEqual(1432);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should compute PRM with sentiment boost', async () => {
      const result = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: true,
        usePyth: false
      });

      expect(result).toBeDefined();
      expect(result.sentimentBoost).toBeDefined();
      expect(result.sentimentBoost).toBeGreaterThanOrEqual(0.85);
      expect(result.sentimentBoost).toBeLessThanOrEqual(1.15);
    });

    it('should compute PRM with Pyth oracles', async () => {
      const result = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: false,
        usePyth: true
      });

      expect(result).toBeDefined();
      expect(result.prm).toBeGreaterThanOrEqual(0);
      expect(result.prm).toBeLessThanOrEqual(1);
    });

    it('should compute PRM with all enhancements', async () => {
      const result = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: true,
        usePyth: true,
        isPremium: true
      });

      expect(result).toBeDefined();
      expect(result.sentimentBoost).toBeDefined();
      expect(result.isPremium).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8); // Higher confidence with all data
    });

    it('should batch analyze multiple assets', async () => {
      const assets = ['AVAX', 'BTC', 'ETH'];
      const results = await pteEngine.batchAnalyze(assets, {
        useSentiment: true,
        usePyth: false
      });

      expect(results.size).toBe(3);
      assets.forEach(asset => {
        const result = results.get(asset);
        expect(result).toBeDefined();
        expect(result?.prm).toBeGreaterThanOrEqual(0);
        expect(result?.prm).toBeLessThanOrEqual(1);
      });
    });

    it('should maintain sub-microsecond latency', async () => {
      const iterations = 100;
      const latencies: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await pteEngine.computePRMEnhanced('AVAX', {
          useSentiment: false,
          usePyth: false
        });
        const end = performance.now();
        latencies.push((end - start) * 1000); // Convert to μs
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      
      // Should be well under 1μs for basic computation
      expect(avgLatency).toBeLessThan(1.0);
    });

    it('should handle custom thresholds', () => {
      pteEngine.setThresholds(0.8, 0.2);
      const thresholds = pteEngine.getThresholds();

      expect(thresholds.send).toBe(0.8);
      expect(thresholds.reject).toBe(0.2);

      // Reset to defaults
      pteEngine.setThresholds(0.7, 0.3);
    });

    it('should validate threshold constraints', () => {
      expect(() => {
        pteEngine.setThresholds(0.3, 0.7); // send < reject
      }).toThrow();

      expect(() => {
        pteEngine.setThresholds(1.5, 0.3); // send > 1
      }).toThrow();

      expect(() => {
        pteEngine.setThresholds(0.7, -0.1); // reject < 0
      }).toThrow();
    });
  });

  describe('End-to-End Integration', () => {
    it('should execute complete premium flow', async () => {
      // 1. Request feature access
      const monetization = getMonetizationLayer('0x123...');
      const access = await monetization.requestFeatureAccess('user123', 'sentiment_boost');

      expect(access.requiresPayment).toBe(true);
      expect(access.paymentRequest).toBeDefined();

      // 2. Simulate payment (mock)
      const paymentResponse = {
        success: true,
        transactionHash: '0xabc...',
        gasUsed: 21000,
        timestamp: Date.now()
      };

      // 3. Compute PRM with premium features
      const result = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: true,
        usePyth: true,
        isPremium: true,
        paymentProof: paymentResponse
      });

      expect(result.isPremium).toBe(true);
      expect(result.sentimentBoost).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.85);
    });

    it('should demonstrate accuracy improvement', async () => {
      // Baseline (no enhancements)
      const baseline = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: false,
        usePyth: false
      });

      // Enhanced (with sentiment)
      const enhanced = await pteEngine.computePRMEnhanced('AVAX', {
        useSentiment: true,
        usePyth: false
      });

      // Confidence should be higher with sentiment
      expect(enhanced.confidence).toBeGreaterThanOrEqual(baseline.confidence);

      // Sentiment boost should affect PRM
      if (enhanced.sentimentBoost) {
        const expectedPRM = baseline.prm * enhanced.sentimentBoost;
        expect(enhanced.prm).toBeCloseTo(Math.min(1.0, expectedPRM), 2);
      }
    });
  });
});
