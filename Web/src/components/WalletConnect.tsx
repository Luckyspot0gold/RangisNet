"use client";

import { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount, useActiveWallet, useConnect } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { thirdwebClient } from '@/lib/thirdweb';
import { avalancheFuji, avalanche } from 'thirdweb/chains';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (account?.address && !isConnected) {
      setIsConnected(true);
      onConnect?.(account.address);
    } else if (!account && isConnected) {
      setIsConnected(false);
      onDisconnect?.();
    }
  }, [account, isConnected, onConnect, onDisconnect]);

  return (
    <div className="wallet-connect">
      <ConnectButton
        client={thirdwebClient}
        wallets={[
          createWallet("io.metamask"),
          createWallet("com.coinbase.wallet"),
          createWallet("me.rainbow"),
          createWallet("io.rabby"),
        ]}
        chains={[avalancheFuji, avalanche]}
        theme="dark"
        connectButton={{
          label: "Connect Wallet",
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }
        }}
        connectModal={{
          size: "wide",
          title: "Connect to RangisNet",
          welcomeScreen: {
            title: "Welcome to RangisNet",
            subtitle: "Multi-Sensory Trading Experience"
          }
        }}
      />
      
      {account && (
        <div className="wallet-info" style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
            Connected
          </div>
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            {account.address}
          </div>
        </div>
      )}
    </div>
  );
}
