import { PRMResult } from './types';

/**
 * Sensory Feedback Types
 */
export interface SensoryFeedback {
  harmonic: number | null;  // Frequency in Hz (432-1432 range)
  haptic: HapticPattern;
  phonic: PhonicsWaveform;
  recommendation: 'SEND' | 'WAIT' | 'REJECT';
  description: string;
}

export type HapticPattern = 
  | 'Pulse (strong, confident)'
  | 'Wave (moderate, flowing)'
  | 'Buzz (weak, uncertain)'
  | 'Alert (warning, sharp)';

export type PhonicsWaveform =
  | 'Sine (calm, smooth)'
  | 'Triangle (balanced)'
  | 'Sawtooth (edgy)'
  | 'Square (harsh, alert)';

/**
 * SensoryMapper
 * 
 * Maps PRM results to multi-sensory feedback (Harmonic, Haptic, Phonic)
 * Based on Manus AI analysis and Grok AI integration recommendations
 * 
 * Mapping Table:
 * | Probability | Harmonic (Hz) | Haptic        | Phonic    | Recommendation |
 * |-------------|---------------|---------------|-----------|----------------|
 * | ≥ 0.7       | 1000-1432     | Pulse         | Sine      | SEND           |
 * | 0.5-0.7     | 700-1000      | Wave          | Triangle  | WAIT           |
 * | 0.3-0.5     | 432-700       | Buzz          | Sawtooth  | WAIT           |
 * | < 0.3       | N/A           | Alert         | Square    | REJECT         |
 */
export class SensoryMapper {
  private static instance: SensoryMapper;

  private constructor() {}

  static getInstance(): SensoryMapper {
    if (!SensoryMapper.instance) {
      SensoryMapper.instance = new SensoryMapper();
    }
    return SensoryMapper.instance;
  }
  /**
   * Map PRM result to multi-sensory feedback
   */
  mapSensory(prm: PRMResult): SensoryFeedback {
    const { probability, resonanceFreq } = prm;

    if (probability >= 0.7) {
      return {
        harmonic: this.mapToRange(resonanceFreq, 1000, 1432),
        haptic: 'Pulse (strong, confident)',
        phonic: 'Sine (calm, smooth)',
        recommendation: 'SEND',
        description: `High confidence (${(probability * 100).toFixed(1)}%). Strong market resonance detected at ${resonanceFreq.toFixed(0)}Hz. Transaction likely to succeed.`
      };
    } else if (probability >= 0.5) {
      return {
        harmonic: this.mapToRange(resonanceFreq, 700, 1000),
        haptic: 'Wave (moderate, flowing)',
        phonic: 'Triangle (balanced)',
        recommendation: 'WAIT',
        description: `Moderate confidence (${(probability * 100).toFixed(1)}%). Market conditions are balanced. Consider waiting for better alignment.`
      };
    } else if (probability >= 0.3) {
      return {
        harmonic: this.mapToRange(resonanceFreq, 432, 700),
        haptic: 'Buzz (weak, uncertain)',
        phonic: 'Sawtooth (edgy)',
        recommendation: 'WAIT',
        description: `Low-moderate confidence (${(probability * 100).toFixed(1)}%). Weak market resonance. High caution advised.`
      };
    } else {
      return {
        harmonic: null,
        haptic: 'Alert (warning, sharp)',
        phonic: 'Square (harsh, alert)',
        recommendation: 'REJECT',
        description: `Very low confidence (${(probability * 100).toFixed(1)}%). Market conditions unfavorable. Transaction likely to fail - reject to save gas fees.`
      };
    }
  }

  /**
   * Generate Web Audio API compatible oscillator settings
   */
  getAudioSettings(sensory: SensoryFeedback): AudioSettings {
    const waveformMap: Record<string, OscillatorType> = {
      'Sine (calm, smooth)': 'sine',
      'Triangle (balanced)': 'triangle',
      'Sawtooth (edgy)': 'sawtooth',
      'Square (harsh, alert)': 'square'
    };

    return {
      frequency: sensory.harmonic || 440,  // Default to A440 if null
      waveform: waveformMap[sensory.phonic] || 'sine',
      duration: this.getDurationForRecommendation(sensory.recommendation),
      volume: this.getVolumeForRecommendation(sensory.recommendation)
    };
  }

  /**
   * Generate Vibration API compatible pattern
   */
  getHapticPattern(sensory: SensoryFeedback): number[] {
    switch (sensory.haptic) {
      case 'Pulse (strong, confident)':
        return [200, 100, 200, 100, 200]; // Strong pulses
      case 'Wave (moderate, flowing)':
        return [100, 50, 150, 50, 200, 50, 150, 50, 100]; // Wave pattern
      case 'Buzz (weak, uncertain)':
        return [50, 30, 50, 30, 50, 30, 50]; // Rapid buzz
      case 'Alert (warning, sharp)':
        return [300, 200, 300, 200, 300]; // Alert pattern
      default:
        return [100];
    }
  }

  /**
   * Map resonance frequency to specific range
   */
  private mapToRange(freq: number, min: number, max: number): number {
    const range = max - min;
    const normalized = freq % range;
    return min + normalized;
  }

  /**
   * Get audio duration based on recommendation
   */
  private getDurationForRecommendation(rec: 'SEND' | 'WAIT' | 'REJECT'): number {
    switch (rec) {
      case 'SEND': return 0.5;   // Short, confident
      case 'WAIT': return 1.0;   // Medium, contemplative
      case 'REJECT': return 0.3; // Short, sharp
    }
  }

  /**
   * Get audio volume based on recommendation
   */
  private getVolumeForRecommendation(rec: 'SEND' | 'WAIT' | 'REJECT'): number {
    switch (rec) {
      case 'SEND': return 0.7;   // Loud, confident
      case 'WAIT': return 0.5;   // Medium
      case 'REJECT': return 0.9; // Very loud, alert
    }
  }
}

/**
 * Audio settings for Web Audio API
 */
export interface AudioSettings {
  frequency: number;
  waveform: OscillatorType;
  duration: number;
  volume: number;
}

// Export singleton instance
export const Mapper = new SensoryMapper();
