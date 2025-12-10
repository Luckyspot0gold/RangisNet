/**
 * Coinbase Commerce Integration for RangisHeartbeat
 * Enables fiat/crypto payments for premium features
 * 
 * Account: Luckysnagbags@cb.id
 * Documentation: https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome
 */

import axios from 'axios';

export interface CoinbaseChargeRequest {
  name: string;
  description: string;
  pricing_type: 'fixed_price' | 'no_price';
  local_price?: {
    amount: string;
    currency: string;
  };
  metadata?: Record<string, any>;
  redirect_url?: string;
  cancel_url?: string;
}

export interface CoinbaseCharge {
  id: string;
  code: string;
  name: string;
  description: string;
  hosted_url: string;
  created_at: string;
  expires_at: string;
  confirmed_at?: string;
  pricing: {
    local: { amount: string; currency: string };
    bitcoin?: { amount: string; currency: string };
    ethereum?: { amount: string; currency: string };
  };
  payments: any[];
  timeline: any[];
  metadata: Record<string, any>;
  addresses?: {
    bitcoin?: string;
    ethereum?: string;
    usdc?: string;
  };
}

export interface CoinbaseCommerceConfig {
  apiKey: string;
  webhookSecret?: string;
  apiVersion?: string;
}

export class CoinbaseCommerceClient {
  private apiKey: string;
  private baseUrl: string;
  private apiVersion: string;

  constructor(config: CoinbaseCommerceConfig) {
    this.apiKey = config.apiKey;
    this.apiVersion = config.apiVersion || '2018-03-22';
    this.baseUrl = 'https://api.commerce.coinbase.com';
  }

  /**
   * Create a charge (payment request)
   */
  async createCharge(request: CoinbaseChargeRequest): Promise<CoinbaseCharge> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/charges`,
        request,
        {
          headers: {
            'X-CC-Api-Key': this.apiKey,
            'X-CC-Version': this.apiVersion,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Coinbase Commerce charge creation failed:', error);
      throw error;
    }
  }

  /**
   * Get charge details
   */
  async getCharge(chargeId: string): Promise<CoinbaseCharge> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/charges/${chargeId}`,
        {
          headers: {
            'X-CC-Api-Key': this.apiKey,
            'X-CC-Version': this.apiVersion
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Coinbase Commerce charge fetch failed:', error);
      throw error;
    }
  }

  /**
   * List all charges
   */
  async listCharges(limit: number = 25): Promise<CoinbaseCharge[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/charges`,
        {
          params: { limit },
          headers: {
            'X-CC-Api-Key': this.apiKey,
            'X-CC-Version': this.apiVersion
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Coinbase Commerce charge list failed:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return computedSignature === signature;
  }
}

/**
 * RangisHeartbeat Premium Tiers
 * Revolutionary Multi-Sensory Market Cognition Platform
 * 
 * ACCESSIBILITY FIRST: Designed for blind, deaf, neurodivergent, ADHD,
 * seniors, hearing impaired, and ALL humans + AI to experience markets
 * through sound, touch, color, and motion.
 */
export const PREMIUM_TIERS = {
  basic: {
    name: 'Basic Cognition',
    price: 29.99,
    currency: 'USD',
    description: 'Layer 1: Multi-Sensory Market Experience',
    features: [
      '🎵 7-Bell Harmonic Audio (86Hz-1266Hz)',
      '📊 Basic Sphere Visualization (color + pitch)',
      '📳 Basic Vibration Patterns (haptic feedback)',
      '🔊 Market Cymatics (sound wave visualization)',
      '🐳 Whale_Splash Indicators (large transaction alerts)',
      '📈 Real-time data (25 symbols)',
      '♿ Full accessibility mode',
      'Block transaction identification',
      'M3 McCrea Market Metrics (Basic)'
    ],
    accessibility: [
      'Audio-first interface (screen reader optimized)',
      'Haptic feedback for price movements',
      'High contrast color modes',
      'Keyboard navigation'
    ]
  },
  pro: {
    name: 'Pro Trader',
    price: 99.99,
    currency: 'USD',
    description: 'Advanced Multi-Sensory + Market Character Simulations',
    features: [
      '🎼 Full 7-Bell System + Harmonic Overtones',
      '🌀 3D Visualizations (Spinor + Bloch + Torus)',
      '💎 Advanced Cymatics (3D sound patterns)',
      '🪓 Tax_Axe World Market Evaluators',
      '🎺 Trumpet_Dumpet Indicators',
      '🥊 Market_Melee Character Simulations',
      '🏎️ Racing Mode (cars, horses, elephants)',
      '👥 Blob Wars (market battle visualization)',
      '🌍 Wyo-verse Integration (Frontier-Trader)',
      '🤖 Youmio Avatar Integration (secret sauce)',
      '📊 M3 McCrea Market Metrics (Full Suite)',
      '🐳 Advanced Whale Detection',
      'Real-time data (unlimited symbols)',
      'API access + webhooks',
      'Custom audio profiles',
      'VR/AR Ready'
    ],
    accessibility: [
      'Multi-modal feedback (audio + haptic + visual)',
      'Voice command integration',
      'Braille display support',
      'Customizable sensory profiles'
    ]
  },
  enterprise: {
    name: 'Wyo-Pioneer Enterprise',
    price: 299.99,
    currency: 'USD',
    description: 'Full Digital/VR/AR Metaverse + AI Co-Existence',
    features: [
      '🌌 Complete Wyo-verse Access (parallel universe)',
      '🎮 VR/AR Market Experience',
      '🤖 AI Co-Existence Mode (AI learns YOUR patterns)',
      '👤 Premium Youmio Avatars (M3 powered)',
      '⚡ Real-time AI Market Communication',
      '🎵 Harmonic Wavelength Data Transfer',
      '🔬 No-Math Market Understanding',
      '🌊 Advanced Cymatics Engine',
      '📡 Multi-Chain Block Transaction ID',
      '🏆 All Market Characters Unlocked',
      '🎨 Custom Character Creation',
      '💼 White-label Solutions',
      '🔌 Full API + SDK Access',
      '📞 24/7 Priority Support',
      '🧠 Neurodivergent Optimization Tools',
      'Dedicated infrastructure',
      'Custom M3 metric development'
    ],
    accessibility: [
      'AI-assisted navigation',
      'Full sensory customization',
      'Neuro-adaptive interfaces',
      'Multi-language audio support',
      'Cognitive load optimization'
    ]
  }
};

/**
 * Create charge for RangisHeartbeat premium tier
 */
export async function createPremiumCharge(
  client: CoinbaseCommerceClient,
  tier: keyof typeof PREMIUM_TIERS,
  userEmail: string,
  userId: string
): Promise<CoinbaseCharge> {
  const tierConfig = PREMIUM_TIERS[tier];
  
  return client.createCharge({
    name: `RangisHeartbeat ${tierConfig.name}`,
    description: `Monthly subscription: ${tierConfig.features.join(', ')}`,
    pricing_type: 'fixed_price',
    local_price: {
      amount: tierConfig.price.toString(),
      currency: tierConfig.currency
    },
    metadata: {
      tier,
      userEmail,
      userId,
      platform: 'rangisheartbeat.com',
      account: 'Luckysnagbags@cb.id'
    },
    redirect_url: 'https://rangisheartbeat.com/payment/success',
    cancel_url: 'https://rangisheartbeat.com/payment/cancel'
  });
}

/**
 * Initialize Coinbase Commerce client
 */
export function initCoinbaseCommerce(): CoinbaseCommerceClient | null {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  
  if (!apiKey) {
    console.warn('COINBASE_COMMERCE_API_KEY not configured');
    return null;
  }
  
  return new CoinbaseCommerceClient({
    apiKey,
    webhookSecret: process.env.COINBASE_WEBHOOK_SECRET
  });
}

export default CoinbaseCommerceClient;
