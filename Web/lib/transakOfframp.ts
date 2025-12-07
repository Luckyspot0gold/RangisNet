/**
 * Transak Off-Ramp Integration for RangisNet
 * Enables users to cash out crypto → bank account
 * 
 * Submission: Avalanche Hack2Build x402 Competition
 * Date: December 7, 2025
 */

import { ethers } from 'ethers';

// Transak SDK types
interface TransakConfig {
  apiKey: string;
  environment: 'STAGING' | 'PRODUCTION';
  themeColor?: string;
  cryptoCurrencyCode: string;
  fiatCurrency: string;
  network: string;
  walletAddress: string;
  email?: string;
  disableWalletAddressForm?: boolean;
  isFeeCalculationHidden?: boolean;
  exchangeScreenTitle?: string;
}

interface OfframpResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  orderId: string;
  transactionHash?: string;
  estimatedTime?: string;
  fiatAmount?: number;
  bankAccount?: string;
}

/**
 * Initialize Transak SDK for off-ramp (crypto → fiat)
 */
export function initTransakOfframp(config: TransakConfig): any {
  // @ts-ignore - Transak SDK loaded via CDN
  const transak = new window.TransakSDK({
    apiKey: config.apiKey,
    environment: config.environment,
    themeColor: config.themeColor || '432111', // Harmonic brand color
    
    // Crypto details
    cryptoCurrencyCode: config.cryptoCurrencyCode, // USDC, AVAX, etc.
    network: config.network, // 'avalanche'
    walletAddress: config.walletAddress,
    
    // Fiat details
    fiatCurrency: config.fiatCurrency, // USD, EUR, etc.
    
    // UI settings
    disableWalletAddressForm: config.disableWalletAddressForm ?? true,
    isFeeCalculationHidden: config.isFeeCalculationHidden ?? false,
    exchangeScreenTitle: config.exchangeScreenTitle || 'Cash Out to Bank',
    
    // User details
    email: config.email,
  });
  
  return transak;
}

/**
 * Cash out USDC to bank account via Transak
 * @param walletAddress User's wallet address
 * @param amount Amount of USDC to cash out
 * @param fiatCurrency Target fiat currency (USD, EUR, etc.)
 * @returns Promise resolving to off-ramp result
 */
export async function cashOutToBank(
  walletAddress: string,
  amount: number,
  fiatCurrency: string = 'USD',
  email?: string
): Promise<OfframpResult> {
  return new Promise((resolve, reject) => {
    const transak = initTransakOfframp({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || 'demo-key',
      environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'STAGING',
      cryptoCurrencyCode: 'USDC',
      fiatCurrency: fiatCurrency,
      network: 'avalanche',
      walletAddress: walletAddress,
      email: email,
      disableWalletAddressForm: true,
      exchangeScreenTitle: `Cash Out ${amount} USDC`,
    });
    
    // Listen for events
    transak.on(transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData: any) => {
      console.log('Transak order created:', orderData);
      
      resolve({
        status: 'pending',
        orderId: orderData.status.id,
        estimatedTime: '1-3 business days',
        fiatAmount: orderData.status.fiatAmount,
      });
    });
    
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
      console.log('Transak order successful:', orderData);
      
      resolve({
        status: 'completed',
        orderId: orderData.status.id,
        transactionHash: orderData.status.transactionHash,
        fiatAmount: orderData.status.fiatAmount,
        bankAccount: orderData.status.bankAccount,
      });
    });
    
    transak.on(transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData: any) => {
      console.error('Transak order failed:', orderData);
      
      reject({
        status: 'failed',
        orderId: orderData.status.id,
        error: orderData.status.failureReason,
      });
    });
    
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log('Transak widget closed');
      // Don't reject - user might have closed intentionally
    });
    
    // Open Transak widget
    transak.init();
  });
}

/**
 * Request off-ramp through IBPWallet smart contract
 * @param contractAddress IBPWalletWithOfframp contract address
 * @param tokenAddress USDC token address
 * @param amount Amount to cash out (in token decimals)
 * @param fiatCurrency Target fiat currency
 * @param signer Ethers signer
 * @returns Promise resolving to request ID
 */
export async function requestOfframpOnchain(
  contractAddress: string,
  tokenAddress: string,
  amount: string, // Wei amount
  fiatCurrency: string,
  signer: ethers.Signer
): Promise<number> {
  const abi = [
    'function requestOfframp(address token, uint256 amount, string fiatCurrency, string bankDetailsHash) external returns (uint256)',
    'function getOfframpRequest(uint256 requestId) external view returns (address, address, uint256, string, uint256, uint256, bool, string)',
    'event OfframpRequested(uint256 indexed requestId, address indexed wallet, address token, uint256 amount, string fiatCurrency)',
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, signer);
  
  // Placeholder for bank details hash (in production, encrypt and store off-chain)
  const bankDetailsHash = 'TRANSAK_MANAGED';
  
  // Request off-ramp
  const tx = await contract.requestOfframp(
    tokenAddress,
    amount,
    fiatCurrency,
    bankDetailsHash
  );
  
  const receipt = await tx.wait();
  
  // Extract request ID from event
  const event = receipt.events?.find((e: any) => e.event === 'OfframpRequested');
  const requestId = event?.args?.requestId.toNumber();
  
  console.log('Off-ramp requested on-chain:', requestId);
  
  return requestId;
}

/**
 * Complete flow: Request on-chain + Open Transak widget
 * @param walletAddress User's wallet address
 * @param contractAddress IBPWallet contract address
 * @param tokenAddress USDC token address
 * @param amount Amount in USDC (human-readable, e.g., "10.5")
 * @param fiatCurrency Target fiat currency
 * @param signer Ethers signer
 * @returns Promise resolving to off-ramp result
 */
export async function fullOfframpFlow(
  walletAddress: string,
  contractAddress: string,
  tokenAddress: string,
  amount: string,
  fiatCurrency: string = 'USD',
  signer: ethers.Signer
): Promise<OfframpResult> {
  try {
    // Step 1: Request off-ramp on-chain (locks funds)
    const amountWei = ethers.utils.parseUnits(amount, 6); // USDC has 6 decimals
    const requestId = await requestOfframpOnchain(
      contractAddress,
      tokenAddress,
      amountWei.toString(),
      fiatCurrency,
      signer
    );
    
    console.log('On-chain request ID:', requestId);
    
    // Step 2: Open Transak widget for user to complete KYC + bank details
    const result = await cashOutToBank(
      walletAddress,
      parseFloat(amount),
      fiatCurrency
    );
    
    return result;
    
  } catch (error) {
    console.error('Off-ramp flow error:', error);
    throw error;
  }
}

/**
 * Check off-ramp status
 * @param contractAddress IBPWallet contract address
 * @param requestId Request ID from on-chain
 * @param provider Ethers provider
 * @returns Off-ramp request details
 */
export async function checkOfframpStatus(
  contractAddress: string,
  requestId: number,
  provider: ethers.providers.Provider
) {
  const abi = [
    'function getOfframpRequest(uint256 requestId) external view returns (address, address, uint256, string, uint256, uint256, bool, string)',
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  const [
    wallet,
    token,
    amount,
    fiatCurrency,
    requestedAt,
    completedAt,
    completed,
    txHash,
  ] = await contract.getOfframpRequest(requestId);
  
  return {
    wallet,
    token,
    amount: ethers.utils.formatUnits(amount, 6), // USDC
    fiatCurrency,
    requestedAt: new Date(requestedAt * 1000),
    completedAt: completedAt > 0 ? new Date(completedAt * 1000) : null,
    completed,
    txHash,
  };
}

/**
 * Load Transak SDK script
 * Call this in your app initialization
 */
export function loadTransakSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).TransakSDK) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://global.transak.com/sdk/v1.2/transak-sdk.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Transak SDK'));
    document.head.appendChild(script);
  });
}

// Export types
export type { TransakConfig, OfframpResult };
