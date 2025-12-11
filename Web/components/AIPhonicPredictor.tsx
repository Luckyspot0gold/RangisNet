/**
 * AI Phonic Predictor Component
 * 
 * Interactive interface for AI-powered market predictions using sonic pattern analysis.
 * Shows real-time predictions, confidence levels, pattern explanations, and voice announcements.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  calculateInfinitePrecisionBell,
  type InfinitePrecisionBell 
} from '@/lib/infinite-precision-bell-system';
import {
  createAIPhonicSystem,
  predictFromBell,
  generateVoiceAnnouncement,
  calculateRiskScore,
  type AIPhonicPrediction,
  type AIModelState,
  type PatternClass
} from '@/lib/ai-phonic-learning-system';

// ============================================================================
// COMPONENT
// ============================================================================

export default function AIPhonicPredictor() {
  // Market data state
  const [priceChange, setPriceChange] = useState<number>(5.2);
  const [volatility, setVolatility] = useState<number>(0.08);
  const [volume, setVolume] = useState<number>(0.9);
  const [asset, setAsset] = useState<string>('BTC');
  
  // AI state
  const [prediction, setPrediction] = useState<AIPhonicPrediction | null>(null);
  const [modelState, setModelState] = useState<AIModelState | null>(null);
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  
  // System reference
  const aiSystem = useRef(createAIPhonicSystem());
  
  // Initialize
  useEffect(() => {
    updatePrediction();
    setModelState(aiSystem.current.getModelState());
  }, []);
  
  // Update prediction when inputs change
  const updatePrediction = useCallback(() => {
    const bell = calculateInfinitePrecisionBell(priceChange, volatility, volume);
    const pred = predictFromBell(bell, aiSystem.current, asset);
    setPrediction(pred);
    
    // Speak if voice enabled and urgent
    if (voiceEnabled && pred.voice?.shouldSpeak) {
      speakPrediction(pred);
    }
  }, [priceChange, volatility, volume, asset, voiceEnabled]);
  
  // Speak prediction using Web Speech API
  const speakPrediction = (pred: AIPhonicPrediction) => {
    if ('speechSynthesis' in window && pred.voice) {
      const utterance = new SpeechSynthesisUtterance(pred.voice.text);
      utterance.rate = pred.voice.urgency >= 8 ? 1.2 : 1.0;
      utterance.pitch = pred.voice.urgency >= 8 ? 1.3 : 1.0;
      utterance.volume = Math.min(1, pred.voice.urgency / 10);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Simulate learning from outcome
  const simulateLearning = () => {
    if (!prediction) return;
    
    setIsLearning(true);
    
    setTimeout(() => {
      // Simulate market outcome (random for demo)
      const actualChange = priceChange + (Math.random() - 0.5) * 10;
      const outcome = {
        signatureId: `sig_${Date.now()}`,
        priceChange: actualChange,
        timeHorizon: 4,
        direction: actualChange > 0 ? 'up' as const : actualChange < 0 ? 'down' as const : 'stable' as const,
        volatility: volatility,
        timestamp: Date.now()
      };
      
      // Observe outcome and learn
      aiSystem.current.observeOutcome(
        prediction.signature,
        outcome,
        prediction
      );
      
      // Update model state
      setModelState(aiSystem.current.getModelState());
      setIsLearning(false);
      
      // Show notification
      alert(`AI learned from outcome! Model accuracy: ${(aiSystem.current.getModelState().overallAccuracy * 100).toFixed(1)}%`);
    }, 1500);
  };
  
  // Preset scenarios
  const presets = [
    { name: 'Crash', price: -35, vol: 0.25, vol2: 1.2, asset: 'BTC' },
    { name: 'Caution', price: -8, vol: 0.12, vol2: 0.8, asset: 'ETH' },
    { name: 'Neutral', price: 0, vol: 0.05, vol2: 0.5, asset: 'BTC' },
    { name: 'Bull', price: 15, vol: 0.08, vol2: 1.1, asset: 'SOL' },
    { name: 'Euphoria', price: 42, vol: 0.18, vol2: 1.5, asset: 'BTC' }
  ];
  
  const applyPreset = (preset: typeof presets[0]) => {
    setPriceChange(preset.price);
    setVolatility(preset.vol);
    setVolume(preset.vol2);
    setAsset(preset.asset);
    setTimeout(updatePrediction, 100);
  };
  
  // Get pattern color
  const getPatternColor = (pattern: PatternClass): string => {
    switch (pattern) {
      case 'crash': return 'text-red-600 bg-red-50';
      case 'caution': return 'text-orange-600 bg-orange-50';
      case 'neutral': return 'text-yellow-600 bg-yellow-50';
      case 'bull': return 'text-green-600 bg-green-50';
      case 'euphoria': return 'text-purple-600 bg-purple-50';
    }
  };
  
  // Get direction color
  const getDirectionColor = (direction: string): string => {
    if (direction === 'BUY') return 'text-green-600 bg-green-100';
    if (direction === 'SELL') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };
  
  const riskScore = prediction ? calculateRiskScore(prediction) : 0;
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🤖 AI Phonic Predictor</h1>
        <p className="text-blue-100">
          Neural network learns from sonic patterns to predict market outcomes
        </p>
      </div>
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">Market Data Input</h2>
        
        {/* Asset selector */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Asset: {asset}
          </label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="AVAX">Avalanche (AVAX)</option>
          </select>
        </div>
        
        {/* Price change slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Price Change: {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.1"
            value={priceChange}
            onChange={(e) => setPriceChange(parseFloat(e.target.value))}
            onMouseUp={updatePrediction}
            onTouchEnd={updatePrediction}
            className="w-full"
          />
        </div>
        
        {/* Volatility slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Volatility: {(volatility * 100).toFixed(1)}%
          </label>
          <input
            type="range"
            min="0.01"
            max="0.30"
            step="0.01"
            value={volatility}
            onChange={(e) => setVolatility(parseFloat(e.target.value))}
            onMouseUp={updatePrediction}
            onTouchEnd={updatePrediction}
            className="w-full"
          />
        </div>
        
        {/* Volume slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Volume: {volume.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            onMouseUp={updatePrediction}
            onTouchEnd={updatePrediction}
            className="w-full"
          />
        </div>
        
        {/* Preset scenarios */}
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
        
        {/* Voice toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="voice"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="voice" className="text-sm">
            🔊 Enable voice announcements (high urgency only)
          </label>
        </div>
      </div>
      
      {/* Prediction Display */}
      {prediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Prediction */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">📊 Prediction</h2>
            
            {/* Direction */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Recommendation</div>
              <div className={`text-4xl font-bold py-3 px-4 rounded-lg text-center ${getDirectionColor(prediction.prediction.direction)}`}>
                {prediction.prediction.direction}
              </div>
            </div>
            
            {/* Confidence */}
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Confidence: {(prediction.prediction.confidence * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${prediction.prediction.confidence * 100}%` }}
                />
              </div>
            </div>
            
            {/* Expected change */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Expected Change</div>
                <div className={`text-2xl font-bold ${prediction.prediction.expectedChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {prediction.prediction.expectedChange > 0 ? '+' : ''}{prediction.prediction.expectedChange.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Time Horizon</div>
                <div className="text-2xl font-bold text-gray-800">
                  {prediction.prediction.timeHorizon}h
                </div>
              </div>
            </div>
            
            {/* Risk level */}
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Risk Level: {prediction.prediction.riskLevel.toUpperCase()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    riskScore > 70 ? 'bg-red-600' : 
                    riskScore > 40 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Risk Score: {riskScore.toFixed(0)}/100
              </div>
            </div>
          </div>
          
          {/* Right: Explanation */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">🧠 AI Analysis</h2>
            
            {/* Pattern class */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Detected Pattern</div>
              <div className={`text-2xl font-bold py-2 px-4 rounded-lg text-center ${getPatternColor(prediction.explanation.pattern)}`}>
                {prediction.explanation.pattern.toUpperCase()}
              </div>
            </div>
            
            {/* Reasoning */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Reasoning</div>
              <div className="text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                {prediction.explanation.reasoning}
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Historical Accuracy</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(prediction.explanation.historicalAccuracy * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Similar Cases</div>
                <div className="text-2xl font-bold text-blue-600">
                  {prediction.explanation.similarCases}
                </div>
              </div>
            </div>
            
            {/* Frequency signature */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Frequency Signature</div>
              <div className="bg-gray-50 p-3 rounded space-y-1 text-xs">
                <div>Frequency: {prediction.signature.frequency.toFixed(2)} Hz</div>
                <div>Wavelength: {prediction.signature.wavelength.toFixed(4)} m</div>
                <div>Complexity: {prediction.signature.complexity.toFixed(0)}/100</div>
                <div>Harmonics: {prediction.signature.harmonics.map(h => h.toFixed(0)).join(', ')} Hz</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Voice output */}
      {prediction?.voice?.text && (
        <div className={`p-4 rounded-lg shadow-md ${prediction.voice.shouldSpeak ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {prediction.voice.shouldSpeak ? '🔊' : '💬'}
            </span>
            <h3 className="font-semibold">
              {prediction.voice.shouldSpeak ? 'Voice Announcement' : 'AI Message'}
            </h3>
            {prediction.voice.shouldSpeak && (
              <span className="ml-auto text-sm text-yellow-700">
                Urgency: {prediction.voice.urgency}/10
              </span>
            )}
          </div>
          <div className="text-sm bg-white p-3 rounded">
            {prediction.voice.text}
          </div>
        </div>
      )}
      
      {/* Model state */}
      {modelState && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📈 Model Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Training Pairs</div>
              <div className="text-2xl font-bold text-blue-600">
                {modelState.trainingPairs}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Predictions</div>
              <div className="text-2xl font-bold text-blue-600">
                {modelState.totalPredictions}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Correct Predictions</div>
              <div className="text-2xl font-bold text-green-600">
                {modelState.correctPredictions}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
              <div className="text-2xl font-bold text-purple-600">
                {(modelState.overallAccuracy * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* Pattern library */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Pattern</th>
                  <th className="p-2 text-right">Observations</th>
                  <th className="p-2 text-right">Accuracy</th>
                  <th className="p-2 text-right">Avg Outcome</th>
                </tr>
              </thead>
              <tbody>
                {modelState.patternLibrary.map((pattern) => (
                  <tr key={pattern.class} className="border-t">
                    <td className={`p-2 font-medium ${getPatternColor(pattern.class)}`}>
                      {pattern.class.toUpperCase()}
                    </td>
                    <td className="p-2 text-right">{pattern.observations}</td>
                    <td className="p-2 text-right">{(pattern.accuracy * 100).toFixed(0)}%</td>
                    <td className={`p-2 text-right font-bold ${pattern.averageOutcome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pattern.averageOutcome > 0 ? '+' : ''}{pattern.averageOutcome.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Learning button */}
          <div className="mt-4">
            <button
              onClick={simulateLearning}
              disabled={isLearning || !prediction}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {isLearning ? '🧠 Learning...' : '🎓 Simulate Learning (Observe Outcome)'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click to simulate the AI observing a market outcome and learning from it
            </p>
          </div>
        </div>
      )}
      
      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <h3 className="font-semibold mb-2">How AI Phonic Learning Works:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Analyzes frequency signatures from market data (86-1266+ Hz)</li>
          <li>Classifies patterns into 5 categories (crash, caution, neutral, bull, euphoria)</li>
          <li>Predicts outcomes using neural network trained on historical patterns</li>
          <li>Learns recursively by observing actual outcomes and adjusting weights</li>
          <li>Provides verbal explanations and voice announcements for high-urgency signals</li>
          <li>Improves accuracy over time through continuous learning</li>
        </ul>
      </div>
    </div>
  );
}
