/**
 * Probabilistic Resonance Model (PRM) Engine
 * RangisNet Layer 1.5 - Multi-Sensory Financial Cognition
 * 
 * Implements the Harmonic Resonance Model (HRM) and Probabilistic Resonance Model (PRM)
 * as described in the Reality Protocol LLC patent documentation.
 * 
 * Patent-compliant implementation for transforming market data into
 * multi-sensory outputs (harmonic, haptic, phonic).
 */

import { AggregatedMarketData } from './api-aggregator';

export interface HarmonicOutput {
  frequency: number;        // Hz - base frequency modulated by price change
  amplitude: number;        // 0-1 - intensity based on price movement
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth';
  duration: number;         // milliseconds
}

export interface HapticOutput {
  intensity: number;        // 0-1 - vibration intensity
  pattern: number[];        // Array of pulse durations in ms
  duration: number;         // Total duration in milliseconds
}

export interface PhonicOutput {
  pitch: number;            // Hz - audio frequency
  volume: number;           // 0-1 - audio volume
  timbre: string;           // Audio timbre description
  duration: number;         // milliseconds
}

export interface PRMAnalysis {
  recommendation: 'SEND' | 'WAIT' | 'STOP';
  confidence: number;       // 0-1
  harmonic: HarmonicOutput;
  haptic: HapticOutput;
  phonic: PhonicOutput;
  metadata: {
    symbol: string;
    price: number;
    priceChange24h: number;
    timestamp: number;
    resonanceScore: number;
  };
}

// Constants based on Harmonic Resonance Model
const BASE_FREQUENCY = 432;  // Hz - Natural resonance frequency
const GOLDEN_RATIO = 1.618033988749895;
const MIN_FREQUENCY = 200;
const MAX_FREQUENCY = 800;

/**
 * Calculates the Harmonic Resonance frequency based on price change
 * Uses the golden ratio for natural harmonic progression
 */
function calculateHarmonicFrequency(priceChange: number): number {
  // Normalize price change to a reasonable range (-50% to +50%)
  const normalizedChange = Math.max(-50, Math.min(50, priceChange)) / 50;
  
  // Apply golden ratio modulation
  const modulation = Math.pow(GOLDEN_RATIO, normalizedChange);
  
  // Calculate frequency with bounds
  const frequency = BASE_FREQUENCY * modulation;
  return Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, frequency));
}

/**
 * Calculates amplitude based on price volatility
 */
function calculateAmplitude(priceChange: number, volume: number): number {
  const volatility = Math.abs(priceChange);
  const normalizedVolume = Math.log10(volume + 1) / 15; // Normalize volume
  
  // Combine volatility and volume for amplitude
  const amplitude = (volatility / 50) * 0.7 + normalizedVolume * 0.3;
  return Math.max(0, Math.min(1, amplitude));
}

/**
 * Determines waveform type based on market conditions
 */
function selectWaveform(priceChange: number): HarmonicOutput['waveform'] {
  const absChange = Math.abs(priceChange);
  
  if (absChange < 2) return 'sine';      // Stable - smooth sine wave
  if (absChange < 5) return 'triangle';  // Moderate - triangle wave
  if (absChange < 10) return 'sawtooth'; // Volatile - sawtooth wave
  return 'square';                       // Extreme - square wave
}

/**
 * Generates harmonic output for the HRM
 */
function generateHarmonicOutput(data: AggregatedMarketData): HarmonicOutput {
  const frequency = calculateHarmonicFrequency(data.priceChange24h);
  const amplitude = calculateAmplitude(data.priceChange24h, data.volume24h);
  const waveform = selectWaveform(data.priceChange24h);
  
  // Duration based on confidence
  const duration = 1000 + (data.confidence * 2000); // 1-3 seconds
  
  return {
    frequency,
    amplitude,
    waveform,
    duration
  };
}

/**
 * Generates haptic feedback pattern based on market momentum
 */
function generateHapticOutput(data: AggregatedMarketData): HapticOutput {
  const intensity = Math.min(1, Math.abs(data.priceChange24h) / 20);
  const pulseCount = Math.ceil(intensity * 5) + 1;
  
  // Create pulse pattern
  const pattern: number[] = [];
  for (let i = 0; i < pulseCount; i++) {
    const pulseDuration = 50 + (intensity * 150);
    const pauseDuration = 100 - (intensity * 50);
    pattern.push(pulseDuration, pauseDuration);
  }
  
  const duration = pattern.reduce((sum, val) => sum + val, 0);
  
  return {
    intensity,
    pattern,
    duration
  };
}

/**
 * Generates phonic (audio) output based on price action
 */
function generatePhonicOutput(data: AggregatedMarketData): PhonicOutput {
  const priceChange = data.priceChange24h;
  
  // Map price change to musical scale (pentatonic for pleasant sound)
  const baseNote = 261.63; // Middle C
  const scale = [1, 9/8, 5/4, 3/2, 5/3]; // Pentatonic ratios
  const scaleIndex = Math.floor((priceChange + 25) / 10) % scale.length;
  const pitch = baseNote * scale[Math.max(0, scaleIndex)];
  
  // Volume based on confidence and volatility
  const volume = data.confidence * Math.min(1, Math.abs(priceChange) / 15);
  
  // Timbre selection based on market sentiment
  let timbre = 'pure';
  if (priceChange > 5) timbre = 'bright';
  else if (priceChange < -5) timbre = 'mellow';
  else if (Math.abs(priceChange) < 2) timbre = 'soft';
  
  const duration = 500 + (data.confidence * 1500); // 0.5-2 seconds
  
  return {
    pitch,
    volume,
    timbre,
    duration
  };
}

/**
 * Calculates the resonance score - a proprietary metric combining
 * price momentum, volume, and confidence
 */
function calculateResonanceScore(data: AggregatedMarketData): number {
  const momentumScore = Math.abs(data.priceChange24h) / 50; // Normalized momentum
  const volumeScore = Math.log10(data.volume24h + 1) / 15;  // Normalized volume
  const confidenceScore = data.confidence;
  
  // Weighted combination
  const resonanceScore = (
    momentumScore * 0.5 +
    volumeScore * 0.3 +
    confidenceScore * 0.2
  );
  
  return Math.max(0, Math.min(1, resonanceScore));
}

/**
 * Determines trading recommendation based on PRM analysis
 */
function determineRecommendation(
  priceChange: number,
  resonanceScore: number,
  confidence: number
): 'SEND' | 'WAIT' | 'STOP' {
  // High confidence and positive momentum
  if (confidence > 0.7 && priceChange > 5 && resonanceScore > 0.6) {
    return 'SEND'; // Strong buy signal
  }
  
  // High confidence and negative momentum
  if (confidence > 0.7 && priceChange < -5 && resonanceScore > 0.6) {
    return 'STOP'; // Strong sell signal
  }
  
  // Low confidence or low resonance
  if (confidence < 0.5 || resonanceScore < 0.4) {
    return 'WAIT'; // Hold - insufficient signal
  }
  
  // Moderate conditions
  if (Math.abs(priceChange) < 2) {
    return 'WAIT'; // Stable market - hold
  }
  
  // Default to WAIT for edge cases
  return 'WAIT';
}

/**
 * Main PRM analysis function - processes market data and generates
 * multi-sensory output with trading recommendation
 */
export function analyzePRM(data: AggregatedMarketData): PRMAnalysis {
  // Generate sensory outputs
  const harmonic = generateHarmonicOutput(data);
  const haptic = generateHapticOutput(data);
  const phonic = generatePhonicOutput(data);
  
  // Calculate resonance score
  const resonanceScore = calculateResonanceScore(data);
  
  // Determine recommendation
  const recommendation = determineRecommendation(
    data.priceChange24h,
    resonanceScore,
    data.confidence
  );
  
  return {
    recommendation,
    confidence: data.confidence,
    harmonic,
    haptic,
    phonic,
    metadata: {
      symbol: data.symbol,
      price: data.price,
      priceChange24h: data.priceChange24h,
      timestamp: data.timestamp,
      resonanceScore
    }
  };
}

/**
 * Batch PRM analysis for multiple assets
 */
export function analyzeBatchPRM(
  dataMap: Map<string, AggregatedMarketData>
): Map<string, PRMAnalysis> {
  const results = new Map<string, PRMAnalysis>();
  
  dataMap.forEach((data, symbol) => {
    try {
      const analysis = analyzePRM(data);
      results.set(symbol, analysis);
    } catch (error) {
      console.error(`PRM analysis failed for ${symbol}:`, error);
    }
  });
  
  return results;
}

/**
 * Utility function to convert HarmonicOutput to Web Audio API parameters
 */
export function toWebAudioParams(harmonic: HarmonicOutput) {
  return {
    frequency: harmonic.frequency,
    gain: harmonic.amplitude,
    type: harmonic.waveform as OscillatorType,
    duration: harmonic.duration / 1000 // Convert to seconds
  };
}

/**
 * Utility function to convert HapticOutput to Vibration API pattern
 */
export function toVibrationPattern(haptic: HapticOutput): number[] {
  return haptic.pattern;
}
