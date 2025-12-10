"use client";

import { useState, useEffect, useRef } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { thirdwebClient } from '@/lib/thirdweb';
import WalletConnect from '@/components/WalletConnect';
import AssetVisualization from '@/components/AssetVisualization';
import TransactionFeedback from '@/components/TransactionFeedback';
import { useWalletAssets } from '@/hooks/useWalletAssets';
import { HarmonicAudio } from '@/components/harmonicaudio';

interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  amount: number;
  symbol: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

function WalletDashboard() {
  const { assets, loading, error, refetch } = useWalletAssets();
  const [selectedAsset, setSelectedAsset] = useState<string>();
  const [activeTransaction, setActiveTransaction] = useState<Transaction>();
  const [totalValue, setTotalValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const audioRef = useRef<HarmonicAudio>();

  useEffect(() => {
    audioRef.current = new HarmonicAudio();
    audioRef.current.init();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      const total = assets.reduce((sum, asset) => sum + asset.value, 0);
      setTotalValue(total);

      // Calculate weighted average price change
      const weightedChange = assets.reduce((sum, asset) => {
        const weight = asset.value / total;
        return sum + (asset.priceChange24h * weight);
      }, 0);
      setPortfolioChange(weightedChange);

      // Play sound based on portfolio performance
      const frequency = 432 + (weightedChange * 10);
      const intensity = Math.min(1, Math.abs(weightedChange) / 10);
      const amps = [
        1 - intensity,
        Math.max(0, (-weightedChange) / 10),
        1 - intensity,
        intensity,
        intensity * 0.8,
        intensity * 0.6,
        Math.min(1, Math.abs(weightedChange) / 8)
      ];
      audioRef.current?.update(frequency, 0.5 + weightedChange / 20, amps);
    }
  }, [assets]);

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    const asset = assets.find(a => a.symbol === symbol);
    
    if (asset && audioRef.current) {
      // Play unique sound for selected asset
      const frequency = 432 + (asset.priceChange24h * 10);
      const intensity = Math.min(1, Math.abs(asset.priceChange24h) / 10);
      audioRef.current.update(frequency, 0.7, [intensity, intensity, intensity, intensity, intensity, intensity, intensity]);
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const handleTransactionComplete = () => {
    setActiveTransaction(undefined);
    refetch(); // Refresh assets after transaction
  };

  // Mock transaction for demo (you can connect real transactions later)
  const simulateTransaction = () => {
    const mockTx: Transaction = {
      hash: '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0'),
      type: 'send',
      amount: 1.5,
      symbol: 'AVAX',
      status: 'pending',
      timestamp: Date.now()
    };
    setActiveTransaction(mockTx);

    // Simulate confirmation after 3 seconds
    setTimeout(() => {
      setActiveTransaction(prev => prev ? { ...prev, status: 'confirmed' } : undefined);
    }, 3000);
  };

  const getPerformanceColor = () => {
    if (portfolioChange > 5) return '#00ff88';
    if (portfolioChange > 0) return '#88ff88';
    if (portfolioChange < -5) return '#ff0088';
    if (portfolioChange < 0) return '#ff8888';
    return '#8888ff';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
      color: 'white',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '20px',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(102, 126, 234, 0.3)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            RangisNet Wallet
          </h1>
          <p style={{ opacity: 0.7, fontSize: '14px' }}>
            Multi-Sensory Trading Experience
          </p>
        </div>
        <WalletConnect />
      </header>

      {/* Portfolio Summary */}
      {assets.length > 0 && (
        <div style={{
          padding: '32px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '16px',
          border: `1px solid ${getPerformanceColor()}40`,
          marginBottom: '32px',
          boxShadow: `0 8px 32px ${getPerformanceColor()}20`
        }}>
          <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>
            Total Portfolio Value
          </div>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            ${totalValue.toFixed(2)}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '18px',
            color: getPerformanceColor()
          }}>
            <span>{portfolioChange > 0 ? '▲' : '▼'}</span>
            <span>{Math.abs(portfolioChange).toFixed(2)}%</span>
            <span style={{ opacity: 0.7, fontSize: '14px' }}>24h</span>
          </div>
        </div>
      )}

      {/* 3D Asset Visualization */}
      {assets.length > 0 ? (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            fontWeight: 600 
          }}>
            Your Assets (3D View)
          </h2>
          <AssetVisualization
            assets={assets}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
          />
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            opacity: 0.8
          }}>
            💡 <strong>Tip:</strong> Click and drag to rotate • Scroll to zoom • Click spheres to hear their resonance
          </div>
        </div>
      ) : (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          border: '1px dashed rgba(102, 126, 234, 0.3)'
        }}>
          {loading ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p style={{ fontSize: '18px', opacity: 0.7 }}>Loading your assets...</p>
            </div>
          ) : error ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <p style={{ fontSize: '18px', opacity: 0.7 }}>{error}</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👛</div>
              <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '8px' }}>
                Connect your wallet to see your assets
              </p>
              <p style={{ fontSize: '14px', opacity: 0.5 }}>
                Experience multi-sensory visualization of your portfolio
              </p>
            </div>
          )}
        </div>
      )}

      {/* Asset Details */}
      {selectedAsset && assets.length > 0 && (
        <div style={{
          padding: '24px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          marginBottom: '32px'
        }}>
          {(() => {
            const asset = assets.find(a => a.symbol === selectedAsset);
            if (!asset) return null;

            return (
              <>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
                  {asset.name} ({asset.symbol})
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                      Balance
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>
                      {asset.balance.toFixed(6)} {asset.symbol}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                      Value
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>
                      ${asset.value.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                      24h Change
                    </div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 600,
                      color: asset.priceChange24h > 0 ? '#00ff88' : '#ff0088'
                    }}>
                      {asset.priceChange24h > 0 ? '+' : ''}
                      {asset.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                      Resonance Score
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>
                      {((asset.resonanceScore || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Demo Transaction Button */}
      {assets.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={simulateTransaction}
            disabled={!!activeTransaction}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              background: activeTransaction 
                ? 'rgba(102, 126, 234, 0.3)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: activeTransaction ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: activeTransaction ? 0.5 : 1
            }}
          >
            {activeTransaction ? 'Transaction in Progress...' : 'Demo Transaction'}
          </button>
          <p style={{ 
            fontSize: '12px', 
            opacity: 0.5, 
            marginTop: '8px' 
          }}>
            Test the multi-sensory transaction experience
          </p>
        </div>
      )}

      {/* Transaction Feedback */}
      {activeTransaction && (
        <TransactionFeedback
          transaction={activeTransaction}
          onComplete={handleTransactionComplete}
        />
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <ThirdwebProvider>
      <WalletDashboard />
    </ThirdwebProvider>
  );
}
