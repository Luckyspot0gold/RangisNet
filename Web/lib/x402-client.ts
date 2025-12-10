/**
 * X402 CLIENT FOR RANGISNET
 * Avalanche C-Chain micropayments integration
 * 
 * Based on x402-rs protocol: https://github.com/x402-rs/x402-rs
 * 
 * @copyright Reality Protocol LLC © 2025
 */

import { createThirdwebClient, getContract } from 'thirdweb';
import { avalancheFuji, avalanche } from 'thirdweb/chains';
import { privateKeyToAccount } from 'thirdweb/wallets';

// ============================================================================
// TYPES
// ============================================================================

export interface X402PriceTag {
  price: string;          // e.g., "0.025"
  token: 'USDC' | 'AVAX';
  network: 'avalanche-fuji' | 'avalanche';
  payTo: string;          // Recipient address
  description?: string;
}

export interface X402PaymentPayload {
  signature: string;
  amount: string;
  token: string;
  network: string;
  nonce: string;
  timestamp: number;
}

export interface X402VerificationResponse {
  verified: boolean;
  txHash?: string;
  error?: string;
}

// ============================================================================
// USDC CONTRACT ADDRESSES
// ============================================================================

const USDC_ADDRESSES = {
  'avalanche-fuji': '0x5425890298aed601595a70AB815c96711a31Bc65',
  'avalanche': '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
};

// ============================================================================
// X402 CLIENT
// ============================================================================

export class X402Client {
  private facilitatorUrl: string;
  private thirdwebClient: any;
  private privateKey?: string;
  
  constructor(
    facilitatorUrl: string = 'http://localhost:8080',
    privateKey?: string
  ) {
    this.facilitatorUrl = facilitatorUrl;
    this.privateKey = privateKey;
    
    this.thirdwebClient = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
    });
  }
  
  /**
   * Fetch protected resource with automatic x402 payment
   */
  async fetchWithPayment(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    // Initial request
    const response = await fetch(url, options);
    
    // If 402 Payment Required, handle payment
    if (response.status === 402) {
      const priceTag: X402PriceTag = await response.json();
      
      console.log('💳 Payment required:', priceTag);
      
      // Send payment
      const paymentResult = await this.sendPayment(priceTag);
      
      if (!paymentResult.verified) {
        throw new Error(`Payment verification failed: ${paymentResult.error}`);
      }
      
      console.log('✅ Payment verified:', paymentResult.txHash);
      
      // Retry request with payment proof
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'X-Payment-TxHash': paymentResult.txHash!,
        },
      });
      
      return retryResponse;
    }
    
    return response;
  }
  
  /**
   * Send x402 payment
   */
  async sendPayment(priceTag: X402PriceTag): Promise<X402VerificationResponse> {
    if (!this.privateKey) {
      throw new Error('Private key required for payments');
    }
    
    // Generate payment payload
    const payload = await this.generatePaymentPayload(priceTag);
    
    // Submit to facilitator for verification and settlement
    const response = await fetch(`${this.facilitatorUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.text();
      return {
        verified: false,
        error,
      };
    }
    
    const result = await response.json();
    return result;
  }
  
  /**
   * Generate signed payment payload
   */
  private async generatePaymentPayload(
    priceTag: X402PriceTag
  ): Promise<X402PaymentPayload> {
    const account = privateKeyToAccount({
      client: this.thirdwebClient,
      privateKey: this.privateKey!,
    });
    
    const nonce = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    
    // Message to sign: amount|token|network|payTo|nonce|timestamp
    const message = `${priceTag.price}|${priceTag.token}|${priceTag.network}|${priceTag.payTo}|${nonce}|${timestamp}`;
    
    // Sign message
    const signature = await account.signMessage({ message });
    
    return {
      signature,
      amount: priceTag.price,
      token: priceTag.token,
      network: priceTag.network,
      nonce,
      timestamp,
    };
  }
  
  /**
   * Check facilitator health
   */
  async checkHealth(): Promise<{
    status: string;
    networks: string[];
  }> {
    const response = await fetch(`${this.facilitatorUrl}/health`);
    return response.json();
  }
}

// ============================================================================
// RANGISNET PAYMENT GATES
// ============================================================================

export const RANGIS_PRICE_TAGS: Record<string, X402PriceTag> = {
  'rangi-detective': {
    price: '0.025',
    token: 'USDC',
    network: 'avalanche-fuji',
    payTo: process.env.NEXT_PUBLIC_PAYMENT_WALLET || '0x0000000000000000000000000000000000000000',
    description: 'Access Rangi Truth Detective dashboard',
  },
  'heartbeat': {
    price: '0.01',
    token: 'USDC',
    network: 'avalanche-fuji',
    payTo: process.env.NEXT_PUBLIC_PAYMENT_WALLET || '0x0000000000000000000000000000000000000000',
    description: 'Real-time market heartbeat visualization',
  },
  'agent-scoring': {
    price: '0.05',
    token: 'USDC',
    network: 'avalanche-fuji',
    payTo: process.env.NEXT_PUBLIC_PAYMENT_WALLET || '0x0000000000000000000000000000000000000000',
    description: 'AI agent scoring and truth detection API',
  },
  'm3-metrics': {
    price: '0.02',
    token: 'USDC',
    network: 'avalanche-fuji',
    payTo: process.env.NEXT_PUBLIC_PAYMENT_WALLET || '0x0000000000000000000000000000000000000000',
    description: 'M3 arsenal metrics per symbol',
  },
};

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create x402 client for Rangi AI agents
 */
export function createRangiX402Client(privateKey?: string): X402Client {
  const facilitatorUrl = process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'http://localhost:8080';
  return new X402Client(facilitatorUrl, privateKey);
}

/**
 * Fetch Rangi detective with payment
 */
export async function fetchRangiDetective(privateKey?: string): Promise<any> {
  const client = createRangiX402Client(privateKey);
  const response = await client.fetchWithPayment(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/agent-scoring`
  );
  return response.json();
}

/**
 * Fetch M3 metrics with payment
 */
export async function fetchM3Metrics(
  symbol: string,
  privateKey?: string
): Promise<any> {
  const client = createRangiX402Client(privateKey);
  const response = await client.fetchWithPayment(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/m3-metrics/${symbol}`
  );
  return response.json();
}
