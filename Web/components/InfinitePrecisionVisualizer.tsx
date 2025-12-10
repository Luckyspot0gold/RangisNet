/**
 * INFINITE PRECISION BELL VISUALIZER
 * Interactive demo component for Phase 1
 * 
 * Features:
 * - Real-time frequency spectrum visualization
 * - Full-spectrum color gradient display
 * - Live price change → frequency mapping
 * - Wavelength and harmonic display
 * - Musical note identification
 * - Side-by-side comparison: 7 discrete vs infinite precision
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  calculateInfinitePrecisionBell,
  generateFullSpectrum,
  INFINITE_BELL_CONSTANTS,
  type InfinitePrecisionBell
} from '../lib/infinite-precision-bell-system';
import { calculateActiveBell, SEVEN_BELLS } from '../lib/seven-bell-system';

export default function InfinitePrecisionVisualizer() {
  const [priceChange, setPriceChange] = useState<number>(0);
  const [volatility, setVolatility] = useState<number>(0.5);
  const [volume, setVolume] = useState<number>(0.5);
  const [infiniteBell, setInfiniteBell] = useState<InfinitePrecisionBell | null>(null);
  const [discreteBell, setDiscreteBell] = useState<any>(null);
  
  // Generate full spectrum once
  const fullSpectrum = useMemo(() => generateFullSpectrum(256), []);
  
  // Update bells when inputs change
  useEffect(() => {
    const newInfiniteBell = calculateInfinitePrecisionBell(priceChange, volatility, volume);
    const newDiscreteBell = calculateActiveBell(priceChange, volatility, volume);
    
    setInfiniteBell(newInfiniteBell);
    setDiscreteBell(newDiscreteBell);
  }, [priceChange, volatility, volume]);
  
  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          🌌 INFINITE PRECISION BELL SYSTEM
        </h1>
        <p className="text-gray-400">
          Phase 1: Continuous Frequency Mapping • 16M+ Colors • 0.0000000001% Precision
        </p>
        <p className="text-sm text-purple-400 mt-2">
          Reality Protocol LLC • Patent-Pending
        </p>
      </div>
      
      {/* Control Panel */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Control Panel</h2>
        
        <div className="space-y-6">
          {/* Price Change Slider */}
          <div>
            <label className="block mb-2">
              Price Change: <span className="font-mono text-yellow-400">{priceChange.toFixed(10)}%</span>
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              step="0.0000000001"
              value={priceChange}
              onChange={(e) => setPriceChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-100% (Crash)</span>
              <span>0% (Neutral)</span>
              <span>+100% (Euphoria)</span>
            </div>
          </div>
          
          {/* Volatility Slider */}
          <div>
            <label className="block mb-2">
              Volatility: <span className="font-mono text-cyan-400">{(volatility * 100).toFixed(1)}%</span>
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
          
          {/* Volume Slider */}
          <div>
            <label className="block mb-2">
              Volume: <span className="font-mono text-green-400">{(volume * 100).toFixed(1)}%</span>
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
          
          {/* Preset Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPriceChange(-23.5)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Crash (-23.5%)
            </button>
            <button
              onClick={() => setPriceChange(-0.001)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded"
            >
              Stable (-0.001%)
            </button>
            <button
              onClick={() => setPriceChange(0)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Neutral (0%)
            </button>
            <button
              onClick={() => setPriceChange(3.14159265)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Pi Gain (+π%)
            </button>
            <button
              onClick={() => setPriceChange(42.0)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              Euphoria (+42%)
            </button>
          </div>
        </div>
      </div>
      
      {/* Comparison: Discrete vs Infinite */}
      {infiniteBell && discreteBell && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Discrete Bell (Old System) */}
          <div className="p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-400">
              ⚠️ OLD: 7 Discrete Bells
            </h3>
            <div
              className="w-full h-32 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: discreteBell.hexColor }}
            >
              {discreteBell.frequency} Hz
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Bell:</strong> {discreteBell.name} (#{discreteBell.id})</p>
              <p><strong>Color:</strong> {discreteBell.color}</p>
              <p><strong>State:</strong> {discreteBell.emotionalState}</p>
              <p><strong>Condition:</strong> {discreteBell.marketCondition}</p>
              <p className="text-red-400"><strong>Limitation:</strong> Only 7 fixed frequencies</p>
            </div>
          </div>
          
          {/* Infinite Precision Bell (New System) */}
          <div className="p-6 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg border-2 border-purple-500">
            <h3 className="text-xl font-bold mb-4">
              ✨ NEW: Infinite Precision
            </h3>
            <div
              className="w-full h-32 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold shadow-xl"
              style={{ backgroundColor: infiniteBell.color }}
            >
              {infiniteBell.frequency.toFixed(10)} Hz
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Frequency:</strong> {infiniteBell.frequency.toFixed(10)} Hz</p>
              <p><strong>Wavelength:</strong> {infiniteBell.wavelength.toFixed(6)} m</p>
              <p><strong>Musical Note:</strong> {infiniteBell.musicNote} ({infiniteBell.musicCents > 0 ? '+' : ''}{infiniteBell.musicCents} cents)</p>
              <p><strong>Color (RGB):</strong> ({infiniteBell.rgb.r}, {infiniteBell.rgb.g}, {infiniteBell.rgb.b})</p>
              <p><strong>Waveform:</strong> {infiniteBell.waveform}</p>
              <p><strong>State:</strong> {infiniteBell.emotionalState}</p>
              <p className="text-green-400"><strong>Precision:</strong> 10 decimal places</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Frequency Spectrum Visualization */}
      {infiniteBell && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Frequency Spectrum</h3>
          <div className="relative w-full h-24 rounded-lg overflow-hidden">
            {/* Full spectrum gradient */}
            <div className="absolute inset-0 flex">
              {fullSpectrum.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Current frequency indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{
                left: `${((infiniteBell.frequency - INFINITE_BELL_CONSTANTS.MIN_FREQUENCY) / 
                         (INFINITE_BELL_CONSTANTS.MAX_FREQUENCY - INFINITE_BELL_CONSTANTS.MIN_FREQUENCY)) * 100}%`
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
                {infiniteBell.frequency.toFixed(2)} Hz
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>86 Hz (Panic)</span>
            <span>432 Hz (Neutral)</span>
            <span>1266 Hz (Euphoria)</span>
          </div>
        </div>
      )}
      
      {/* Harmonics Visualization */}
      {infiniteBell && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Harmonic Overtones</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-yellow-400 font-bold w-32">Fundamental:</span>
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: infiniteBell.color, width: '100%' }} />
              <span className="font-mono">{infiniteBell.frequency.toFixed(2)} Hz</span>
            </div>
            {infiniteBell.harmonics.map((harmonic, i) => {
              const harmonicBell = calculateInfinitePrecisionBell(
                ((harmonic - INFINITE_BELL_CONSTANTS.BASE_FREQUENCY) / 
                 (INFINITE_BELL_CONSTANTS.MAX_FREQUENCY - INFINITE_BELL_CONSTANTS.BASE_FREQUENCY)) * 100,
                volatility,
                volume
              );
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-gray-400 w-32">Harmonic {i + 2}:</span>
                  <div className="flex-1 h-6 rounded" style={{ 
                    backgroundColor: harmonicBell.color,
                    width: `${100 / (i + 2)}%`
                  }} />
                  <span className="font-mono text-sm">{harmonic.toFixed(2)} Hz</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Technical Details */}
      {infiniteBell && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Technical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Frequency Data</h4>
              <p>Frequency: {infiniteBell.frequency.toFixed(10)} Hz</p>
              <p>Wavelength: {infiniteBell.wavelength.toFixed(8)} m</p>
              <p>Phase: {infiniteBell.phase.toFixed(3)} rad</p>
              <p>Amplitude: {infiniteBell.amplitude.toFixed(3)}</p>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-2">Color Data</h4>
              <p>Hex: {infiniteBell.hexColor}</p>
              <p>RGB: ({infiniteBell.rgb.r}, {infiniteBell.rgb.g}, {infiniteBell.rgb.b})</p>
              <p>HSL: {infiniteBell.color}</p>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-2">Market Data</h4>
              <p>Price Change: {infiniteBell.priceChangePercent.toFixed(10)}%</p>
              <p>Market State: {infiniteBell.marketState}</p>
              <p>Emotional State: {infiniteBell.emotionalState}</p>
              <p>Waveform: {infiniteBell.waveform}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© 2025 Reality Protocol LLC • Patent-Pending</p>
        <p>Phase 1 Complete: Infinite Precision Core ✅</p>
        <p className="mt-2 text-purple-400">
          Next: Phase 2 - Cymatic Visualization Engine 🌊
        </p>
      </div>
    </div>
  );
}
