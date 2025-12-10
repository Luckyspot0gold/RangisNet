/**
 * INFINITE PRECISION BELL SYSTEM - TEST SUITE
 * Validates Phase 1 implementation
 * 
 * Tests:
 * - Continuous frequency mapping
 * - Infinite precision (0.0000000001%)
 * - Full-spectrum color generation
 * - Wavelength calculations
 * - Harmonic series
 * - Musical note mapping
 * - Master frequency aggregation
 */

import {
  calculateContinuousFrequency,
  calculateInfinitePrecisionBell,
  calculateWavelength,
  calculateHarmonics,
  calculateColorMapping,
  hslToRgb,
  rgbToHex,
  findNearestMusicalNote,
  calculateMasterFrequency,
  generateFullSpectrum,
  getFrequency,
  getColor,
  INFINITE_BELL_CONSTANTS
} from '../infinite-precision-bell-system';

describe('Infinite Precision Bell System - Phase 1', () => {
  
  describe('Continuous Frequency Mapping', () => {
    test('Neutral (0% change) should return base frequency 432 Hz', () => {
      const frequency = calculateContinuousFrequency(0);
      expect(frequency).toBe(432);
    });
    
    test('Maximum bull (+100%) should return max frequency 1266 Hz', () => {
      const frequency = calculateContinuousFrequency(100);
      expect(frequency).toBe(1266);
    });
    
    test('Maximum bear (-100%) should return min frequency 86 Hz', () => {
      const frequency = calculateContinuousFrequency(-100);
      expect(frequency).toBe(86);
    });
    
    test('Moderate bull (+50%) should return 849 Hz', () => {
      const frequency = calculateContinuousFrequency(50);
      expect(frequency).toBe(849);
    });
    
    test('Moderate bear (-50%) should return 259 Hz', () => {
      const frequency = calculateContinuousFrequency(-50);
      expect(frequency).toBe(259);
    });
    
    test('Infinite precision: +0.0000000001% should work', () => {
      const frequency = calculateContinuousFrequency(0.0000000001);
      expect(frequency).toBeGreaterThan(432);
      expect(frequency).toBeLessThan(432.0001);
    });
    
    test('Infinite precision: -0.0000000001% should work', () => {
      const frequency = calculateContinuousFrequency(-0.0000000001);
      expect(frequency).toBeLessThan(432);
      expect(frequency).toBeGreaterThan(431.9999);
    });
    
    test('Should clamp extreme values', () => {
      expect(calculateContinuousFrequency(500)).toBe(1266); // Clamped to +100%
      expect(calculateContinuousFrequency(-500)).toBe(86);  // Clamped to -100%
    });
  });
  
  describe('Wavelength Calculations', () => {
    test('432 Hz should calculate correct wavelength', () => {
      const wavelength = calculateWavelength(432);
      expect(wavelength).toBeCloseTo(0.7939, 4); // 343 / 432 = 0.7939 m
    });
    
    test('86 Hz should have long wavelength', () => {
      const wavelength = calculateWavelength(86);
      expect(wavelength).toBeCloseTo(3.9884, 4); // 343 / 86 = 3.9884 m
    });
    
    test('1266 Hz should have short wavelength', () => {
      const wavelength = calculateWavelength(1266);
      expect(wavelength).toBeCloseTo(0.2709, 4); // 343 / 1266 = 0.2709 m
    });
  });
  
  describe('Harmonic Series', () => {
    test('Should calculate 5 harmonics by default', () => {
      const harmonics = calculateHarmonics(432);
      expect(harmonics).toHaveLength(5);
      expect(harmonics).toEqual([864, 1296, 1728, 2160, 2592]);
    });
    
    test('Should calculate custom number of harmonics', () => {
      const harmonics = calculateHarmonics(432, 3);
      expect(harmonics).toHaveLength(3);
      expect(harmonics).toEqual([864, 1296, 1728]);
    });
    
    test('Harmonics should be integer multiples', () => {
      const fundamental = 100;
      const harmonics = calculateHarmonics(fundamental, 10);
      harmonics.forEach((harmonic, index) => {
        expect(harmonic).toBe(fundamental * (index + 2));
      });
    });
  });
  
  describe('Color Mapping', () => {
    test('86 Hz (panic) should map to red spectrum', () => {
      const color = calculateColorMapping(86);
      expect(color.hue).toBeLessThan(30); // Red hues
    });
    
    test('432 Hz (neutral) should map to green spectrum', () => {
      const color = calculateColorMapping(432);
      expect(color.hue).toBeGreaterThan(120);
      expect(color.hue).toBeLessThan(160);
    });
    
    test('1266 Hz (euphoria) should map to blue spectrum', () => {
      const color = calculateColorMapping(1266);
      expect(color.hue).toBeGreaterThan(220);
      expect(color.hue).toBeLessThan(250);
    });
    
    test('HSL to RGB conversion should work correctly', () => {
      const rgb = hslToRgb(0, 100, 50); // Pure red
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });
    
    test('HSL to RGB: Blue', () => {
      const rgb = hslToRgb(240, 100, 50); // Pure blue
      expect(rgb).toEqual({ r: 0, g: 0, b: 255 });
    });
    
    test('RGB to Hex conversion', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
      expect(rgbToHex(128, 128, 128)).toBe('#808080');
    });
  });
  
  describe('Musical Note Mapping', () => {
    test('432 Hz should map near A4', () => {
      const result = findNearestMusicalNote(432);
      expect(result.note).toMatch(/A[34]/); // A3 or A4
      expect(Math.abs(result.cents)).toBeLessThan(50);
    });
    
    test('440 Hz should exactly match A4', () => {
      const result = findNearestMusicalNote(440);
      expect(result.note).toMatch(/A4/);
      expect(result.cents).toBe(0);
    });
  });
  
  describe('Infinite Precision Bell Generation', () => {
    test('Should generate complete bell configuration', () => {
      const bell = calculateInfinitePrecisionBell(3.14159265, 0.35, 0.68);
      
      expect(bell.frequency).toBeGreaterThan(432);
      expect(bell.wavelength).toBeLessThan(1);
      expect(bell.color).toMatch(/^hsl\(/);
      expect(bell.hexColor).toMatch(/^#[0-9A-F]{6}$/);
      expect(bell.rgb.r).toBeGreaterThanOrEqual(0);
      expect(bell.rgb.r).toBeLessThanOrEqual(255);
      expect(bell.harmonics).toHaveLength(5);
      expect(bell.musicNote).toBeDefined();
      expect(bell.amplitude).toBeGreaterThanOrEqual(0);
      expect(bell.amplitude).toBeLessThanOrEqual(1);
      expect(bell.waveform).toMatch(/^(sine|square|sawtooth|triangle)$/);
      expect(bell.priceChangePercent).toBeCloseTo(3.14159265, 10);
      expect(bell.marketState).toBeDefined();
      expect(bell.emotionalState).toBeDefined();
    });
    
    test('Market states should be correct', () => {
      const panic = calculateInfinitePrecisionBell(-25, 0.5, 0.5);
      expect(panic.emotionalState).toBe('Panic');
      expect(panic.marketState).toContain('Crash');
      
      const neutral = calculateInfinitePrecisionBell(0, 0.5, 0.5);
      expect(neutral.emotionalState).toBe('Calm');
      expect(neutral.marketState).toContain('Neutral');
      
      const euphoria = calculateInfinitePrecisionBell(25, 0.5, 0.5);
      expect(euphoria.emotionalState).toBe('Euphoria');
      expect(euphoria.marketState).toContain('Bull');
    });
    
    test('Extreme precision should preserve decimals', () => {
      const bell = calculateInfinitePrecisionBell(0.0000000042, 0.5, 0.5);
      expect(bell.priceChangePercent).toBe(0.0000000042);
      expect(bell.frequency).toBeGreaterThan(432);
      expect(bell.frequency).toBeLessThan(432.0001);
    });
  });
  
  describe('Master Frequency Calculation', () => {
    test('Should calculate weighted average correctly', () => {
      const bell1 = calculateInfinitePrecisionBell(10, 0.5, 0.5);
      const bell2 = calculateInfinitePrecisionBell(-10, 0.5, 0.5);
      
      const master = calculateMasterFrequency([
        { bell: bell1, weight: 0.5 },
        { bell: bell2, weight: 0.5 }
      ]);
      
      // Should be close to neutral (432 Hz)
      expect(master).toBeCloseTo(432, 0);
    });
    
    test('Should handle single asset', () => {
      const bell = calculateInfinitePrecisionBell(20, 0.5, 0.5);
      const master = calculateMasterFrequency([{ bell, weight: 1.0 }]);
      
      expect(master).toBe(bell.frequency);
    });
    
    test('Should return base frequency for empty array', () => {
      const master = calculateMasterFrequency([]);
      expect(master).toBe(432);
    });
  });
  
  describe('Full Spectrum Generation', () => {
    test('Should generate 256 colors by default', () => {
      const spectrum = generateFullSpectrum();
      expect(spectrum).toHaveLength(256);
    });
    
    test('Should generate custom number of colors', () => {
      const spectrum = generateFullSpectrum(100);
      expect(spectrum).toHaveLength(100);
    });
    
    test('All colors should be valid hex codes', () => {
      const spectrum = generateFullSpectrum(50);
      spectrum.forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
      });
    });
    
    test('Should span from red to blue', () => {
      const spectrum = generateFullSpectrum(3);
      // First should be reddish, last should be blueish
      expect(spectrum[0]).toBeDefined();
      expect(spectrum[2]).toBeDefined();
      expect(spectrum[0]).not.toBe(spectrum[2]);
    });
  });
  
  describe('Convenience Functions', () => {
    test('getFrequency should match calculateContinuousFrequency', () => {
      expect(getFrequency(5)).toBe(calculateContinuousFrequency(5));
      expect(getFrequency(-5)).toBe(calculateContinuousFrequency(-5));
      expect(getFrequency(0)).toBe(432);
    });
    
    test('getColor should return valid HSL string', () => {
      const color = getColor(10);
      expect(color).toMatch(/^hsl\(\d+(\.\d+)?, \d+(\.\d+)?%, \d+(\.\d+)?%\)$/);
    });
  });
  
  describe('Real-World Use Cases', () => {
    test('Bitcoin +3.2% price change', () => {
      const bell = calculateInfinitePrecisionBell(3.2, 0.05, 0.85);
      
      expect(bell.frequency).toBeGreaterThan(432);
      expect(bell.frequency).toBeLessThan(500);
      expect(bell.emotionalState).toBe('Calm'); // Still in neutral range
      expect(bell.waveform).toBe('sine'); // Low volatility
    });
    
    test('Stock market crash -23.5%', () => {
      const bell = calculateInfinitePrecisionBell(-23.5, 0.95, 1.0);
      
      expect(bell.frequency).toBeLessThan(200);
      expect(bell.emotionalState).toBe('Panic');
      expect(bell.waveform).toBe('square'); // Extreme volatility
    });
    
    test('Gold stable -0.001%', () => {
      const bell = calculateInfinitePrecisionBell(-0.001, 0.01, 0.3);
      
      expect(bell.frequency).toBeCloseTo(432, 1);
      expect(bell.emotionalState).toBe('Calm');
      expect(bell.waveform).toBe('sine'); // Very low volatility
    });
  });
  
  describe('Performance Tests', () => {
    test('Should handle 1000 calculations quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        calculateInfinitePrecisionBell(Math.random() * 200 - 100, Math.random(), Math.random());
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });
  });
});
