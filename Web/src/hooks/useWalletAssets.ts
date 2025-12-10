"use client";

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  priceChange24h: number;
  resonanceScore?: number;
  contractAddress?: string;
}

export function useWalletAssets() {
  const account = useActiveAccount();
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setAssets([]);
      return;
    }

    fetchAssets();
    const interval = setInterval(fetchAssets, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [account?.address]);

  const fetchAssets = async () => {
    if (!account?.address) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch native AVAX balance
      const nativeBalance = await fetchNativeBalance(account.address);
      
      // Fetch token balances (you can add more tokens here)
      const tokens = ['BTC', 'ETH', 'USDC', 'USDT'];
      const tokenBalances = await Promise.allSettled(
        tokens.map(symbol => fetchTokenData(symbol, account.address))
      );

      const allAssets: WalletAsset[] = [nativeBalance];

      tokenBalances.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allAssets.push(result.value);
        }
      });

      // Fetch resonance scores from your PRM API
      const assetsWithResonance = await Promise.all(
        allAssets.map(async (asset) => {
          try {
            const response = await fetch(`/api/market-data/${asset.symbol}`);
            if (response.ok) {
              const data = await response.json();
              return {
                ...asset,
                resonanceScore: data.data?.prmAnalysis?.metadata?.resonanceScore || 0.5,
                priceChange24h: data.data?.marketData?.priceChange24h || 0
              };
            }
          } catch (err) {
            console.error(`Failed to fetch resonance for ${asset.symbol}:`, err);
          }
          return asset;
        })
      );

      setAssets(assetsWithResonance.filter(a => a.balance > 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  return { assets, loading, error, refetch: fetchAssets };
}

async function fetchNativeBalance(address: string): Promise<WalletAsset> {
  try {
    // Fetch AVAX price
    const priceResponse = await fetch('/api/market-data/AVAX');
    const priceData = await priceResponse.json();
    const price = priceData.data?.marketData?.price || 0;
    const priceChange = priceData.data?.marketData?.priceChange24h || 0;

    // In production, fetch actual balance from RPC
    // For now, using mock data
    const balance = 10.5; // Mock balance

    return {
      symbol: 'AVAX',
      name: 'Avalanche',
      balance,
      value: balance * price,
      priceChange24h: priceChange
    };
  } catch (error) {
    console.error('Error fetching native balance:', error);
    return {
      symbol: 'AVAX',
      name: 'Avalanche',
      balance: 0,
      value: 0,
      priceChange24h: 0
    };
  }
}

async function fetchTokenData(symbol: string, address: string): Promise<WalletAsset | null> {
  try {
    // Fetch token price and market data
    const response = await fetch(`/api/market-data/${symbol}`);
    if (!response.ok) return null;

    const data = await response.json();
    const price = data.data?.marketData?.price || 0;
    const priceChange = data.data?.marketData?.priceChange24h || 0;

    // In production, fetch actual token balance from contract
    // For now, using mock data
    const mockBalances: Record<string, number> = {
      BTC: 0.05,
      ETH: 0.5,
      USDC: 1000,
      USDT: 500
    };

    const balance = mockBalances[symbol] || 0;

    return {
      symbol,
      name: symbol,
      balance,
      value: balance * price,
      priceChange24h: priceChange
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    return null;
  }
}
