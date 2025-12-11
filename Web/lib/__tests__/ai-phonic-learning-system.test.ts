/**
 * AI Phonic Learning System - Test Suite
 * 
 * Comprehensive tests for Phase 3: AI pattern recognition, prediction, and learning
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  AIPhonic LearningSystem,
  createAIPhonicSystem,
  predictFromBell,
  generateVoiceAnnouncement,
  calculateRiskScore,
  type FrequencySignature,
  type MarketOutcome,
  type TrainingPair
} from '../ai-phonic-learning-system';
import { calculateInfinitePrecisionBell } from '../infinite-precision-bell-system';

describe('AI Phonic Learning System', () => {
  let system: AIPhonic LearningSystem;
  
  beforeEach(() => {
    system = createAIPhonicSystem();
  });
  
  // ==========================================================================
  // FREQUENCY SIGNATURE GENERATION
  // ==========================================================================
  
  describe('Frequency Signature Generation', () => {
    it('should generate valid frequency signature from bell', () => {
      const bell = calculateInfinitePrecisionBell(5.2, 0.08, 0.9);
      const signature = system.generateSignature(bell, 'BTC');
      
      expect(signature.frequency).toBeGreaterThan(0);
      expect(signature.wavelength).toBeGreaterThan(0);
      expect(signature.amplitude).toBeGreaterThanOrEqual(0);
      expect(signature.amplitude).toBeLessThanOrEqual(1);
      expect(signature.harmonics).toHaveLength(3);
      expect(signature.complexity).toBeGreaterThanOrEqual(1);
      expect(signature.complexity).toBeLessThanOrEqual(100);
      expect(signature.asset).toBe('BTC');
    });
    
    it('should generate consistent signatures for same input', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const sig1 = system.generateSignature(bell, 'ETH');
      const sig2 = system.generateSignature(bell, 'ETH');
      
      expect(sig1.frequency).toBe(sig2.frequency);
      expect(sig1.wavelength).toBe(sig2.wavelength);
      expect(sig1.complexity).toBe(sig2.complexity);
    });
    
    it('should calculate correct harmonic overtones', () => {
      const bell = calculateInfinitePrecisionBell(0, 0.05, 0.5);
      const signature = system.generateSignature(bell);
      
      expect(signature.harmonics[0]).toBe(signature.frequency * 2); // Octave
      expect(signature.harmonics[1]).toBe(signature.frequency * 3); // Perfect fifth
      expect(signature.harmonics[2]).toBe(signature.frequency * 4); // Double octave
    });
    
    it('should handle extreme market conditions', () => {
      const crashBell = calculateInfinitePrecisionBell(-50, 0.3, 2.0);
      const crashSig = system.generateSignature(crashBell);
      expect(crashSig.frequency).toBeGreaterThan(0);
      
      const euphoriabell = calculateInfinitePrecisionBell(100, 0.2, 1.8);
      const euphoriaSig = system.generateSignature(euphoriabell);
      expect(euphoriaSig.frequency).toBeGreaterThan(crashSig.frequency);
    });
  });
  
  // ==========================================================================
  // PATTERN CLASSIFICATION
  // ==========================================================================
  
  describe('Pattern Classification', () => {
    it('should classify crash pattern (350-380 Hz)', () => {
      const bell = calculateInfinitePrecisionBell(-35, 0.25, 1.2);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      expect(pattern).toBe('crash');
      expect(signature.frequency).toBeGreaterThanOrEqual(350);
      expect(signature.frequency).toBeLessThan(380);
    });
    
    it('should classify caution pattern (410-430 Hz)', () => {
      const bell = calculateInfinitePrecisionBell(-8, 0.12, 0.8);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      expect(pattern).toBe('caution');
    });
    
    it('should classify neutral pattern (430-435 Hz)', () => {
      const bell = calculateInfinitePrecisionBell(0, 0.05, 0.5);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      expect(pattern).toBe('neutral');
      expect(signature.frequency).toBeCloseTo(432, 0);
    });
    
    it('should classify bull pattern (450-500 Hz)', () => {
      const bell = calculateInfinitePrecisionBell(15, 0.08, 1.1);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      expect(pattern).toBe('bull');
    });
    
    it('should classify euphoria pattern (650+ Hz)', () => {
      const bell = calculateInfinitePrecisionBell(42, 0.18, 1.5);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      expect(pattern).toBe('euphoria');
      expect(signature.frequency).toBeGreaterThan(650);
    });
  });
  
  // ==========================================================================
  // PATTERN MATCHING
  // ==========================================================================
  
  describe('Pattern Matching', () => {
    it('should find similar patterns', () => {
      const bell1 = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const sig1 = system.generateSignature(bell1);
      
      // Add similar training data
      const trainingPair: TrainingPair = {
        signature: sig1,
        outcome: {
          signatureId: 'test1',
          priceChange: 12,
          timeHorizon: 4,
          direction: 'up',
          volatility: 0.1,
          timestamp: Date.now()
        }
      };
      system.addTrainingPair(trainingPair);
      
      const bell2 = calculateInfinitePrecisionBell(11, 0.1, 1.0);
      const sig2 = system.generateSignature(bell2);
      
      const similar = system.findSimilarPatterns(sig2, 80);
      expect(similar.length).toBeGreaterThan(0);
    });
    
    it('should not match very different patterns', () => {
      const crashBell = calculateInfinitePrecisionBell(-30, 0.2, 1.5);
      const crashSig = system.generateSignature(crashBell);
      
      const trainingPair: TrainingPair = {
        signature: crashSig,
        outcome: {
          signatureId: 'test2',
          priceChange: -25,
          timeHorizon: 4,
          direction: 'down',
          volatility: 0.2,
          timestamp: Date.now()
        }
      };
      system.addTrainingPair(trainingPair);
      
      const bullBell = calculateInfinitePrecisionBell(30, 0.1, 1.0);
      const bullSig = system.generateSignature(bullBell);
      
      const similar = system.findSimilarPatterns(bullSig, 90);
      expect(similar.length).toBe(0); // Should not find crash pattern similar to bull
    });
  });
  
  // ==========================================================================
  // PREDICTION ENGINE
  // ==========================================================================
  
  describe('Prediction Engine', () => {
    it('should generate valid prediction', () => {
      const bell = calculateInfinitePrecisionBell(5, 0.08, 0.9);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.signature).toBeDefined();
      expect(prediction.prediction).toBeDefined();
      expect(prediction.explanation).toBeDefined();
      expect(prediction.prediction.direction).toMatch(/BUY|SELL|HOLD/);
      expect(prediction.prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.prediction.confidence).toBeLessThanOrEqual(1);
    });
    
    it('should predict SELL for crash pattern', () => {
      const crashBell = calculateInfinitePrecisionBell(-35, 0.25, 1.2);
      const prediction = predictFromBell(crashBell, system);
      
      expect(prediction.prediction.direction).toBe('SELL');
      expect(prediction.prediction.riskLevel).toBe('high');
      expect(prediction.explanation.pattern).toBe('crash');
    });
    
    it('should predict BUY for bull pattern', () => {
      const bullBell = calculateInfinitePrecisionBell(20, 0.08, 1.2);
      const prediction = predictFromBell(bullBell, system);
      
      expect(prediction.prediction.direction).toBe('BUY');
      expect(prediction.explanation.pattern).toBe('bull');
    });
    
    it('should predict HOLD for neutral pattern', () => {
      const neutralBell = calculateInfinitePrecisionBell(0, 0.05, 0.5);
      const prediction = predictFromBell(neutralBell, system);
      
      expect(prediction.prediction.direction).toBe('HOLD');
      expect(prediction.explanation.pattern).toBe('neutral');
      expect(prediction.prediction.riskLevel).toBe('low');
    });
    
    it('should include confidence scores', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.prediction.confidence).toBeGreaterThan(0);
      expect(prediction.prediction.confidence).toBeLessThan(1);
    });
    
    it('should include expected price change', () => {
      const bell = calculateInfinitePrecisionBell(15, 0.08, 1.1);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.prediction.expectedChange).toBeDefined();
      expect(typeof prediction.prediction.expectedChange).toBe('number');
    });
  });
  
  // ==========================================================================
  // NATURAL LANGUAGE EXPLANATION
  // ==========================================================================
  
  describe('Natural Language Explanation', () => {
    it('should generate explanation text', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.explanation.reasoning).toBeDefined();
      expect(prediction.explanation.reasoning.length).toBeGreaterThan(0);
    });
    
    it('should include historical accuracy', () => {
      const bell = calculateInfinitePrecisionBell(5, 0.08, 0.9);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.explanation.historicalAccuracy).toBeGreaterThanOrEqual(0);
      expect(prediction.explanation.historicalAccuracy).toBeLessThanOrEqual(1);
    });
    
    it('should reference frequency in explanation', () => {
      const bell = calculateInfinitePrecisionBell(-20, 0.15, 1.0);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.explanation.reasoning).toContain('Hz');
      expect(prediction.explanation.reasoning).toContain('frequency');
    });
  });
  
  // ==========================================================================
  // VOICE OUTPUT
  // ==========================================================================
  
  describe('Voice Output', () => {
    it('should generate voice text', () => {
      const bell = calculateInfinitePrecisionBell(-30, 0.2, 1.5);
      const prediction = predictFromBell(bell, system);
      
      expect(prediction.voice).toBeDefined();
      expect(prediction.voice?.text).toBeDefined();
      expect(prediction.voice?.text.length).toBeGreaterThan(0);
    });
    
    it('should mark high urgency for crash', () => {
      const crashBell = calculateInfinitePrecisionBell(-40, 0.3, 1.8);
      const prediction = predictFromBell(crashBell, system);
      
      expect(prediction.voice?.urgency).toBeGreaterThanOrEqual(8);
      expect(prediction.voice?.shouldSpeak).toBe(true);
    });
    
    it('should mark low urgency for neutral', () => {
      const neutralBell = calculateInfinitePrecisionBell(0, 0.05, 0.5);
      const prediction = predictFromBell(neutralBell, system);
      
      expect(prediction.voice?.urgency).toBeLessThan(5);
      expect(prediction.voice?.shouldSpeak).toBe(false);
    });
    
    it('should include direction in voice text', () => {
      const bell = calculateInfinitePrecisionBell(15, 0.08, 1.1);
      const prediction = predictFromBell(bell, system);
      
      const voiceText = generateVoiceAnnouncement(prediction);
      if (voiceText) {
        expect(voiceText).toContain(prediction.prediction.direction);
      }
    });
  });
  
  // ==========================================================================
  // TRAINING & LEARNING
  // ==========================================================================
  
  describe('Training & Learning', () => {
    it('should add training pairs', () => {
      const initialState = system.getModelState();
      const initialCount = initialState.trainingPairs;
      
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const signature = system.generateSignature(bell);
      const outcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: 12,
        timeHorizon: 4,
        direction: 'up',
        volatility: 0.1,
        timestamp: Date.now()
      };
      
      system.addTrainingPair({ signature, outcome, accuracy: true });
      
      const newState = system.getModelState();
      expect(newState.trainingPairs).toBe(initialCount + 1);
    });
    
    it('should update pattern library statistics', () => {
      const bell = calculateInfinitePrecisionBell(15, 0.08, 1.1);
      const signature = system.generateSignature(bell);
      const pattern = system.classifyPattern(signature);
      
      const initialStats = system.getPatternStatistics();
      const initialPattern = initialStats.find(p => p.class === pattern);
      const initialObs = initialPattern?.observations || 0;
      
      const outcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: 18,
        timeHorizon: 4,
        direction: 'up',
        volatility: 0.08,
        timestamp: Date.now()
      };
      
      system.addTrainingPair({ signature, outcome });
      
      const newStats = system.getPatternStatistics();
      const newPattern = newStats.find(p => p.class === pattern);
      expect(newPattern?.observations).toBeGreaterThan(initialObs);
    });
    
    it('should update model accuracy', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const prediction = predictFromBell(bell, system);
      
      const outcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: 12,
        timeHorizon: 4,
        direction: 'up',
        volatility: 0.1,
        timestamp: Date.now()
      };
      
      system.observeOutcome(prediction.signature, outcome, prediction);
      
      const state = system.getModelState();
      expect(state.totalPredictions).toBeGreaterThan(0);
    });
    
    it('should learn from incorrect predictions', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const prediction = predictFromBell(bell, system);
      
      const initialWeights = system.getModelState().weights;
      
      // Simulate wrong prediction
      const wrongOutcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: -15, // Opposite of prediction
        timeHorizon: 4,
        direction: 'down',
        volatility: 0.1,
        timestamp: Date.now()
      };
      
      system.observeOutcome(prediction.signature, wrongOutcome, prediction);
      
      const newWeights = system.getModelState().weights;
      // Weights should change after incorrect prediction
      const weightsChanged = Object.keys(initialWeights).some(
        key => initialWeights[key as keyof typeof initialWeights] !== 
               newWeights[key as keyof typeof newWeights]
      );
      expect(weightsChanged).toBe(true);
    });
    
    it('should handle batch training', () => {
      const trainingData: TrainingPair[] = [];
      
      for (let i = 0; i < 10; i++) {
        const bell = calculateInfinitePrecisionBell(i * 5, 0.1, 1.0);
        const signature = system.generateSignature(bell);
        const outcome: MarketOutcome = {
          signatureId: `test${i}`,
          priceChange: i * 5,
          timeHorizon: 4,
          direction: i > 0 ? 'up' : 'stable',
          volatility: 0.1,
          timestamp: Date.now()
        };
        trainingData.push({ signature, outcome });
      }
      
      system.batchTrain(trainingData);
      
      const state = system.getModelState();
      expect(state.trainingPairs).toBeGreaterThanOrEqual(10);
    });
  });
  
  // ==========================================================================
  // MODEL STATE
  // ==========================================================================
  
  describe('Model State Management', () => {
    it('should retrieve model state', () => {
      const state = system.getModelState();
      
      expect(state.version).toBeDefined();
      expect(state.trainingPairs).toBeGreaterThanOrEqual(0);
      expect(state.patternLibrary).toHaveLength(5); // 5 pattern classes
      expect(state.weights).toBeDefined();
    });
    
    it('should export training data', () => {
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const signature = system.generateSignature(bell);
      const outcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: 12,
        timeHorizon: 4,
        direction: 'up',
        volatility: 0.1,
        timestamp: Date.now()
      };
      
      system.addTrainingPair({ signature, outcome });
      
      const exported = system.exportTrainingData();
      expect(exported.length).toBeGreaterThan(0);
    });
    
    it('should get pattern statistics', () => {
      const stats = system.getPatternStatistics();
      
      expect(stats).toHaveLength(5);
      stats.forEach(pattern => {
        expect(pattern.class).toBeDefined();
        expect(pattern.frequencyRange).toHaveLength(2);
        expect(pattern.observations).toBeGreaterThanOrEqual(0);
        expect(pattern.accuracy).toBeGreaterThanOrEqual(0);
        expect(pattern.accuracy).toBeLessThanOrEqual(1);
      });
    });
    
    it('should reset model', () => {
      // Add some data
      const bell = calculateInfinitePrecisionBell(10, 0.1, 1.0);
      const signature = system.generateSignature(bell);
      const outcome: MarketOutcome = {
        signatureId: 'test',
        priceChange: 12,
        timeHorizon: 4,
        direction: 'up',
        volatility: 0.1,
        timestamp: Date.now()
      };
      system.addTrainingPair({ signature, outcome });
      
      // Reset
      system.reset();
      
      const state = system.getModelState();
      expect(state.trainingPairs).toBe(0);
      expect(state.totalPredictions).toBe(0);
      expect(state.correctPredictions).toBe(0);
    });
  });
  
  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================
  
  describe('Helper Functions', () => {
    it('should calculate risk score', () => {
      const bell = calculateInfinitePrecisionBell(-30, 0.2, 1.5);
      const prediction = predictFromBell(bell, system);
      const riskScore = calculateRiskScore(prediction);
      
      expect(riskScore).toBeGreaterThanOrEqual(0);
      expect(riskScore).toBeLessThanOrEqual(100);
    });
    
    it('should generate voice announcement text', () => {
      const crashBell = calculateInfinitePrecisionBell(-35, 0.25, 1.2);
      const prediction = predictFromBell(crashBell, system);
      const announcement = generateVoiceAnnouncement(prediction);
      
      if (prediction.voice?.shouldSpeak) {
        expect(announcement.length).toBeGreaterThan(0);
      }
    });
    
    it('should return empty string for low urgency', () => {
      const neutralBell = calculateInfinitePrecisionBell(0, 0.05, 0.5);
      const prediction = predictFromBell(neutralBell, system);
      const announcement = generateVoiceAnnouncement(prediction);
      
      if (!prediction.voice?.shouldSpeak) {
        expect(announcement).toBe('');
      }
    });
  });
  
  // ==========================================================================
  // REAL-WORLD SCENARIOS
  // ==========================================================================
  
  describe('Real-World Scenarios', () => {
    it('should handle Bitcoin crash scenario', () => {
      const crashBell = calculateInfinitePrecisionBell(-35, 0.25, 1.2);
      const prediction = predictFromBell(crashBell, system, 'BTC');
      
      expect(prediction.prediction.direction).toBe('SELL');
      expect(prediction.prediction.riskLevel).toBe('high');
      expect(prediction.voice?.shouldSpeak).toBe(true);
      expect(prediction.explanation.pattern).toBe('crash');
    });
    
    it('should handle Ethereum bull run', () => {
      const bullBell = calculateInfinitePrecisionBell(25, 0.10, 1.3);
      const prediction = predictFromBell(bullBell, system, 'ETH');
      
      expect(prediction.prediction.direction).toBe('BUY');
      expect(prediction.prediction.expectedChange).toBeGreaterThan(0);
      expect(prediction.explanation.pattern).toBe('bull');
    });
    
    it('should handle Solana stable market', () => {
      const neutralBell = calculateInfinitePrecisionBell(1, 0.05, 0.6);
      const prediction = predictFromBell(neutralBell, system, 'SOL');
      
      expect(prediction.prediction.direction).toBe('HOLD');
      expect(prediction.prediction.riskLevel).toBe('low');
      expect(prediction.explanation.pattern).toBe('neutral');
    });
    
    it('should handle euphoric market conditions', () => {
      const euphoriabell = calculateInfinitePrecisionBell(50, 0.20, 1.6);
      const prediction = predictFromBell(euphoriabell, system, 'BTC');
      
      expect(prediction.explanation.pattern).toBe('euphoria');
      expect(prediction.voice?.urgency).toBeGreaterThan(5);
    });
  });
  
  // ==========================================================================
  // PERFORMANCE
  // ==========================================================================
  
  describe('Performance', () => {
    it('should generate predictions quickly', () => {
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const bell = calculateInfinitePrecisionBell(i % 50 - 25, 0.1, 1.0);
        predictFromBell(bell, system);
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // 100 predictions in < 1 second
    });
    
    it('should handle large training datasets', () => {
      const trainingData: TrainingPair[] = [];
      
      for (let i = 0; i < 1000; i++) {
        const bell = calculateInfinitePrecisionBell(Math.random() * 100 - 50, 0.1, 1.0);
        const signature = system.generateSignature(bell);
        const outcome: MarketOutcome = {
          signatureId: `perf${i}`,
          priceChange: Math.random() * 20 - 10,
          timeHorizon: 4,
          direction: Math.random() > 0.5 ? 'up' : 'down',
          volatility: 0.1,
          timestamp: Date.now()
        };
        trainingData.push({ signature, outcome });
      }
      
      const start = Date.now();
      system.batchTrain(trainingData);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(5000); // 1000 training pairs in < 5 seconds
    });
  });
});
