/**
 * CYMATIC ENGINE - TEST SUITE
 * Validates Phase 2 implementation
 * 
 * Tests:
 * - Chladni pattern generation
 * - Water/sand/light patterns
 * - 3D particle systems
 * - Canvas rendering
 * - Animation functions
 * - Physics accuracy
 */

import {
  calculateChladniPattern,
  calculateWaterPattern,
  calculateSandPattern,
  calculateLightPattern,
  generateCymaticPattern,
  generateParticleSystem,
  generateThreeJSGeometry,
  animateCymaticPattern,
  DEFAULT_CYMATIC_CONFIG,
  type ChladniGrid,
  type CymaticPattern
} from '../cymatic-engine';
import { calculateInfinitePrecisionBell } from '../infinite-precision-bell-system';

describe('Cymatic Visualization Engine - Phase 2', () => {
  
  describe('Chladni Pattern Generation', () => {
    test('Should generate grid with correct dimensions', () => {
      const pattern = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.width).toBe(512);
      expect(pattern.height).toBe(512);
      expect(pattern.data.length).toBe(512);
      expect(pattern.data[0].length).toBe(512);
    });
    
    test('Should have amplitude values between -1 and 1', () => {
      const pattern = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      for (let i = 0; i < pattern.width; i++) {
        for (let j = 0; j < pattern.height; j++) {
          expect(pattern.data[i][j]).toBeGreaterThanOrEqual(-1);
          expect(pattern.data[i][j]).toBeLessThanOrEqual(1);
        }
      }
    });
    
    test('Should detect nodes (zero-crossing points)', () => {
      const pattern = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.nodes.length).toBeGreaterThan(0);
      expect(pattern.nodes[0]).toHaveProperty('x');
      expect(pattern.nodes[0]).toHaveProperty('y');
    });
    
    test('Should detect anti-nodes (maximum amplitude)', () => {
      const pattern = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.antiNodes.length).toBeGreaterThan(0);
    });
    
    test('Higher frequencies should create more complex patterns', () => {
      const lowFreq = calculateChladniPattern(100, DEFAULT_CYMATIC_CONFIG);
      const highFreq = calculateChladniPattern(1000, DEFAULT_CYMATIC_CONFIG);
      
      // Higher frequency = more nodes (more complexity)
      expect(highFreq.nodes.length).toBeGreaterThan(lowFreq.nodes.length);
    });
  });
  
  describe('Water Pattern (Faraday Waves)', () => {
    test('Should generate water ripple pattern', () => {
      const pattern = calculateWaterPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.width).toBe(512);
      expect(pattern.height).toBe(512);
      expect(pattern.nodes.length).toBeGreaterThan(0);
    });
    
    test('Should have different pattern than Chladni', () => {
      const chladni = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      const water = calculateWaterPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      // Patterns should differ
      let differences = 0;
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (Math.abs(chladni.data[i][j] - water.data[i][j]) > 0.1) {
            differences++;
          }
        }
      }
      
      expect(differences).toBeGreaterThan(50); // Significant differences
    });
  });
  
  describe('Sand Pattern', () => {
    test('Should generate sand accumulation pattern', () => {
      const pattern = calculateSandPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.width).toBe(512);
      expect(pattern.height).toBe(512);
    });
    
    test('Sand should accumulate at nodes (inverse of amplitude)', () => {
      const pattern = calculateSandPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      // Check that high sand density corresponds to low amplitude areas
      let nodeHasSand = 0;
      for (const node of pattern.nodes.slice(0, 100)) {
        const sandDensity = pattern.data[node.x]?.[node.y];
        if (sandDensity !== undefined && sandDensity > 0.5) {
          nodeHasSand++;
        }
      }
      
      expect(nodeHasSand).toBeGreaterThan(50); // Most nodes should have sand
    });
  });
  
  describe('Light Interference Pattern', () => {
    test('Should generate light interference pattern', () => {
      const pattern = calculateLightPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.width).toBe(512);
      expect(pattern.height).toBe(512);
      expect(pattern.nodes.length).toBeGreaterThan(0);
    });
    
    test('Should have intensity values between 0 and 1', () => {
      const pattern = calculateLightPattern(432, DEFAULT_CYMATIC_CONFIG);
      
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          expect(pattern.data[i][j]).toBeGreaterThanOrEqual(0);
          expect(pattern.data[i][j]).toBeLessThanOrEqual(1);
        }
      }
    });
  });
  
  describe('Cymatic Pattern Generation from Bell', () => {
    test('Should generate pattern from infinite precision bell', () => {
      const bell = calculateInfinitePrecisionBell(5.2, 0.08, 0.9);
      const pattern = generateCymaticPattern(bell, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.frequency).toBe(bell.frequency);
      expect(pattern.harmonics).toEqual(bell.harmonics);
      expect(pattern.amplitude).toBe(bell.amplitude);
      expect(pattern.pattern).toMatch(/^(2d|3d|flowing|static)$/);
      expect(pattern.particleCount).toBeGreaterThan(0);
      expect(pattern.colorSpectrum.length).toBeGreaterThan(0);
    });
    
    test('Pattern type should vary with frequency', () => {
      const lowBell = calculateInfinitePrecisionBell(-30, 0.5, 0.5); // ~150 Hz
      const midBell = calculateInfinitePrecisionBell(10, 0.5, 0.5);  // ~515 Hz
      const highBell = calculateInfinitePrecisionBell(50, 0.5, 0.5); // ~849 Hz
      
      const lowPattern = generateCymaticPattern(lowBell, DEFAULT_CYMATIC_CONFIG);
      const midPattern = generateCymaticPattern(midBell, DEFAULT_CYMATIC_CONFIG);
      const highPattern = generateCymaticPattern(highBell, DEFAULT_CYMATIC_CONFIG);
      
      expect(lowPattern.pattern).toBe('static');
      expect(midPattern.pattern).toBe('2d');
      expect(highPattern.pattern).toBe('3d');
    });
    
    test('Particle count should increase with frequency', () => {
      const lowBell = calculateInfinitePrecisionBell(-30, 0.5, 0.5);
      const highBell = calculateInfinitePrecisionBell(50, 0.5, 0.5);
      
      const lowPattern = generateCymaticPattern(lowBell, DEFAULT_CYMATIC_CONFIG);
      const highPattern = generateCymaticPattern(highBell, DEFAULT_CYMATIC_CONFIG);
      
      expect(highPattern.particleCount).toBeGreaterThan(lowPattern.particleCount);
    });
    
    test('Color spectrum should be generated', () => {
      const bell = calculateInfinitePrecisionBell(5.2, 0.08, 0.9);
      const pattern = generateCymaticPattern(bell, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.colorSpectrum.length).toBe(5);
      pattern.colorSpectrum.forEach(color => {
        expect(color).toMatch(/^hsl\(/);
      });
    });
  });
  
  describe('3D Particle System', () => {
    test('Should generate particle system from 2D grid', () => {
      const grid = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      const volume = generateParticleSystem(grid, 1000);
      
      expect(volume.width).toBe(grid.width);
      expect(volume.height).toBe(grid.height);
      expect(volume.depth).toBe(64);
      expect(volume.particles.length).toBe(1000);
    });
    
    test('Particles should have valid properties', () => {
      const grid = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      const volume = generateParticleSystem(grid, 100);
      
      volume.particles.forEach(particle => {
        expect(particle.x).toBeGreaterThanOrEqual(0);
        expect(particle.x).toBeLessThanOrEqual(1);
        expect(particle.y).toBeGreaterThanOrEqual(0);
        expect(particle.y).toBeLessThanOrEqual(1);
        expect(particle.z).toBeGreaterThanOrEqual(0);
        expect(particle.z).toBeLessThanOrEqual(1);
        expect(particle.velocity).toHaveProperty('x');
        expect(particle.velocity).toHaveProperty('y');
        expect(particle.velocity).toHaveProperty('z');
        expect(particle.amplitude).toBeGreaterThanOrEqual(0);
        expect(particle.amplitude).toBeLessThanOrEqual(1);
      });
    });
  });
  
  describe('Three.js Geometry Generation', () => {
    test('Should generate Three.js compatible geometry', () => {
      const grid = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      const geometry = generateThreeJSGeometry(grid);
      
      expect(geometry.vertices).toBeInstanceOf(Float32Array);
      expect(geometry.colors).toBeInstanceOf(Float32Array);
      expect(geometry.indices).toBeInstanceOf(Uint32Array);
    });
    
    test('Vertex count should match grid size', () => {
      const config = { ...DEFAULT_CYMATIC_CONFIG, resolution: 64 };
      const grid = calculateChladniPattern(432, config);
      const geometry = generateThreeJSGeometry(grid);
      
      const expectedVertices = 64 * 64 * 3; // width * height * (x,y,z)
      expect(geometry.vertices.length).toBe(expectedVertices);
    });
    
    test('Colors should match vertices', () => {
      const grid = calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      const geometry = generateThreeJSGeometry(grid);
      
      expect(geometry.colors.length).toBe(geometry.vertices.length);
    });
  });
  
  describe('Animation', () => {
    test('Should animate pattern over time', () => {
      const bell = calculateInfinitePrecisionBell(5.2, 0.08, 0.9);
      const pattern = generateCymaticPattern(bell, DEFAULT_CYMATIC_CONFIG);
      
      const frame1 = animateCymaticPattern(pattern, 0, DEFAULT_CYMATIC_CONFIG);
      const frame2 = animateCymaticPattern(pattern, 1, DEFAULT_CYMATIC_CONFIG);
      
      // Patterns should differ over time
      let differences = 0;
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (Math.abs(frame1.data[i][j] - frame2.data[i][j]) > 0.01) {
            differences++;
          }
        }
      }
      
      expect(differences).toBeGreaterThan(50); // Animation should change pattern
    });
  });
  
  describe('Configuration Options', () => {
    test('Should respect resolution setting', () => {
      const config128 = { ...DEFAULT_CYMATIC_CONFIG, resolution: 128 };
      const config512 = { ...DEFAULT_CYMATIC_CONFIG, resolution: 512 };
      
      const pattern128 = calculateChladniPattern(432, config128);
      const pattern512 = calculateChladniPattern(432, config512);
      
      expect(pattern128.width).toBe(128);
      expect(pattern512.width).toBe(512);
    });
    
    test('Should support different visualization types', () => {
      const bell = calculateInfinitePrecisionBell(5.2, 0.08, 0.9);
      
      const chladniConfig = { ...DEFAULT_CYMATIC_CONFIG, visualizationType: 'chladni' as const };
      const waterConfig = { ...DEFAULT_CYMATIC_CONFIG, visualizationType: 'water' as const };
      
      const chladniPattern = generateCymaticPattern(bell, chladniConfig);
      const waterPattern = generateCymaticPattern(bell, waterConfig);
      
      expect(chladniPattern.soundVisualization).toBe('chladni');
      expect(waterPattern.soundVisualization).toBe('water');
    });
  });
  
  describe('Real-World Scenarios', () => {
    test('Bitcoin crash should create chaotic pattern', () => {
      const crashBell = calculateInfinitePrecisionBell(-35, 0.95, 1.0);
      const pattern = generateCymaticPattern(crashBell, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.frequency).toBeLessThan(300); // Low frequency
      expect(pattern.pattern).toBe('static'); // Simple pattern
    });
    
    test('Bull run should create complex pattern', () => {
      const bullBell = calculateInfinitePrecisionBell(42, 0.35, 0.9);
      const pattern = generateCymaticPattern(bullBell, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.frequency).toBeGreaterThan(700); // High frequency
      expect(pattern.particleCount).toBeGreaterThan(7000); // Many particles
    });
    
    test('Stable market should create balanced pattern', () => {
      const stableBell = calculateInfinitePrecisionBell(0.001, 0.01, 0.3);
      const pattern = generateCymaticPattern(stableBell, DEFAULT_CYMATIC_CONFIG);
      
      expect(pattern.frequency).toBeCloseTo(432, 1); // Near neutral
    });
  });
  
  describe('Performance', () => {
    test('Should generate patterns quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 10; i++) {
        calculateChladniPattern(432, DEFAULT_CYMATIC_CONFIG);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000); // 10 patterns in under 1 second
    });
    
    test('Lower resolution should be faster', () => {
      const configLow = { ...DEFAULT_CYMATIC_CONFIG, resolution: 128 };
      const configHigh = { ...DEFAULT_CYMATIC_CONFIG, resolution: 512 };
      
      const startLow = performance.now();
      calculateChladniPattern(432, configLow);
      const durationLow = performance.now() - startLow;
      
      const startHigh = performance.now();
      calculateChladniPattern(432, configHigh);
      const durationHigh = performance.now() - startHigh;
      
      expect(durationLow).toBeLessThan(durationHigh);
    });
  });
});
