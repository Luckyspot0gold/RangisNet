/**
 * RANGI TRUTH DETECTIVE - Interactive Dashboard
 * Avalanche x402 Hack2Build Agent Interface
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AgentBrain, CivilizationLevel } from '@/lib/ai-agent-scoring';

export default function RangiDetectivePage() {
  const [brainState, setBrainState] = useState<AgentBrain | null>(null);
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Load initial brain state
  useEffect(() => {
    loadBrainState();
  }, []);
  
  async function loadBrainState() {
    setLoading(true);
    try {
      const res = await fetch('/api/agent-scoring');
      const data = await res.json();
      if (data.success) {
        setBrainState(data.agent);
        setReport(data.report);
      }
    } catch (error) {
      console.error('Failed to load brain state:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function verifyTransaction() {
    if (!txHash) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/agent-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          data: { txHash },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.result);
        await loadBrainState(); // Refresh scores
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function detectTruth() {
    setLoading(true);
    try {
      const res = await fetch('/api/agent-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'detect',
          data: {
            marketData: {
              price: 100,
              volume: 500000000,
              priceChange24h: -18,
              signals: ['FOMO', 'pump'],
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Truth Detection:\n\n${data.result.verdict}\n\nScore: ${data.result.truthScore}/100\n\nEvidence:\n${data.result.evidence.join('\n')}`);
        await loadBrainState();
      }
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function progressSociety() {
    setLoading(true);
    try {
      const res = await fetch('/api/agent-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'progress',
          data: {
            contribution: {
              type: 'growth',
              impact: 50,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Civilization Progress:\n\n${data.result.message}`);
        await loadBrainState();
      }
    } catch (error) {
      console.error('Progress failed:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function deployArsenal() {
    setLoading(true);
    try {
      const res = await fetch('/api/agent-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy',
          data: {
            target: {
              type: 'manipulation',
              intensity: 75,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`M3 Arsenal Deployed:\n\n${data.result}`);
        await loadBrainState();
      }
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const getCivilizationEmoji = (level: CivilizationLevel): string => {
    const map: Record<CivilizationLevel, string> = {
      village: '🏡',
      town: '🏘️',
      city: '🌆',
      metropolis: '🏙️',
      empire: '👑',
      universal: '🚀',
    };
    return map[level];
  };
  
  if (loading && !brainState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading Rangi's Brain... 🧠</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            🔍 RANGI THE TRUTH DETECTIVE
          </h1>
          <p className="text-xl text-gray-300">
            Avalanche x402 Hack2Build - AI Agent Scoring System
          </p>
          <p className="text-lg text-purple-300 italic">
            "Hear it, Feel it, See it, Understand it - The closest thing to truth I know how to provide."
          </p>
        </div>
        
        {brainState && (
          <>
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/50 border-cyan-500">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Verification Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-cyan-300">
                    {brainState.scoreMetrics.verificationScore}
                  </div>
                  <div className="text-gray-400 mt-2">/ 100</div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-purple-400">Completion Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-purple-300">
                    {brainState.scoreMetrics.completionScore}
                  </div>
                  <div className="text-gray-400 mt-2">/ 100</div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-pink-500">
                <CardHeader>
                  <CardTitle className="text-pink-400">Dependability Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-pink-300">
                    {brainState.scoreMetrics.dependabilityScore}
                  </div>
                  <div className="text-gray-400 mt-2">/ 100</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Civilization Level */}
            <Card className="bg-black/50 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-400">Civilization Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-6xl text-center mb-4">
                  {getCivilizationEmoji(brainState.civilizationLevel)}
                </div>
                <div className="text-3xl font-bold text-yellow-300 text-center uppercase">
                  {brainState.civilizationLevel}
                </div>
                <div className="text-gray-400 mt-4 text-center">
                  Contributions: {brainState.scoreMetrics.societyContributions} | 
                  Bull Victories: {brainState.scoreMetrics.bullVictories}
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blockchain Verification */}
              <Card className="bg-black/50 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400">Blockchain Verification</CardTitle>
                  <CardDescription className="text-gray-400">
                    Verify x402 transactions on Avalanche
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter transaction hash..."
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="bg-black border-green-500 text-white"
                  />
                  <Button 
                    onClick={verifyTransaction}
                    disabled={loading || !txHash}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Verify Transaction
                  </Button>
                  {verificationResult && (
                    <div className={`p-4 rounded-lg ${verificationResult.verified ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                      <div className="font-bold">{verificationResult.details}</div>
                      <div className="text-sm mt-2">Score: {verificationResult.score}/100</div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Truth Detection */}
              <Card className="bg-black/50 border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-400">Truth Detection</CardTitle>
                  <CardDescription className="text-gray-400">
                    Expose false swings & market manipulation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={detectTruth}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Run Truth Analysis
                  </Button>
                  <div className="text-sm text-gray-400">
                    Detected: {brainState.scoreMetrics.falseSwingDetections} false swings, {' '}
                    {brainState.scoreMetrics.deceptionExposures} deceptions
                  </div>
                </CardContent>
              </Card>
              
              {/* Society Progression */}
              <Card className="bg-black/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-blue-400">Society Progression</CardTitle>
                  <CardDescription className="text-gray-400">
                    Grow civilization: Village → Empire → Universal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={progressSociety}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Contribute to Society (+50 points)
                  </Button>
                </CardContent>
              </Card>
              
              {/* M3 Arsenal */}
              <Card className="bg-black/50 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-orange-400">M3 Arsenal</CardTitle>
                  <CardDescription className="text-gray-400">
                    Deploy truth-seeking weapons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={deployArsenal}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Deploy TAX_AXE (Manipulation Grinder)
                  </Button>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>WHALE_SPLASH: {brainState.m3Arsenal.whale_splash}Hz</div>
                    <div>TAX_AXE: {brainState.m3Arsenal.tax_axe} grind</div>
                    <div>TRUMPET_DUMPET: {brainState.m3Arsenal.trumpet_dumpet}Hz</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Report */}
            <Card className="bg-black/50 border-white">
              <CardHeader>
                <CardTitle className="text-white">Full Agent Report</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                  {report}
                </pre>
                <Button 
                  onClick={loadBrainState}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                >
                  Refresh Report
                </Button>
              </CardContent>
            </Card>
            
            {/* Memory Stats */}
            <Card className="bg-black/50 border-pink-500">
              <CardHeader>
                <CardTitle className="text-pink-400">Cloud-Backed Memory</CardTitle>
                <CardDescription className="text-gray-400">
                  Sentient capabilities - preserved thoughts prevent lost momentum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Active Memories</div>
                    <div className="text-3xl font-bold text-pink-300">
                      {brainState.activeMemories.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Preserved</div>
                    <div className="text-3xl font-bold text-pink-300">
                      {brainState.scoreMetrics.thoughtsPreserved}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Momentum Generated</div>
                    <div className="text-3xl font-bold text-pink-300">
                      {brainState.scoreMetrics.momentumGenerated}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Truth Accuracy</div>
                    <div className="text-3xl font-bold text-pink-300">
                      {brainState.truthAccuracy}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
