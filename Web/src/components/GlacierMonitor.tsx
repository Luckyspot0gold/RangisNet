/**
 * Glacier API Monitor Component
 * Real-time blockchain data visualization with haptic feedback
 */

'use client';

import { useEffect, useState } from 'react';
import { glacierStream } from '../avacloud-glacier';

interface HapticEvent {
  intensity: number;
  volatility: number;
  timestamp: number;
}

export default function GlacierMonitor() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastHaptic, setLastHaptic] = useState<HapticEvent | null>(null);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    // Connect to Glacier stream
    glacierStream.connect();
    setIsConnected(glacierStream.getConnectionStatus());

    // Listen for haptic events
    const handleHaptic = (event: CustomEvent<HapticEvent>) => {
      setLastHaptic(event.detail);
      setTransactionCount(prev => prev + 1);
    };

    window.addEventListener('rangis:haptic', handleHaptic as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('rangis:haptic', handleHaptic as EventListener);
      glacierStream.disconnect();
    };
  }, []);

  return (
    <div className="glacier-monitor bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">🌊 Glacier Stream</h3>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm text-purple-200">Transactions</div>
          <div className="text-3xl font-bold">{transactionCount}</div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm text-purple-200">Status</div>
          <div className="text-lg font-semibold">
            {isConnected ? '✅ Live' : '🔌 Disconnected'}
          </div>
        </div>
      </div>

      {lastHaptic && (
        <div className="mt-4 bg-white/5 rounded-lg p-4">
          <div className="text-sm text-purple-200 mb-2">Last Haptic Event</div>
          <div className="space-y-1 text-sm">
            <div>Intensity: {(lastHaptic.intensity * 100).toFixed(2)}%</div>
            <div>Volatility: {lastHaptic.volatility.toFixed(2)}%</div>
            <div>Time: {new Date(lastHaptic.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-purple-300">
        🎵 432 Hz Resonance Engine Active
      </div>
    </div>
  );
}
