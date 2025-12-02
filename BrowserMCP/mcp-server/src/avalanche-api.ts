/**
 * Avalanche Data API Integration
 * Official multi-chain indexer for C-Chain, DFK L1, Fuji testnet, and more
 * API Docs: https://data-api.avax.network/docs
 * 
 * Features:
 * - Real-time/historical transaction data
 * - Balance queries across chains
 * - NFT indexing
 * - Webhooks for events
 * - Teleporter for cross-chain messaging
 * - 15-minute refresh rate
 * - No auth required for basic queries
 */

import axios from 'axios';

const AVALANCHE_DATA_API_BASE = 'https://data-api.avax.network/v1';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ChainData {
  chainId: string;
  chainName: string;
  networkToken: {
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  rpcUrl?: string;
}

export interface ChainBalance {
  chainId: string;
  chainName: string;
  balance: string;
  balanceUSD?: number;
  tokenSymbol: string;
}

export interface TransactionData {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: 'success' | 'failed';
}

export interface NFTData {
  tokenId: string;
  contractAddress: string;
  name: string;
  imageUrl?: string;
  chainId: string;
}

export interface MultiChainAnalysis {
  address: string;
  chains: ChainData[];
  balances: ChainBalance[];
  totalValueUSD: number;
  recentTransactions: TransactionData[];
  nfts: NFTData[];
  activityScore: number; // 0-1 score based on recent activity
}

// ============================================================================
// Core API Functions
// ============================================================================

/**
 * Fetch all chains where an address has activity
 */
export async function fetchAvalancheChains(address: string): Promise<ChainData[]> {
  try {
    const response = await axios.get(
      `${AVALANCHE_DATA_API_BASE}/address/${address}/chains`,
      {
        headers: { 'accept': 'application/json' }
      }
    );
    
    return response.data.indexedChains || [];
  } catch (error) {
    console.error('Avalanche API - Chains Error:', error);
    return [];
  }
}

/**
 * Fetch balances across all chains for an address
 */
export async function fetchChainBalances(address: string): Promise<ChainBalance[]> {
  try {
    const response = await axios.get(
      `${AVALANCHE_DATA_API_BASE}/address/${address}/balances`,
      {
        headers: { 'accept': 'application/json' }
      }
    );
    
    return response.data.balances || [];
  } catch (error) {
    console.error('Avalanche API - Balances Error:', error);
    return [];
  }
}

/**
 * Fetch recent transactions for an address on a specific chain
 */
export async function fetchRecentTransactions(
  address: string,
  chainId: string,
  limit: number = 10
): Promise<TransactionData[]> {
  try {
    const response = await axios.get(
      `${AVALANCHE_DATA_API_BASE}/address/${address}/transactions`,
      {
        params: { chainId, limit },
        headers: { 'accept': 'application/json' }
      }
    );
    
    return response.data.transactions || [];
  } catch (error) {
    console.error('Avalanche API - Transactions Error:', error);
    return [];
  }
}

/**
 * Fetch NFTs owned by an address across chains
 */
export async function fetchNFTs(address: string): Promise<NFTData[]> {
  try {
    const response = await axios.get(
      `${AVALANCHE_DATA_API_BASE}/address/${address}/nfts`,
      {
        headers: { 'accept': 'application/json' }
      }
    );
    
    return response.data.nfts || [];
  } catch (error) {
    console.error('Avalanche API - NFTs Error:', error);
    return [];
  }
}

// ============================================================================
// Enhanced Multi-Chain Analysis
// ============================================================================

/**
 * Comprehensive multi-chain analysis for PTE integration
 */
export async function analyzeMultiChainActivity(
  address: string
): Promise<MultiChainAnalysis> {
  try {
    // Fetch all data in parallel
    const [chains, balances, nfts] = await Promise.all([
      fetchAvalancheChains(address),
      fetchChainBalances(address),
      fetchNFTs(address)
    ]);

    // Filter to mainnet chains only (exclude testnets for production)
    const mainnetChains = chains.filter(chain => !chain.isTestnet);

    // Calculate total USD value
    const totalValueUSD = balances.reduce(
      (sum, balance) => sum + (balance.balanceUSD || 0),
      0
    );

    // Fetch recent transactions from C-Chain (primary chain)
    const cChainId = '43114'; // Avalanche C-Chain
    const recentTransactions = await fetchRecentTransactions(address, cChainId, 5);

    // Calculate activity score (0-1) based on recent transactions
    const activityScore = calculateActivityScore(recentTransactions, balances);

    return {
      address,
      chains: mainnetChains,
      balances,
      totalValueUSD,
      recentTransactions,
      nfts,
      activityScore
    };
  } catch (error) {
    console.error('Multi-Chain Analysis Error:', error);
    throw error;
  }
}

/**
 * Calculate activity score based on transaction frequency and balance
 */
function calculateActivityScore(
  transactions: TransactionData[],
  balances: ChainBalance[]
): number {
  // Base score from transaction count (0-0.5)
  const txScore = Math.min(transactions.length / 10, 0.5);

  // Balance score (0-0.5)
  const totalBalance = balances.reduce(
    (sum, b) => sum + (b.balanceUSD || 0),
    0
  );
  const balanceScore = Math.min(totalBalance / 10000, 0.5);

  return txScore + balanceScore;
}

// ============================================================================
// DFK Gaming Subnet Integration
// ============================================================================

const DFK_CHAIN_ID = '53935'; // DFK Subnet (DeFi Kingdoms)
const DFK_TOKEN_SYMBOL = 'JEWEL';

/**
 * Fetch DFK gaming subnet specific data
 */
export async function analyzeDFKActivity(address: string) {
  try {
    const [balances, transactions] = await Promise.all([
      fetchChainBalances(address),
      fetchRecentTransactions(address, DFK_CHAIN_ID, 10)
    ]);

    // Filter for DFK chain
    const dfkBalance = balances.find(b => b.chainId === DFK_CHAIN_ID);

    return {
      chainId: DFK_CHAIN_ID,
      tokenSymbol: DFK_TOKEN_SYMBOL,
      balance: dfkBalance?.balance || '0',
      balanceUSD: dfkBalance?.balanceUSD || 0,
      recentTransactions: transactions,
      isActive: transactions.length > 0,
      gamingScore: calculateGamingScore(transactions, dfkBalance)
    };
  } catch (error) {
    console.error('DFK Analysis Error:', error);
    return null;
  }
}

/**
 * Calculate gaming activity score for DFK
 */
function calculateGamingScore(
  transactions: TransactionData[],
  balance?: ChainBalance
): number {
  const txFrequency = transactions.length / 10; // Normalize to 0-1
  const balanceWeight = balance ? Math.min((balance.balanceUSD || 0) / 1000, 1) : 0;
  return (txFrequency * 0.6) + (balanceWeight * 0.4);
}

// ============================================================================
// PTE Integration Helpers
// ============================================================================

/**
 * Convert multi-chain data into PTE-compatible market metrics
 */
export function convertToMarketMetrics(analysis: MultiChainAnalysis) {
  return {
    // Volume delta based on total USD value and activity
    volume_delta: analysis.totalValueUSD * analysis.activityScore,
    
    // Chain diversity as a sentiment indicator
    sentiment: Math.min(analysis.chains.length / 5, 1),
    
    // Activity score as volatility proxy
    volatility: analysis.activityScore,
    
    // NFT ownership as additional signal
    nft_count: analysis.nfts.length,
    
    // Transaction success rate
    success_rate: calculateSuccessRate(analysis.recentTransactions)
  };
}

/**
 * Calculate transaction success rate
 */
function calculateSuccessRate(transactions: TransactionData[]): number {
  if (transactions.length === 0) return 0;
  
  const successful = transactions.filter(tx => tx.status === 'success').length;
  return successful / transactions.length;
}

// ============================================================================
// Export All
// ============================================================================

export default {
  fetchAvalancheChains,
  fetchChainBalances,
  fetchRecentTransactions,
  fetchNFTs,
  analyzeMultiChainActivity,
  analyzeDFKActivity,
  convertToMarketMetrics
};
