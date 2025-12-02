/**
 * PTE Engine with RangisNet Subnet Integration
 * 
 * This enhanced version queries the RangisNet subnet RPC for real-time
 * gas data and integrates with the Harmonic Transaction Filtering (HTF)
 * pre-validation system.
 */

import { ethers } from 'ethers';

export interface MarketCondition {
  rsi: number;
  vix: number;
  sentiment?: number;
  gasPrice?: bigint;
}

export interface PTEResult {
  probability: number;
  frequency: number;
  recommendation: 'SEND' | 'WAIT' | 'REJECT';
  sensoryData: {
    harmonic: number;
    haptic: 'PULSE' | 'WAVE' | 'BUZZ' | 'ALERT';
    phonic: 'SINE' | 'TRIANGLE' | 'SAWTOOTH' | 'SQUARE';
  };
}

export class PTEEngineSubnet {
  private static instance: PTEEngineSubnet;
  private provider: ethers.JsonRpcProvider | null = null;
  private subnetRPC: string;
  
  private constructor() {
    // Load subnet RPC from environment or use default
    this.subnetRPC = process.env.SUBNET_RPC || 'https://subnets.avax.network/rangis/rpc';
    this.initializeProvider();
  }

  public static getInstance(): PTEEngineSubnet {
    if (!PTEEngineSubnet.instance) {
      PTEEngineSubnet.instance = new PTEEngineSubnet();
    }
    return PTEEngineSubnet.instance;
  }

  private initializeProvider(): void {
    try {
      this.provider = new ethers.JsonRpcProvider(this.subnetRPC);
    } catch (error) {
      console.warn('Failed to initialize subnet provider:', error);
      this.provider = null;
    }
  }

  /**
   * Fetch real-time gas data from RangisNet subnet
   */
  private async fetchSubnetGasData(): Promise<bigint> {
    if (!this.provider) {
      return BigInt(0);
    }

    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice || BigInt(0);
    } catch (error) {
      console.warn('Failed to fetch subnet gas data:', error);
      return BigInt(0);
    }
  }

  /**
   * Compute PRM (Probability of Resonant Market) using McCrea Equation
   * Enhanced with subnet gas data
   */
  public async computePRM(data: MarketCondition): Promise<number> {
    // Fetch real-time gas price from subnet
    const gasPrice = await this.fetchSubnetGasData();
    const gasPriceNumber = Number(gasPrice) / 1e9; // Convert to Gwei

    // McCrea Equation: P = σ(ω/5000)
    // where ω = 2 × RSI × VIX × (1 + sentiment) × (1 - gasFactor)
    const sentiment = data.sentiment || 0.5;
    const gasFactor = Math.min(gasPriceNumber / 100, 0.5); // Cap at 50% impact

    const omega = 2 * data.rsi * data.vix * (1 + sentiment) * (1 - gasFactor);
    const probability = this.sigmoid(omega / 5000);

    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Sigmoid activation function
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Map probability to harmonic frequency (432-1432 Hz)
   */
  private mapToFrequency(probability: number): number {
    return 432 + probability * 1000;
  }

  /**
   * Map probability to haptic pattern
   */
  private mapToHaptic(probability: number): 'PULSE' | 'WAVE' | 'BUZZ' | 'ALERT' {
    if (probability >= 0.8) return 'ALERT';
    if (probability >= 0.6) return 'BUZZ';
    if (probability >= 0.4) return 'WAVE';
    return 'PULSE';
  }

  /**
   * Map probability to phonic waveform
   */
  private mapToPhonic(probability: number): 'SINE' | 'TRIANGLE' | 'SAWTOOTH' | 'SQUARE' {
    if (probability >= 0.75) return 'SQUARE';
    if (probability >= 0.5) return 'SAWTOOTH';
    if (probability >= 0.25) return 'TRIANGLE';
    return 'SINE';
  }

  /**
   * Get transaction recommendation based on probability
   */
  private getRecommendation(probability: number): 'SEND' | 'WAIT' | 'REJECT' {
    if (probability >= 0.7) return 'SEND';
    if (probability >= 0.3) return 'WAIT';
    return 'REJECT';
  }

  /**
   * Validate transaction against Harmonic Transaction Filtering (HTF)
   * This is the pre-validation that happens at the subnet mempool level
   */
  public async validateTxHTF(data: MarketCondition): Promise<boolean> {
    const probability = await this.computePRM(data);
    
    // HTF threshold: Only allow transactions with probability >= 0.3
    // This prevents low-quality transactions from clogging the subnet
    return probability >= 0.3;
  }

  /**
   * Complete PTE analysis with sensory mapping
   */
  public async analyze(data: MarketCondition): Promise<PTEResult> {
    const probability = await this.computePRM(data);
    const frequency = this.mapToFrequency(probability);
    const haptic = this.mapToHaptic(probability);
    const phonic = this.mapToPhonic(probability);
    const recommendation = this.getRecommendation(probability);

    return {
      probability,
      frequency,
      recommendation,
      sensoryData: {
        harmonic: frequency,
        haptic,
        phonic,
      },
    };
  }

  /**
   * Get subnet RPC endpoint
   */
  public getSubnetRPC(): string {
    return this.subnetRPC;
  }

  /**
   * Update subnet RPC endpoint
   */
  public setSubnetRPC(rpc: string): void {
    this.subnetRPC = rpc;
    this.initializeProvider();
  }

  /**
   * Check if subnet connection is healthy
   */
  public async isSubnetHealthy(): Promise<boolean> {
    if (!this.provider) return false;

    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber > 0;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const pteEngineSubnet = PTEEngineSubnet.getInstance();
