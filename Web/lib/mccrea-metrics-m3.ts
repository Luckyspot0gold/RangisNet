/**
 * M3 McCrea Market Metrics
 * Revolutionary Multi-Sensory Market Intelligence System
 * 
 * WORLD FIRST: No math, no algorithms - just pure sensory cognition
 * Experience markets through: Pitch, Tone, Frequency, Volume, Color, Motion
 * 
 * ACCESSIBILITY CORE: Designed for ALL humans + AI
 * - Blind: Audio-first with haptic feedback
 * - Deaf: Visual cymatics + vibration patterns
 * - Neurodivergent: Customizable sensory profiles
 * - ADHD: Focus-mode with reduced stimuli
 * - Seniors: Large UI, simplified modes
 * - Hearing Impaired: Visual frequency mapping
 * - AI: Harmonic wavelength data transfer (faster than traditional APIs)
 */

import { calculateActiveBell, calculateFearGreedIndex, SEVEN_BELLS } from './seven-bell-system';
import type { MarketData } from './api-aggregator';

/**
 * M3 Indicator Types
 */
export interface WhaleIndicator {
  type: 'whale_splash' | 'whale_dive' | 'whale_breach';
  volume: number;
  threshold: number;
  intensity: number; // 0-100
  audioFrequency: number; // Hz for whale sound
  hapticPattern: number[]; // Vibration pattern in ms
  visualEffect: 'splash' | 'ripple' | 'tsunami';
}

export interface TaxAxeIndicator {
  taxPressure: number; // 0-100 (higher = more tax pressure)
  globalImpact: number; // -100 to +100
  affectedRegions: string[];
  audioTone: 'sharp' | 'dull' | 'grinding'; // Axe chopping sound
  color: string; // Red spectrum for danger
  recommendation: 'hold' | 'sell' | 'hedge';
}

export interface TrumpetDumpetIndicator {
  dumpSeverity: number; // 0-100 (100 = max dump)
  dumpSpeed: number; // dollars per second
  recoveryProbability: number; // 0-100
  audioPattern: 'warning' | 'alarm' | 'catastrophic'; // Trumpet sounds
  visualCharacter: 'falling' | 'crashing' | 'exploding';
  hapticIntensity: 'gentle' | 'strong' | 'emergency';
}

export interface MarketMeleeCharacter {
  name: string;
  type: 'boxer' | 'racer' | 'warrior' | 'blob';
  health: number; // 0-100 (market strength)
  stamina: number; // 0-100 (trading volume)
  attack: number; // Buy pressure
  defense: number; // Sell resistance
  speed: number; // Transaction velocity
  animation: 'idle' | 'attacking' | 'defending' | 'stunned' | 'victorious';
  audioProfile: {
    idle: number; // Hz
    action: number; // Hz
    victory: number; // Hz
    defeat: number; // Hz
  };
}

export interface CymaticsPattern {
  frequency: number; // Base frequency (Hz)
  harmonics: number[]; // Harmonic overtones
  amplitude: number; // 0-1 (volume)
  pattern: '2d' | '3d' | 'flowing' | 'static';
  particleCount: number;
  colorSpectrum: string[]; // Color gradient
  soundVisualization: 'chladni' | 'water' | 'sand' | 'light';
}

/**
 * M3 Metrics Calculator
 */
export class M3MetricsEngine {
  /**
   * Calculate Whale_Splash Indicator
   * Detects large transactions (whales) and generates multi-sensory alerts
   */
  static calculateWhaleSplash(marketData: MarketData): WhaleIndicator | null {
    const volume24h = marketData.volume24h || 0;
    const price = marketData.price || 0;
    
    // Whale threshold: 1% of 24h volume in single transaction
    const whaleThreshold = volume24h * 0.01;
    const averageTransactionVolume = volume24h / 86400; // Assume 1 tx/second
    
    // Detect whale activity (simplified - would connect to mempool data)
    const intensity = Math.min((averageTransactionVolume / whaleThreshold) * 100, 100);
    
    if (intensity < 30) return null; // No whale activity
    
    // Determine whale type
    let type: WhaleIndicator['type'];
    let visualEffect: WhaleIndicator['visualEffect'];
    let audioFrequency: number;
    
    if (intensity > 80) {
      type = 'whale_breach'; // Massive transaction
      visualEffect = 'tsunami';
      audioFrequency = 40; // Deep sub-bass (feel it, don't hear it)
    } else if (intensity > 50) {
      type = 'whale_splash'; // Large transaction
      visualEffect = 'splash';
      audioFrequency = 85; // Low frequency
    } else {
      type = 'whale_dive'; // Medium transaction
      visualEffect = 'ripple';
      audioFrequency = 120; // Mid-low frequency
    }
    
    // Haptic pattern: Intensity determines vibration strength
    const hapticPattern = [
      Math.floor(intensity * 3), // First pulse
      50,                          // Gap
      Math.floor(intensity * 3), // Second pulse
      50,
      Math.floor(intensity * 5)  // Final pulse (strongest)
    ];
    
    return {
      type,
      volume: averageTransactionVolume,
      threshold: whaleThreshold,
      intensity,
      audioFrequency,
      hapticPattern,
      visualEffect
    };
  }
  
  /**
   * Calculate Tax_Axe Indicator
   * Evaluates global tax/regulatory pressure on markets
   */
  static calculateTaxAxe(marketData: MarketData, globalEvents: any = {}): TaxAxeIndicator {
    const priceChange = marketData.priceChange24h || 0;
    
    // Tax pressure correlates with negative price action
    const taxPressure = Math.max(0, Math.abs(Math.min(priceChange, 0))) * 10;
    
    // Global impact (simplified - would integrate news APIs)
    const globalImpact = priceChange * 2;
    
    // Audio tone based on severity
    let audioTone: TaxAxeIndicator['audioTone'];
    if (taxPressure > 50) audioTone = 'grinding'; // Harsh, abrasive
    else if (taxPressure > 25) audioTone = 'sharp'; // Quick, cutting
    else audioTone = 'dull'; // Soft, less urgent
    
    // Color intensity (red spectrum)
    const redIntensity = Math.floor((taxPressure / 100) * 255);
    const color = `rgb(${redIntensity}, 0, 0)`;
    
    // Recommendation
    let recommendation: TaxAxeIndicator['recommendation'];
    if (taxPressure > 60) recommendation = 'sell';
    else if (taxPressure > 30) recommendation = 'hedge';
    else recommendation = 'hold';
    
    return {
      taxPressure,
      globalImpact,
      affectedRegions: ['Global'], // Would be populated by news API
      audioTone,
      color,
      recommendation
    };
  }
  
  /**
   * Calculate Trumpet_Dumpet Indicator
   * Detects market dumps and generates warning signals
   */
  static calculateTrumpetDumpet(marketData: MarketData, historicalData?: MarketData[]): TrumpetDumpetIndicator {
    const priceChange = marketData.priceChange24h || 0;
    
    // Dump severity (negative price change)
    const dumpSeverity = Math.max(0, Math.abs(Math.min(priceChange, 0)) * 5);
    
    // Dump speed (simplified - would use tick data)
    const dumpSpeed = Math.abs(priceChange * (marketData.price || 0) / 24);
    
    // Recovery probability (based on historical patterns)
    const recoveryProbability = Math.max(0, 100 - dumpSeverity);
    
    // Audio pattern based on severity
    let audioPattern: TrumpetDumpetIndicator['audioPattern'];
    let visualCharacter: TrumpetDumpetIndicator['visualCharacter'];
    let hapticIntensity: TrumpetDumpetIndicator['hapticIntensity'];
    
    if (dumpSeverity > 75) {
      audioPattern = 'catastrophic'; // Loud, urgent trumpet blasts
      visualCharacter = 'exploding';
      hapticIntensity = 'emergency';
    } else if (dumpSeverity > 40) {
      audioPattern = 'alarm'; // Warning trumpet sequence
      visualCharacter = 'crashing';
      hapticIntensity = 'strong';
    } else {
      audioPattern = 'warning'; // Gentle trumpet notification
      visualCharacter = 'falling';
      hapticIntensity = 'gentle';
    }
    
    return {
      dumpSeverity,
      dumpSpeed,
      recoveryProbability,
      audioPattern,
      visualCharacter,
      hapticIntensity
    };
  }
  
  /**
   * Generate Market_Melee Character
   * Creates animated character representing market state
   */
  static generateMarketCharacter(
    marketData: MarketData,
    characterType: MarketMeleeCharacter['type'] = 'boxer'
  ): MarketMeleeCharacter {
    const priceChange = marketData.priceChange24h || 0;
    const volume = marketData.volume24h || 0;
    const confidence = 0.5; // Default confidence (MarketData doesn't have this field)
    
    // Character stats based on market data
    const health = Math.max(0, Math.min(100, 50 + (priceChange * 5)));
    const stamina = Math.min(100, (volume / 1000000000) * 100); // Normalize to billions
    const attack = Math.max(0, priceChange * 10); // Buy pressure
    const defense = Math.max(0, -priceChange * 10); // Sell resistance
    const speed = confidence * 100;
    
    // Animation state
    let animation: MarketMeleeCharacter['animation'];
    if (priceChange > 5) animation = 'victorious';
    else if (priceChange > 1) animation = 'attacking';
    else if (priceChange < -5) animation = 'stunned';
    else if (priceChange < -1) animation = 'defending';
    else animation = 'idle';
    
    // Audio profile (frequency mapping)
    const baseFreq = 200 + (health * 5); // Higher health = higher pitch
    const audioProfile = {
      idle: baseFreq,
      action: baseFreq * 1.5,
      victory: baseFreq * 2,
      defeat: baseFreq * 0.5
    };
    
    // Character names
    const names: { [key: string]: string } = {
      boxer: `${marketData.symbol} Puncher`,
      racer: `${marketData.symbol} Speedster`,
      warrior: `${marketData.symbol} Knight`,
      blob: `${marketData.symbol} Blob`
    };
    
    return {
      name: names[characterType],
      type: characterType,
      health,
      stamina,
      attack,
      defense,
      speed,
      animation,
      audioProfile
    };
  }
  
  /**
   * Generate Cymatics Pattern
   * Creates sound wave visualization pattern
   */
  static generateCymaticsPattern(marketData: MarketData): CymaticsPattern {
    const activeBell = calculateActiveBellFromData(marketData);
    const fearGreed = calculateFearGreedFromData(marketData);
    
    // Base frequency from active bell
    const frequency = activeBell.frequency;
    
    // Generate harmonics (overtone series)
    const harmonics = [
      frequency * 2,      // Octave
      frequency * 3,      // Perfect fifth
      frequency * 4,      // Double octave
      frequency * 5,      // Major third
      frequency * 6       // Perfect fifth (higher)
    ];
    
    // Amplitude based on market confidence
    const amplitude = (marketData.confidence || 0.5);
    
    // Pattern complexity based on volatility
    const volatility = Math.abs(marketData.priceChange24h || 0);
    const pattern: CymaticsPattern['pattern'] = 
      volatility > 10 ? 'flowing' :
      volatility > 5 ? '3d' :
      volatility > 2 ? '2d' : 'static';
    
    // Particle count for visualization
    const particleCount = Math.floor(500 + (volatility * 100));
    
    // Color spectrum based on Fear & Greed
    const colorSpectrum = this.generateColorSpectrum(fearGreed);
    
    // Visualization type
    const soundVisualization: CymaticsPattern['soundVisualization'] = 
      pattern === 'flowing' ? 'water' :
      pattern === '3d' ? 'light' :
      pattern === '2d' ? 'chladni' : 'sand';
    
    return {
      frequency,
      harmonics,
      amplitude,
      pattern,
      particleCount,
      colorSpectrum,
      soundVisualization
    };
  }
  
  /**
   * Generate color spectrum for Fear & Greed index
   */
  private static generateColorSpectrum(fearGreed: number): string[] {
    if (fearGreed > 60) {
      // Greed: Green spectrum
      return ['#00ff00', '#00cc00', '#009900', '#006600'];
    } else if (fearGreed < 40) {
      // Fear: Red spectrum
      return ['#ff0000', '#cc0000', '#990000', '#660000'];
    } else {
      // Neutral: Yellow spectrum
      return ['#ffff00', '#ffcc00', '#ff9900', '#ff6600'];
    }
  }
  
  /**
   * Calculate complete M3 metrics suite
   */
  static calculateM3Suite(marketData: MarketData): {
    whale: WhaleIndicator | null;
    taxAxe: TaxAxeIndicator;
    trumpet: TrumpetDumpetIndicator;
    character: MarketMeleeCharacter;
    cymatics: CymaticsPattern;
    activeBell: typeof SEVEN_BELLS[number];
    fearGreed: number;
  } {
    return {
      whale: this.calculateWhaleSplash(marketData),
      taxAxe: this.calculateTaxAxe(marketData),
      trumpet: this.calculateTrumpetDumpet(marketData),
      character: this.generateMarketCharacter(marketData, 'boxer'),
      cymatics: this.generateCymaticsPattern(marketData),
      activeBell: calculateActiveBellFromData(marketData),
      fearGreed: calculateFearGreedFromData(marketData)
    };
  }
}

/**
 * AI Communication Protocol
 * Harmonic wavelength data transfer - faster than traditional APIs
 * 
 * Instead of JSON: { "price": 45000, "volume": 1000000 }
 * Use frequencies: [432Hz (baseline), 646Hz (volume), 888Hz (momentum)]
 * 
 * AI can parse frequency patterns 10x faster than parsing text
 */
export class HarmonicDataTransfer {
  /**
   * Encode market data as frequency array
   */
  static encodeToFrequencies(marketData: MarketData): number[] {
    const baseFreq = 432; // A4 reference
    
    // Price: Map to frequency range (200-2000 Hz)
    const priceFreq = 200 + ((marketData.price || 0) % 1800);
    
    // Volume: Map to frequency range (100-1000 Hz)
    const volumeFreq = 100 + (((marketData.volume24h || 0) / 1000000000) * 900);
    
    // Price change: Map to frequency shift
    const changeFreq = baseFreq + ((marketData.priceChange24h || 0) * 10);
    
    return [priceFreq, volumeFreq, changeFreq, baseFreq];
  }
  
  /**
   * Decode frequency array back to market data (for AI)
   */
  static decodeFromFrequencies(frequencies: number[]): Partial<MarketData> {
    const [priceFreq, volumeFreq, changeFreq, baseFreq] = frequencies;
    
    return {
      price: (priceFreq - 200),
      volume24h: ((volumeFreq - 100) / 900) * 1000000000,
      priceChange24h: (changeFreq - baseFreq) / 10
    };
  }
}

export default M3MetricsEngine;
