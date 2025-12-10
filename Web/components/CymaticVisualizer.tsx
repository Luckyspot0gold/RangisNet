/**
 * CYMATIC VISUALIZER COMPONENT
 * React component for real-time cymatic pattern visualization
 * 
 * Features:
 * - Canvas 2D rendering (Chladni, water, sand, light patterns)
 * - Real-time pattern generation from market data
 * - Interactive controls (frequency, visualization type, resolution)
 * - Animation support
 * - Side-by-side comparison of different pattern types
 */

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { calculateInfinitePrecisionBell } from '../lib/infinite-precision-bell-system';
import {
  generateCymaticPattern,
  calculateChladniPattern,
  calculateWaterPattern,
  calculateSandPattern,
  calculateLightPattern,
  renderToCanvas2D,
  animateCymaticPattern,
  DEFAULT_CYMATIC_CONFIG,
  type CymaticPattern,
  type CymaticConfig,
  type ChladniGrid
} from '../lib/cymatic-engine';

export default function CymaticVisualizer() {
  const [priceChange, setPriceChange] = useState<number>(0);
  const [volatility, setVolatility] = useState<number>(0.5);
  const [volume, setVolume] = useState<number>(0.5);
  const [visualizationType, setVisualizationType] = useState<'chladni' | 'water' | 'sand' | 'light'>('chladni');
  const [resolution, setResolution] = useState<number>(256);
  const [animate, setAnimate] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  
  // Calculate bell and pattern
  const bell = useMemo(() => 
    calculateInfinitePrecisionBell(priceChange, volatility, volume),
    [priceChange, volatility, volume]
  );
  
  const config: CymaticConfig = useMemo(() => ({
    ...DEFAULT_CYMATIC_CONFIG,
    resolution,
    visualizationType,
    animate
  }), [resolution, visualizationType, animate]);
  
  const cymaticPattern = useMemo(() => 
    generateCymaticPattern(bell, config),
    [bell, config]
  );
  
  // Render cymatic pattern to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const renderFrame = () => {
      let grid: ChladniGrid;
      
      if (animate) {
        const time = (Date.now() - startTimeRef.current) / 1000;
        grid = animateCymaticPattern(cymaticPattern, time, config);
      } else {
        // Static pattern
        switch (visualizationType) {
          case 'water':
            grid = calculateWaterPattern(bell.frequency, config);
            break;
          case 'sand':
            grid = calculateSandPattern(bell.frequency, config);
            break;
          case 'light':
            grid = calculateLightPattern(bell.frequency, config);
            break;
          case 'chladni':
          default:
            grid = calculateChladniPattern(bell.frequency, config);
            break;
        }
      }
      
      renderToCanvas2D(ctx, cymaticPattern, grid, config);
      
      if (animate) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };
    
    renderFrame();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bell, cymaticPattern, config, visualizationType, animate]);
  
  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          🌊 CYMATIC VISUALIZATION ENGINE
        </h1>
        <p className="text-gray-400">
          Phase 2: World's First Economic Cymatics • Patent-Pending
        </p>
        <p className="text-sm text-purple-400 mt-2">
          Reality Protocol LLC • Deterministic Pattern Generation from Market Data
        </p>
      </div>
      
      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Data Controls */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Market Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">
                Price Change: <span className="font-mono text-yellow-400">{priceChange.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.1"
                value={priceChange}
                onChange={(e) => setPriceChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm">
                Volatility: <span className="font-mono text-cyan-400">{(volatility * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volatility}
                onChange={(e) => setVolatility(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm">
                Volume: <span className="font-mono text-green-400">{(volume * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Visualization Controls */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Visualization</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Pattern Type</label>
              <select
                value={visualizationType}
                onChange={(e) => setVisualizationType(e.target.value as any)}
                className="w-full p-2 bg-gray-700 rounded text-white"
              >
                <option value="chladni">Chladni Plate (Classic)</option>
                <option value="water">Water Surface (Faraday)</option>
                <option value="sand">Sand Accumulation</option>
                <option value="light">Light Interference</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">
                Resolution: <span className="font-mono text-purple-400">{resolution}x{resolution}</span>
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(parseInt(e.target.value))}
                className="w-full p-2 bg-gray-700 rounded text-white"
              >
                <option value="128">128 (Fast)</option>
                <option value="256">256 (Balanced)</option>
                <option value="512">512 (High Quality)</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={animate}
                  onChange={(e) => {
                    setAnimate(e.target.checked);
                    startTimeRef.current = Date.now();
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">Animate Pattern</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Frequency Info */}
        <div className="p-6 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg border-2 border-purple-500">
          <h2 className="text-xl font-bold mb-4">Frequency Data</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Frequency:</span>
              <span className="font-mono text-yellow-400">{bell.frequency.toFixed(2)} Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Wavelength:</span>
              <span className="font-mono">{bell.wavelength.toFixed(4)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Musical Note:</span>
              <span className="font-mono">{bell.musicNote}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">State:</span>
              <span className="font-bold">{bell.emotionalState}</span>
            </div>
            <div className="mt-4 p-3 rounded" style={{ backgroundColor: bell.color }}>
              <span className="text-white font-bold drop-shadow-lg">Market Color</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas Display */}
      <div className="mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {visualizationType === 'chladni' && '🎵 Chladni Plate Pattern'}
              {visualizationType === 'water' && '💧 Water Surface Waves'}
              {visualizationType === 'sand' && '⏳ Sand Particle Distribution'}
              {visualizationType === 'light' && '💡 Light Interference Pattern'}
            </h3>
            <div className="text-sm text-gray-400">
              {bell.frequency.toFixed(2)} Hz • {resolution}x{resolution}
            </div>
          </div>
          
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
            />
            {animate && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ● LIVE
              </div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            {visualizationType === 'chladni' && 'White dots = nodes (zero amplitude). Pattern complexity increases with frequency.'}
            {visualizationType === 'water' && 'Faraday waves oscillate at half the driving frequency. Ripples show standing wave patterns.'}
            {visualizationType === 'sand' && 'Sand accumulates at nodes (low vibration areas). Higher density = more sand.'}
            {visualizationType === 'light' && 'Interference pattern from multiple light sources. Bright = constructive, dark = destructive.'}
          </div>
        </div>
      </div>
      
      {/* Pattern Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Pattern Characteristics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-mono">{cymaticPattern.pattern}</span>
            </div>
            <div className="flex justify-between">
              <span>Particles:</span>
              <span className="font-mono">{cymaticPattern.particleCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Harmonics:</span>
              <span className="font-mono">{cymaticPattern.harmonics.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Amplitude:</span>
              <span className="font-mono">{(cymaticPattern.amplitude * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Color Spectrum</h3>
          <div className="space-y-2">
            {cymaticPattern.colorSpectrum.map((color, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-400">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Preset Scenarios */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Preset Scenarios</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => { setPriceChange(-35); setVolatility(0.95); setVolume(1.0); }}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded text-sm font-bold"
          >
            💥 Market Crash
          </button>
          <button
            onClick={() => { setPriceChange(-5); setVolatility(0.25); setVolume(0.4); }}
            className="px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded text-sm font-bold"
          >
            ⚠️ Caution
          </button>
          <button
            onClick={() => { setPriceChange(0); setVolatility(0.05); setVolume(0.5); }}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold"
          >
            😌 Calm
          </button>
          <button
            onClick={() => { setPriceChange(25); setVolatility(0.35); setVolume(0.9); }}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded text-sm font-bold"
          >
            🚀 Bull Run
          </button>
        </div>
      </div>
      
      {/* Physics Explanation */}
      <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg border-2 border-purple-500">
        <h3 className="text-xl font-bold mb-3">🔬 The Science</h3>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Cymatics</strong> is the study of visible sound. When a surface vibrates at specific frequencies, 
            standing wave patterns form, creating geometric shapes.
          </p>
          <p>
            <strong>Chladni Plates</strong> (Ernst Chladni, 1787): Sand on a vibrating plate migrates to nodes 
            (points of zero vibration), revealing the wave pattern.
          </p>
          <p>
            <strong>Our Innovation</strong>: We convert economic data (price changes, volatility) into sound frequencies, 
            then render the cymatic patterns those frequencies would create. This is the <strong>world's first</strong> 
            deterministic cymatic generation from financial derivatives.
          </p>
          <p className="text-purple-300 font-bold">
            Higher frequency = more complex patterns = stronger market movements
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© 2025 Reality Protocol LLC • Patent-Pending (Claim 3: Cymatic Visualization Engine)</p>
        <p>Phase 2 Complete: Cymatic Visualization Engine ✅</p>
        <p className="mt-2 text-purple-400">
          Next: Phase 3 - AI Phonic Learning System 🤖
        </p>
      </div>
    </div>
  );
}
