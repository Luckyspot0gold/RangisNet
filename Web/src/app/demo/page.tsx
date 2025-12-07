'use client';

/**
 * RangisNet Demo Page
 * Complete integration showcase for Hack2Build submission
 */

import { useState } from 'react';
import { executeCompleteTrade, runDemo } from '@/complete-integration';
import { mightyAgent } from '@/mighty-agent';

export default function DemoPage() {
  const [isTrading, setIsTrading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);

  const handleTrade = async () => {
    setIsTrading(true);
    setResult(null);

    try {
      const tradeResult = await executeCompleteTrade('AVAX/USD', 50, 42.50);
      setResult(tradeResult);
      
      // Update agent status
      const status = mightyAgent.getStatus();
      setAgentStatus(status);
    } catch (error) {
      console.error('Trade error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTrading(false);
    }
  };

  const handleDemoMode = async () => {
    setIsTrading(true);
    const demoResult = await runDemo();
    setResult(demoResult);
    setIsTrading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          🌈 RangisNet Mighty Agent
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Feel Before Send - Complete Integration Demo
        </p>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <FeatureCard icon="💰" title="x402 Payment" desc="$0.01 micropayments" />
          <FeatureCard icon="🤖" title="Polly Agent" desc="AI-powered decisions" />
          <FeatureCard icon="🌉" title="ICM Warp" desc="Cross-chain messaging" />
          <FeatureCard icon="♿" title="Accessible" desc="ARIA + Voice + Haptics" />
        </div>

        {/* Demo Controls */}
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            🎬 Demo Controls
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleTrade}
              disabled={isTrading}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: isTrading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: isTrading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isTrading) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isTrading ? '⏳ Trading...' : '🚀 Execute Trade'}
            </button>

            <button
              onClick={handleDemoMode}
              disabled={isTrading}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#667eea',
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                cursor: isTrading ? 'not-allowed' : 'pointer',
              }}
            >
              🎥 Run Full Demo
            </button>
          </div>

          <p style={{ marginTop: '1rem', color: '#718096', fontSize: '0.875rem' }}>
            💡 Tip: Open browser console to see detailed logs
          </p>
        </div>

        {/* Results */}
        {result && (
          <div style={{
            background: result.success ? '#f0fff4' : '#fff5f5',
            border: `2px solid ${result.success ? '#68d391' : '#fc8181'}`,
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: result.success ? '#22543d' : '#742a2a',
              marginBottom: '1rem',
            }}>
              {result.success ? '✅ Trade Successful' : '❌ Trade Failed'}
            </h3>
            
            <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
              <p><strong>Agent Decision:</strong> {result.agentDecision}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
              {result.payment?.txHash && (
                <p><strong>TX Hash:</strong> {result.payment.txHash.slice(0, 10)}...{result.payment.txHash.slice(-8)}</p>
              )}
              {result.error && (
                <p style={{ color: '#c53030' }}><strong>Error:</strong> {result.error}</p>
              )}
            </div>
          </div>
        )}

        {/* Agent Status */}
        {agentStatus && (
          <div style={{
            background: '#edf2f7',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              🤖 Agent Status
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
              <p><strong>Trades Executed:</strong> {agentStatus.tradesExecuted}</p>
              <p><strong>Weekly Limit:</strong> ${agentStatus.limits.current_week} / ${agentStatus.limits.weekly}</p>
              <p><strong>Monthly Limit:</strong> ${agentStatus.limits.current_month} / ${agentStatus.limits.monthly}</p>
              <p><strong>Yearly Limit:</strong> ${agentStatus.limits.current_year} / ${agentStatus.limits.yearly}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#718096',
          fontSize: '0.875rem',
        }}>
          <p>🏆 Hack2Build x402 Submission - December 2025</p>
          <p>Patent-Protected • Layer 1.5 • Avalanche Powered</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#667eea';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e2e8f0';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: '#718096' }}>{desc}</div>
    </div>
  );
}
