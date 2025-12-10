"use client";

/**
 * RangisHeartbeat.com - Multi-Sensory Financial Cognition Platform
 * 3D+ Spinor, Bloch Sphere, and Torus visualizations
 * 7-Bell harmonic system with real-time market data
 */

import { useEffect, useState } from 'react';
import RangisHeartbeat from '@/components/RangisHeartbeat';
import type { AggregatedMarketData } from '@/lib/api-aggregator';

export default function HeartbeatPage() {
  const [marketData, setMarketData] = useState<AggregatedMarketData | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visualizationMode, setVisualizationMode] = useState<'spinor' | 'bloch' | 'torus' | 'all'>('all');
  const [enableAudio, setEnableAudio] = useState(false);
  const [enableHaptics, setEnableHaptics] = useState(false);

  // Fetch market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/market-data/${selectedSymbol}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMarketData(data);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Use mock data for demo
        setMarketData({
          symbol: selectedSymbol,
          price: 42000 + Math.random() * 1000,
          volume24h: 25e9 + Math.random() * 5e9,
          priceChange24h: (Math.random() - 0.5) * 20,
          timestamp: Date.now(),
          sources: ['mock'],
          confidence: 0.8
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Update every 5 seconds
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Popular crypto symbols
  const symbols = [
    'BTC', 'ETH', 'AVAX', 'SOL', 'MATIC', 'BNB', 'ADA', 'DOT', 'LINK', 'UNI'
  ];

  if (loading && !marketData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-2xl">Loading RangisHeartbeat...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {marketData && (
        <RangisHeartbeat
          marketData={marketData}
          enableAudio={enableAudio}
          enableHaptics={enableHaptics}
          visualizationMode={visualizationMode}
        />
      )}
      
      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/70 p-4 rounded-lg text-white max-w-xs">
        <h3 className="text-xl font-bold mb-4">Controls</h3>
        
        {/* Symbol Selector */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full bg-gray-800 text-white rounded px-3 py-2"
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
        
        {/* Visualization Mode */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Visualization</label>
          <select
            value={visualizationMode}
            onChange={(e) => setVisualizationMode(e.target.value as any)}
            className="w-full bg-gray-800 text-white rounded px-3 py-2"
          >
            <option value="all">All (Spinor + Bloch + Torus)</option>
            <option value="spinor">Spinor Only</option>
            <option value="bloch">Bloch Sphere Only</option>
            <option value="torus">Torus Only</option>
          </select>
        </div>
        
        {/* Audio Toggle */}
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableAudio}
              onChange={(e) => setEnableAudio(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable Audio (7-Bell System)</span>
          </label>
        </div>
        
        {/* Haptics Toggle */}
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableHaptics}
              onChange={(e) => setEnableHaptics(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable Haptic Feedback</span>
          </label>
        </div>
        
        {/* Status */}
        {error && (
          <div className="mt-4 p-2 bg-red-900/50 rounded text-xs">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <p className="mt-2 text-yellow-300">Using demo data</p>
          </div>
        )}
        
        {marketData && (
          <div className="mt-4 p-2 bg-green-900/30 rounded text-xs">
            <p className="font-bold">Status: Live</p>
            <p>Sources: {marketData.sources.join(', ')}</p>
            <p>Confidence: {(marketData.confidence * 100).toFixed(0)}%</p>
            <p>Last Update: {new Date(marketData.timestamp).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
      
      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-4 rounded-lg text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-bold text-sm mb-2">🎵 Spinor (Left)</h4>
            <p className="text-xs">Y-axis needle shows current price with harmonic color mapping. Spiral path traces price history with 7-Bell frequency divisions.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2">🌐 Bloch Sphere (Center)</h4>
            <p className="text-xs">Latitude grid: Bell frequencies (86Hz to 1266Hz). Longitude grid: Market Volume divisions. State vector shows market momentum.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2">🍩 Torus (Right)</h4>
            <p className="text-xs">Inner core twists with volatility. Sparkle particles show Fear & Greed index. Color morphs through 7-Bell spectrum.</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            RangisHeartbeat.com | Patent-Pending Multi-Sensory Financial Cognition System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by Reality Protocol LLC | 432Hz Base Frequency
          </p>
        </div>
      </div>
    </div>
  );
}
