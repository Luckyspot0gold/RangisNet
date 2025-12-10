"use client";

import { useEffect, useState } from 'react';
import { HarmonicAudio } from './harmonicaudio';

interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  amount: number;
  symbol: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

interface TransactionFeedbackProps {
  transaction: Transaction;
  onComplete?: () => void;
}

export default function TransactionFeedback({ 
  transaction, 
  onComplete 
}: TransactionFeedbackProps) {
  const [progress, setProgress] = useState(0);
  const [audio] = useState(() => new HarmonicAudio());

  useEffect(() => {
    audio.init();
    
    // Play sound based on transaction type
    if (transaction.status === 'pending') {
      // Rising frequency for pending
      audio.update(432, 0.5, [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
      triggerHaptic('pending');
    } else if (transaction.status === 'confirmed') {
      // High frequency success tone
      audio.update(540, 0.8, [1, 0.8, 0.6, 0.4, 0.2, 0.1, 0]);
      triggerHaptic('success');
    } else if (transaction.status === 'failed') {
      // Low frequency warning
      audio.update(324, 0.6, [1, 0, 1, 0, 1, 0, 1]);
      triggerHaptic('error');
    }

    // Simulate progress for pending transactions
    if (transaction.status === 'pending') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + 5, 95);
          return next;
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (transaction.status === 'confirmed') {
      setProgress(100);
      setTimeout(() => onComplete?.(), 2000);
    }
  }, [transaction.status, audio, onComplete]);

  const triggerHaptic = (type: 'pending' | 'success' | 'error') => {
    if (!navigator.vibrate) return;

    const patterns = {
      pending: [50, 100, 50, 100, 50],
      success: [100, 50, 100, 50, 200],
      error: [200, 100, 200, 100, 200]
    };

    navigator.vibrate(patterns[type]);
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#00ff88';
      case 'failed': return '#ff0088';
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'failed': return '❌';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '360px',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.95)',
      borderRadius: '16px',
      border: `2px solid ${getStatusColor()}`,
      boxShadow: `0 8px 32px ${getStatusColor()}40`,
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '32px' }}>{getStatusIcon()}</span>
        <div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 600,
            color: getStatusColor()
          }}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span>{transaction.amount} {transaction.symbol}</span>
          <span style={{ opacity: 0.7 }}>
            {new Date(transaction.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        <div style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          opacity: 0.5,
          wordBreak: 'break-all'
        }}>
          {transaction.hash}
        </div>
      </div>

      {transaction.status === 'pending' && (
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: getStatusColor(),
            transition: 'width 0.5s ease',
            boxShadow: `0 0 10px ${getStatusColor()}`
          }} />
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
