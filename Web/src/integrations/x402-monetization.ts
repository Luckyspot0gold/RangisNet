/**
 * x402 Monetization Layer
 * 
 * Integrates PayAI and 0xGasless facilitators for micropayment-gated premium features
 * Enables monetization of sensory queries (e.g., 0.01 USDC for DFK gaming actions)
 * 
 * @see https://www.erc402.com/
 */

export interface PaymentRequest {
  amount: number;
  token: 'USDC' | 'AVAX' | 'USDT';
  recipient: string;
  metadata?: {
    feature: string;
    userId?: string;
    timestamp: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: number;
  timestamp: number;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  token: 'USDC' | 'AVAX' | 'USDT';
  enabled: boolean;
}

export class X402MonetizationLayer {
  private facilitatorUrl: string;
  private recipientAddress: string;
  private premiumFeatures: Map<string, PremiumFeature>;

  constructor(config: {
    facilitatorUrl?: string;
    recipientAddress: string;
  }) {
    this.facilitatorUrl = config.facilitatorUrl || 'https://api.payai.network/v1';
    this.recipientAddress = config.recipientAddress;
    this.premiumFeatures = this.initializePremiumFeatures();
  }

  /**
   * Initialize premium feature catalog
   */
  private initializePremiumFeatures(): Map<string, PremiumFeature> {
    const features = new Map<string, PremiumFeature>();

    features.set('dfk_gaming_action', {
      id: 'dfk_gaming_action',
      name: 'DFK Gaming Action',
      description: 'Execute cross-chain gaming actions on DeFi Kingdoms L1',
      price: 0.01,
      token: 'USDC',
      enabled: true
    });

    features.set('premium_haptics', {
      id: 'premium_haptics',
      name: 'Premium Haptic Feedback',
      description: 'Enhanced haptic patterns with Youmio integration',
      price: 0.005,
      token: 'USDC',
      enabled: true
    });

    features.set('cross_chain_analysis', {
      id: 'cross_chain_analysis',
      name: 'Multi-Chain Analysis',
      description: 'Analyze markets across C-Chain, DFK, and other L1s',
      price: 0.02,
      token: 'USDC',
      enabled: true
    });

    features.set('sentiment_boost', {
      id: 'sentiment_boost',
      name: 'Real-Time Sentiment Analysis',
      description: 'Live sentiment data from The TIE for +15% accuracy',
      price: 0.015,
      token: 'USDC',
      enabled: true
    });

    features.set('icm_priority', {
      id: 'icm_priority',
      name: 'Priority ICM Messaging',
      description: 'Fast-track cross-chain messages with higher relayer fees',
      price: 0.025,
      token: 'AVAX',
      enabled: true
    });

    return features;
  }

  /**
   * Get all available premium features
   */
  getPremiumFeatures(): PremiumFeature[] {
    return Array.from(this.premiumFeatures.values()).filter(f => f.enabled);
  }

  /**
   * Get a specific premium feature
   */
  getFeature(featureId: string): PremiumFeature | undefined {
    return this.premiumFeatures.get(featureId);
  }

  /**
   * Check if user has access to a premium feature
   * (In production, check user's payment history or subscription)
   */
  async hasAccess(userId: string, featureId: string): Promise<boolean> {
    // TODO: Implement actual access check
    // For now, assume all users need to pay per use
    return false;
  }

  /**
   * Process payment for a premium feature using x402
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.facilitatorUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '402'
        },
        body: JSON.stringify({
          amount: request.amount,
          token: request.token,
          recipient: request.recipient,
          metadata: request.metadata
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;

      return {
        success: true,
        transactionHash: data.txHash || '',
        gasUsed: data.gasUsed || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  /**
   * Request access to a premium feature
   * Returns payment details or grants access if already paid
   */
  async requestFeatureAccess(userId: string, featureId: string): Promise<{
    requiresPayment: boolean;
    feature?: PremiumFeature;
    paymentRequest?: PaymentRequest;
  }> {
    const feature = this.premiumFeatures.get(featureId);
    
    if (!feature) {
      throw new Error(`Feature not found: ${featureId}`);
    }

    if (!feature.enabled) {
      throw new Error(`Feature disabled: ${featureId}`);
    }

    // Check if user already has access
    const hasAccess = await this.hasAccess(userId, featureId);
    
    if (hasAccess) {
      return {
        requiresPayment: false,
        feature
      };
    }

    // Generate payment request
    const paymentRequest: PaymentRequest = {
      amount: feature.price,
      token: feature.token,
      recipient: this.recipientAddress,
      metadata: {
        feature: featureId,
        userId,
        timestamp: Date.now()
      }
    };

    return {
      requiresPayment: true,
      feature,
      paymentRequest
    };
  }

  /**
   * Execute a premium feature after payment verification
   */
  async executeFeature(
    featureId: string,
    paymentResponse: PaymentResponse,
    params: any
  ): Promise<any> {
    if (!paymentResponse.success) {
      throw new Error('Payment required for premium feature');
    }

    const feature = this.premiumFeatures.get(featureId);
    if (!feature) {
      throw new Error(`Feature not found: ${featureId}`);
    }

    // Execute feature-specific logic
    switch (featureId) {
      case 'dfk_gaming_action':
        return this.executeDFKAction(params);
      
      case 'premium_haptics':
        return this.executePremiumHaptics(params);
      
      case 'cross_chain_analysis':
        return this.executeCrossChainAnalysis(params);
      
      case 'sentiment_boost':
        return this.executeSentimentBoost(params);
      
      case 'icm_priority':
        return this.executeICMPriority(params);
      
      default:
        throw new Error(`Feature execution not implemented: ${featureId}`);
    }
  }

  /**
   * Feature execution methods
   */
  private async executeDFKAction(params: any): Promise<any> {
    // TODO: Implement DFK gaming action
    return { success: true, action: 'BUY_JEWEL', amount: params.amount };
  }

  private async executePremiumHaptics(params: any): Promise<any> {
    // TODO: Implement premium haptic patterns
    return { success: true, pattern: 'PREMIUM_PULSE', duration: params.duration };
  }

  private async executeCrossChainAnalysis(params: any): Promise<any> {
    // TODO: Implement cross-chain analysis
    return { success: true, chains: params.chains, results: [] };
  }

  private async executeSentimentBoost(params: any): Promise<any> {
    // TODO: Implement sentiment boost
    return { success: true, sentimentScore: 0.75, boost: 1.15 };
  }

  private async executeICMPriority(params: any): Promise<any> {
    // TODO: Implement priority ICM messaging
    return { success: true, messageId: params.messageId, priorityFee: 0.025 };
  }

  /**
   * Get pricing for a feature
   */
  getFeaturePricing(featureId: string): { price: number; token: string } | null {
    const feature = this.premiumFeatures.get(featureId);
    if (!feature) return null;
    
    return {
      price: feature.price,
      token: feature.token
    };
  }

  /**
   * Calculate total cost for multiple features
   */
  calculateBundlePrice(featureIds: string[]): number {
    return featureIds.reduce((total, id) => {
      const feature = this.premiumFeatures.get(id);
      return total + (feature?.price || 0);
    }, 0);
  }
}

/**
 * Singleton instance
 */
let monetizationLayer: X402MonetizationLayer | null = null;

export function getMonetizationLayer(recipientAddress: string): X402MonetizationLayer {
  if (!monetizationLayer) {
    monetizationLayer = new X402MonetizationLayer({ recipientAddress });
  }
  return monetizationLayer;
}
