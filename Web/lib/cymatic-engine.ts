/**
 * CYMATIC VISUALIZATION ENGINE
 * Reality Protocol LLC - Patent-Pending (Claim 3: Cymatic Visualization Engine)
 * 
 * World's first deterministic cymatic generation from economic derivatives
 * Converts market frequencies into visible geometric patterns
 * 
 * Physics basis:
 * - Chladni plate vibrations (Ernst Chladni, 1787)
 * - Standing wave patterns
 * - Faraday wave equations
 * - Bessel function approximations
 * 
 * @author Justin McCrea (@Rainbowsandgold)
 * @company Reality Protocol LLC (EIN: 39-3754298)
 * @date December 10, 2025
 */

import type { InfinitePrecisionBell } from './infinite-precision-bell-system';

/**
 * Cymatic Pattern Types
 */
export interface CymaticPattern {
  frequency: number;           // Base frequency in Hz
  harmonics: number[];        // Harmonic overtones
  amplitude: number;          // 0-1 (volume/intensity)
  pattern: '2d' | '3d' | 'flowing' | 'static';
  particleCount: number;      // Number of particles for rendering
  colorSpectrum: string[];    // Color gradient for visualization
  soundVisualization: 'chladni' | 'water' | 'sand' | 'light';
}

/**
 * 2D Grid for Chladni patterns
 */
export interface ChladniGrid {
  width: number;
  height: number;
  data: number[][];           // Amplitude at each point (-1 to 1)
  nodes: Array<{ x: number; y: number }>; // Zero-crossing points (nodes)
  antiNodes: Array<{ x: number; y: number }>; // Maximum amplitude points
}

/**
 * 3D Volume for water/sand simulations
 */
export interface CymaticVolume {
  width: number;
  height: number;
  depth: number;
  data: number[][][];         // 3D amplitude field
  particles: Array<{
    x: number;
    y: number;
    z: number;
    velocity: { x: number; y: number; z: number };
    amplitude: number;
  }>;
}

/**
 * Visualization configuration
 */
export interface CymaticConfig {
  resolution: number;         // Grid resolution (e.g., 256, 512, 1024)
  plateSize: number;          // Physical size in meters (e.g., 0.3 for 30cm)
  damping: number;           // Damping factor (0-1)
  speedOfSound: number;      // m/s (343 for air at 20°C)
  materialDensity: number;   // kg/m³ (affects wave propagation)
  visualizationType: 'chladni' | 'water' | 'sand' | 'light';
  animate: boolean;          // Static or animated
  colorMode: 'frequency' | 'amplitude' | 'gradient';
}

/**
 * Default configuration
 */
export const DEFAULT_CYMATIC_CONFIG: CymaticConfig = {
  resolution: 512,
  plateSize: 0.3,           // 30cm square plate
  damping: 0.02,            // 2% damping
  speedOfSound: 343,        // Air at 20°C
  materialDensity: 7850,    // Steel (kg/m³)
  visualizationType: 'chladni',
  animate: false,
  colorMode: 'frequency'
};

/**
 * CORE FUNCTION: Calculate Chladni Plate Pattern
 * 
 * Simulates standing wave patterns on a vibrating plate
 * Uses simplified Chladni equation with Bessel function approximation
 * 
 * Physics:
 * - Standing waves form at specific frequencies (resonant modes)
 * - Nodes (zero amplitude) form geometric patterns
 * - Anti-nodes (maximum amplitude) alternate with nodes
 * - Pattern complexity increases with frequency
 * 
 * @param frequency - Vibration frequency in Hz
 * @param config - Visualization configuration
 * @returns ChladniGrid with amplitude values and node/anti-node locations
 */
export function calculateChladniPattern(
  frequency: number,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): ChladniGrid {
  const { resolution, plateSize, speedOfSound, damping } = config;
  
  // Calculate wavelength
  const wavelength = speedOfSound / frequency;
  const waveNumber = (2 * Math.PI) / wavelength;
  
  // Initialize grid
  const grid: number[][] = Array(resolution).fill(0).map(() => Array(resolution).fill(0));
  const nodes: Array<{ x: number; y: number }> = [];
  const antiNodes: Array<{ x: number; y: number }> = [];
  
  // Mode numbers (affect pattern complexity)
  const modeM = Math.floor(frequency / 100); // Horizontal mode
  const modeN = Math.floor(frequency / 120); // Vertical mode
  
  // Calculate amplitude at each point
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // Convert pixel coordinates to physical coordinates (-plateSize/2 to +plateSize/2)
      const x = ((i / resolution) - 0.5) * plateSize;
      const y = ((j / resolution) - 0.5) * plateSize;
      
      // Distance from center
      const r = Math.sqrt(x * x + y * y);
      
      // Angle from center
      const theta = Math.atan2(y, x);
      
      // Chladni equation (simplified with Bessel function approximation)
      // Real Chladni uses: cos(mθ) × J_n(kr) where J_n is Bessel function
      // Approximation: Use oscillating radial component
      const angularComponent = Math.cos(modeM * theta) * Math.sin(modeN * theta);
      const radialComponent = Math.sin(waveNumber * r) * Math.exp(-damping * r);
      
      // Combined amplitude
      let amplitude = angularComponent * radialComponent;
      
      // Add boundary conditions (plate edges are fixed)
      if (r > plateSize / 2) {
        amplitude = 0;
      }
      
      grid[i][j] = amplitude;
      
      // Detect nodes (near-zero amplitude)
      if (Math.abs(amplitude) < 0.05 && r < plateSize / 2) {
        nodes.push({ x: i, y: j });
      }
      
      // Detect anti-nodes (maximum amplitude)
      if (Math.abs(amplitude) > 0.95 && r < plateSize / 2) {
        antiNodes.push({ x: i, y: j });
      }
    }
  }
  
  return {
    width: resolution,
    height: resolution,
    data: grid,
    nodes,
    antiNodes
  };
}

/**
 * Calculate water surface ripple pattern (Faraday waves)
 * 
 * Simulates water surface oscillations driven by vertical vibration
 * Based on Faraday instability (1831)
 * 
 * @param frequency - Driving frequency in Hz
 * @param config - Visualization configuration
 * @returns ChladniGrid with wave heights
 */
export function calculateWaterPattern(
  frequency: number,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): ChladniGrid {
  const { resolution, plateSize, damping } = config;
  
  // Water wave speed (gravity waves): v = √(gλ/2π)
  const gravity = 9.81; // m/s²
  
  // Faraday waves oscillate at half the driving frequency
  const waveFrequency = frequency / 2;
  const wavelength = Math.sqrt((gravity * 2 * Math.PI) / (2 * Math.PI * waveFrequency));
  const waveNumber = (2 * Math.PI) / wavelength;
  
  const grid: number[][] = Array(resolution).fill(0).map(() => Array(resolution).fill(0));
  const nodes: Array<{ x: number; y: number }> = [];
  const antiNodes: Array<{ x: number; y: number }> = [];
  
  // Calculate wave height at each point
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = ((i / resolution) - 0.5) * plateSize;
      const y = ((j / resolution) - 0.5) * plateSize;
      const r = Math.sqrt(x * x + y * y);
      
      // Multiple wave sources create interference patterns
      const wave1 = Math.sin(waveNumber * x) * Math.exp(-damping * Math.abs(x));
      const wave2 = Math.sin(waveNumber * y) * Math.exp(-damping * Math.abs(y));
      const wave3 = Math.cos(waveNumber * r) * Math.exp(-damping * r);
      
      // Combined wave height
      const amplitude = (wave1 + wave2 + wave3) / 3;
      
      grid[i][j] = amplitude;
      
      if (Math.abs(amplitude) < 0.05) {
        nodes.push({ x: i, y: j });
      }
      if (Math.abs(amplitude) > 0.9) {
        antiNodes.push({ x: i, y: j });
      }
    }
  }
  
  return {
    width: resolution,
    height: resolution,
    data: grid,
    nodes,
    antiNodes
  };
}

/**
 * Calculate sand particle distribution pattern
 * 
 * Simulates how sand accumulates at nodes (zero-vibration points)
 * Sand particles migrate away from anti-nodes toward nodes
 * 
 * @param frequency - Vibration frequency in Hz
 * @param config - Visualization configuration
 * @returns ChladniGrid with sand density distribution
 */
export function calculateSandPattern(
  frequency: number,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): ChladniGrid {
  // Calculate base Chladni pattern
  const basePattern = calculateChladniPattern(frequency, config);
  const { resolution } = config;
  
  // Sand accumulates at nodes (inverse of amplitude)
  const sandGrid: number[][] = Array(resolution).fill(0).map(() => Array(resolution).fill(0));
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // High amplitude → low sand density
      // Low amplitude (nodes) → high sand density
      const amplitude = basePattern.data[i][j];
      const sandDensity = 1 - Math.abs(amplitude);
      
      // Apply threshold (sand only sticks at very low amplitudes)
      sandGrid[i][j] = sandDensity > 0.85 ? sandDensity : 0;
    }
  }
  
  return {
    width: resolution,
    height: resolution,
    data: sandGrid,
    nodes: basePattern.nodes,
    antiNodes: basePattern.antiNodes
  };
}

/**
 * Calculate light interference pattern
 * 
 * Simulates interference patterns similar to double-slit experiment
 * Creates wave-like light patterns
 * 
 * @param frequency - Wave frequency in Hz (conceptual - light waves much faster)
 * @param config - Visualization configuration
 * @returns ChladniGrid with intensity distribution
 */
export function calculateLightPattern(
  frequency: number,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): ChladniGrid {
  const { resolution, plateSize } = config;
  
  // Use frequency as a seed for pattern variation
  const wavelengthFactor = 100 / frequency; // Inverse relationship
  
  const grid: number[][] = Array(resolution).fill(0).map(() => Array(resolution).fill(0));
  const nodes: Array<{ x: number; y: number }> = [];
  const antiNodes: Array<{ x: number; y: number }> = [];
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = ((i / resolution) - 0.5) * plateSize;
      const y = ((j / resolution) - 0.5) * plateSize;
      
      // Multiple light sources create interference
      const source1 = { x: -plateSize / 4, y: 0 };
      const source2 = { x: plateSize / 4, y: 0 };
      
      const dist1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
      const dist2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);
      
      // Path difference creates interference
      const pathDiff = dist2 - dist1;
      const phase = (2 * Math.PI * pathDiff) / wavelengthFactor;
      
      // Constructive/destructive interference
      const intensity = Math.pow(Math.cos(phase), 2);
      
      grid[i][j] = intensity;
      
      if (intensity < 0.1) {
        nodes.push({ x: i, y: j });
      }
      if (intensity > 0.9) {
        antiNodes.push({ x: i, y: j });
      }
    }
  }
  
  return {
    width: resolution,
    height: resolution,
    data: grid,
    nodes,
    antiNodes
  };
}

/**
 * Generate 3D particle system for animated cymatics
 * 
 * Creates particles that follow the cymatic field
 * Used for 3D visualizations (Three.js, WebGL)
 * 
 * @param pattern - Base 2D cymatic pattern
 * @param particleCount - Number of particles to generate
 * @returns CymaticVolume with 3D particle positions
 */
export function generateParticleSystem(
  pattern: ChladniGrid,
  particleCount: number = 10000
): CymaticVolume {
  const { width, height, data } = pattern;
  const depth = 64; // Z-axis resolution
  
  // Initialize 3D volume
  const volume: number[][][] = Array(width).fill(0).map(() =>
    Array(height).fill(0).map(() => Array(depth).fill(0))
  );
  
  // Generate particles
  const particles: CymaticVolume['particles'] = [];
  
  for (let n = 0; n < particleCount; n++) {
    // Random position in 2D plane
    const i = Math.floor(Math.random() * width);
    const j = Math.floor(Math.random() * height);
    
    // Get amplitude at this position
    const amplitude = data[i][j];
    
    // Z position based on amplitude (particles rise/fall based on vibration)
    const z = (amplitude + 1) * (depth / 2); // Map -1..1 to 0..depth
    
    // Velocity perpendicular to surface (vertical oscillation)
    const velocity = {
      x: 0,
      y: 0,
      z: amplitude * 5 // Oscillate vertically
    };
    
    particles.push({
      x: i / width,
      y: j / height,
      z: z / depth,
      velocity,
      amplitude: Math.abs(amplitude)
    });
    
    // Populate volume grid
    const zi = Math.floor(z);
    if (zi >= 0 && zi < depth) {
      volume[i][j][zi] = amplitude;
    }
  }
  
  return {
    width,
    height,
    depth,
    data: volume,
    particles
  };
}

/**
 * MAIN FUNCTION: Generate cymatic pattern from infinite precision bell
 * 
 * Converts economic frequency to visual cymatic pattern
 * 
 * @param bell - Infinite precision bell configuration
 * @param config - Visualization configuration
 * @returns CymaticPattern with rendering data
 */
export function generateCymaticPattern(
  bell: InfinitePrecisionBell,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): CymaticPattern {
  const { frequency, harmonics, amplitude, color } = bell;
  
  // Select pattern type based on frequency range
  let pattern: '2d' | '3d' | 'flowing' | 'static';
  if (frequency < 200) {
    pattern = 'static'; // Low frequency = simple, stable patterns
  } else if (frequency < 500) {
    pattern = '2d'; // Mid frequency = 2D geometric patterns
  } else if (frequency < 900) {
    pattern = '3d'; // High frequency = complex 3D structures
  } else {
    pattern = 'flowing'; // Very high = flowing, animated patterns
  }
  
  // Generate color spectrum (gradient from base color)
  const colorSpectrum = generateColorSpectrum(color, 5);
  
  // Determine particle count based on complexity
  const particleCount = Math.floor(1000 + (frequency - 86) * 10);
  
  return {
    frequency,
    harmonics,
    amplitude,
    pattern,
    particleCount,
    colorSpectrum,
    soundVisualization: config.visualizationType
  };
}

/**
 * Generate color spectrum gradient
 * 
 * @param baseColor - Base HSL color string
 * @param steps - Number of gradient steps
 * @returns Array of color strings
 */
function generateColorSpectrum(baseColor: string, steps: number): string[] {
  // Parse HSL string: "hsl(140, 90%, 50%)"
  const match = baseColor.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
  if (!match) return [baseColor];
  
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);
  
  const spectrum: string[] = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    // Vary lightness for gradient
    const newL = l + (ratio - 0.5) * 30; // ±15% lightness variation
    spectrum.push(`hsl(${h}, ${s}%, ${Math.max(10, Math.min(90, newL))}%)`);
  }
  
  return spectrum;
}

/**
 * Render cymatic pattern to Canvas 2D context
 * 
 * @param ctx - Canvas 2D rendering context
 * @param pattern - Cymatic pattern data
 * @param grid - Calculated grid data
 * @param config - Visualization configuration
 */
export function renderToCanvas2D(
  ctx: CanvasRenderingContext2D,
  pattern: CymaticPattern,
  grid: ChladniGrid,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): void {
  const { width, height, data } = grid;
  const canvas = ctx.canvas;
  
  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Calculate scale
  const scaleX = canvas.width / width;
  const scaleY = canvas.height / height;
  
  // Create image data
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const amplitude = data[i][j];
      
      // Map amplitude to color intensity
      const intensity = (amplitude + 1) / 2; // Map -1..1 to 0..1
      const colorIndex = Math.floor(intensity * (pattern.colorSpectrum.length - 1));
      const color = pattern.colorSpectrum[colorIndex];
      
      // Parse color to RGB
      const rgb = parseHSLColor(color);
      
      // Set pixel
      const canvasX = Math.floor(i * scaleX);
      const canvasY = Math.floor(j * scaleY);
      const pixelIndex = (canvasY * canvas.width + canvasX) * 4;
      
      imageData.data[pixelIndex] = rgb.r;
      imageData.data[pixelIndex + 1] = rgb.g;
      imageData.data[pixelIndex + 2] = rgb.b;
      imageData.data[pixelIndex + 3] = Math.floor(intensity * 255);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Draw nodes as white dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (const node of grid.nodes.slice(0, 1000)) { // Limit for performance
    const x = node.x * scaleX;
    const y = node.y * scaleY;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * Helper: Parse HSL color to RGB
 */
function parseHSLColor(hslString: string): { r: number; g: number; b: number } {
  const match = hslString.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
  if (!match) return { r: 0, g: 0, b: 0 };
  
  const h = parseFloat(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Export utilities for Three.js integration
 */
export function generateThreeJSGeometry(grid: ChladniGrid): {
  vertices: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
} {
  const { width, height, data } = grid;
  const vertexCount = width * height;
  
  const vertices = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const indices: number[] = [];
  
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = i * height + j;
      const amplitude = data[i][j];
      
      // Position (x, y, z)
      vertices[index * 3] = (i / width - 0.5) * 2;     // x: -1 to 1
      vertices[index * 3 + 1] = (j / height - 0.5) * 2; // y: -1 to 1
      vertices[index * 3 + 2] = amplitude * 0.5;        // z: height based on amplitude
      
      // Color (r, g, b)
      const intensity = (amplitude + 1) / 2;
      colors[index * 3] = intensity;
      colors[index * 3 + 1] = intensity;
      colors[index * 3 + 2] = 1 - intensity;
      
      // Indices for triangles
      if (i < width - 1 && j < height - 1) {
        const topLeft = index;
        const topRight = index + 1;
        const bottomLeft = index + height;
        const bottomRight = index + height + 1;
        
        indices.push(topLeft, bottomLeft, topRight);
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
  }
  
  return {
    vertices,
    colors,
    indices: new Uint32Array(indices)
  };
}

/**
 * Animate cymatic pattern over time
 * 
 * @param pattern - Base cymatic pattern
 * @param time - Time in seconds
 * @returns Animated grid
 */
export function animateCymaticPattern(
  pattern: CymaticPattern,
  time: number,
  config: CymaticConfig = DEFAULT_CYMATIC_CONFIG
): ChladniGrid {
  // Modulate frequency over time for animation
  const modulatedFrequency = pattern.frequency * (1 + 0.05 * Math.sin(time * 2));
  
  // Regenerate pattern with modulated frequency
  switch (pattern.soundVisualization) {
    case 'water':
      return calculateWaterPattern(modulatedFrequency, config);
    case 'sand':
      return calculateSandPattern(modulatedFrequency, config);
    case 'light':
      return calculateLightPattern(modulatedFrequency, config);
    case 'chladni':
    default:
      return calculateChladniPattern(modulatedFrequency, config);
  }
}
