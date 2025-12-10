/**
 * Cosmos SDK Oracle Worker
 * RangisNet Layer 1.5 - On-chain Market Data Oracle
 * 
 * Fetches market data from the API aggregator and submits it
 * to the Cosmos chain via the x/marketdata module.
 */

import { aggregateMarketData, aggregateBatchMarketData } from '../Web/lib/api-aggregator';
import { analyzePRM, analyzeBatchPRM } from '../Web/lib/prm-engine';
import { SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';

interface OracleConfig {
  rpcEndpoint: string;
  chainId: string;
  mnemonic: string;
  symbols: string[];
  updateIntervalMs: number;
}

class MarketDataOracle {
  private client: SigningStargateClient | null = null;
  private wallet: DirectSecp256k1HdWallet | null = null;
  private config: OracleConfig;
  private isRunning: boolean = false;

  constructor(config: OracleConfig) {
    this.config = config;
  }

  /**
   * Initialize the Cosmos client and wallet
   */
  async initialize(): Promise<void> {
    console.log('Initializing Cosmos oracle worker...');
    
    // Create wallet from mnemonic
    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      this.config.mnemonic,
      { prefix: 'rangis' }
    );
    
    // Get the first account
    const [account] = await this.wallet.getAccounts();
    console.log(`Oracle address: ${account.address}`);
    
    // Connect to the chain
    this.client = await SigningStargateClient.connectWithSigner(
      this.config.rpcEndpoint,
      this.wallet,
      {
        gasPrice: GasPrice.fromString('0.025urangis')
      }
    );
    
    console.log('Oracle worker initialized successfully');
  }

  /**
   * Submit market data to the blockchain
   */
  async submitMarketData(symbol: string): Promise<void> {
    if (!this.client || !this.wallet) {
      throw new Error('Oracle not initialized');
    }
    
    try {
      // Fetch aggregated market data
      const marketData = await aggregateMarketData(symbol);
      
      // Get oracle account
      const [account] = await this.wallet.getAccounts();
      
      // Create the message
      const msg = {
        typeUrl: '/rangisnet.marketdata.v1.MsgSubmitMarketData',
        value: {
          oracle: account.address,
          marketData: {
            symbol: marketData.symbol,
            price: marketData.price.toString(),
            volume24h: marketData.volume24h.toString(),
            priceChange24h: marketData.priceChange24h.toString(),
            timestamp: new Date(marketData.timestamp),
            sources: marketData.sources,
            confidence: marketData.confidence.toString()
          }
        }
      };
      
      // Send transaction
      const fee = {
        amount: [{ denom: 'urangis', amount: '5000' }],
        gas: '200000'
      };
      
      const result = await this.client.signAndBroadcast(
        account.address,
        [msg],
        fee,
        `Market data update for ${symbol}`
      );
      
      if (result.code === 0) {
        console.log(`✅ Market data submitted for ${symbol} - TxHash: ${result.transactionHash}`);
      } else {
        console.error(`❌ Failed to submit market data for ${symbol}:`, result.rawLog);
      }
      
    } catch (error) {
      console.error(`Error submitting market data for ${symbol}:`, error);
    }
  }

  /**
   * Submit PRM analysis to the blockchain
   */
  async submitPRMAnalysis(symbol: string): Promise<void> {
    if (!this.client || !this.wallet) {
      throw new Error('Oracle not initialized');
    }
    
    try {
      // Fetch and analyze market data
      const marketData = await aggregateMarketData(symbol);
      const analysis = analyzePRM(marketData);
      
      // Get oracle account
      const [account] = await this.wallet.getAccounts();
      
      // Create the message
      const msg = {
        typeUrl: '/rangisnet.marketdata.v1.MsgSubmitPRMAnalysis',
        value: {
          oracle: account.address,
          analysis: {
            symbol: analysis.metadata.symbol,
            recommendation: analysis.recommendation,
            confidence: analysis.confidence.toString(),
            harmonic: {
              frequency: analysis.harmonic.frequency.toString(),
              amplitude: analysis.harmonic.amplitude.toString(),
              waveform: analysis.harmonic.waveform,
              durationMs: analysis.harmonic.duration
            },
            haptic: {
              intensity: analysis.haptic.intensity.toString(),
              pattern: analysis.haptic.pattern,
              durationMs: analysis.haptic.duration
            },
            phonic: {
              pitch: analysis.phonic.pitch.toString(),
              volume: analysis.phonic.volume.toString(),
              timbre: analysis.phonic.timbre,
              durationMs: analysis.phonic.duration
            },
            resonanceScore: analysis.metadata.resonanceScore.toString(),
            timestamp: new Date(analysis.metadata.timestamp)
          }
        }
      };
      
      // Send transaction
      const fee = {
        amount: [{ denom: 'urangis', amount: '8000' }],
        gas: '300000'
      };
      
      const result = await this.client.signAndBroadcast(
        account.address,
        [msg],
        fee,
        `PRM analysis for ${symbol}`
      );
      
      if (result.code === 0) {
        console.log(`✅ PRM analysis submitted for ${symbol} - TxHash: ${result.transactionHash}`);
      } else {
        console.error(`❌ Failed to submit PRM analysis for ${symbol}:`, result.rawLog);
      }
      
    } catch (error) {
      console.error(`Error submitting PRM analysis for ${symbol}:`, error);
    }
  }

  /**
   * Main oracle loop - periodically fetches and submits data
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Oracle is already running');
      return;
    }
    
    await this.initialize();
    this.isRunning = true;
    
    console.log(`🚀 Oracle started - monitoring ${this.config.symbols.length} symbols`);
    console.log(`Update interval: ${this.config.updateIntervalMs}ms`);
    
    // Main loop
    while (this.isRunning) {
      console.log('\n--- Oracle Update Cycle ---');
      
      // Process each symbol
      for (const symbol of this.config.symbols) {
        await this.submitMarketData(symbol);
        await this.submitPRMAnalysis(symbol);
        
        // Small delay between symbols to avoid rate limits
        await this.sleep(2000);
      }
      
      console.log('--- Cycle Complete ---\n');
      
      // Wait for next update interval
      await this.sleep(this.config.updateIntervalMs);
    }
  }

  /**
   * Stop the oracle
   */
  stop(): void {
    console.log('Stopping oracle worker...');
    this.isRunning = false;
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const config: OracleConfig = {
    rpcEndpoint: process.env.COSMOS_RPC || 'http://localhost:26657',
    chainId: process.env.COSMOS_CHAIN_ID || 'rangisnet-1',
    mnemonic: process.env.ORACLE_MNEMONIC || '',
    symbols: (process.env.ORACLE_SYMBOLS || 'BTC,ETH,AVAX,SOL').split(','),
    updateIntervalMs: parseInt(process.env.UPDATE_INTERVAL_MS || '60000') // Default: 1 minute
  };
  
  if (!config.mnemonic) {
    console.error('ERROR: ORACLE_MNEMONIC environment variable is required');
    process.exit(1);
  }
  
  const oracle = new MarketDataOracle(config);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down...');
    oracle.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down...');
    oracle.stop();
    process.exit(0);
  });
  
  await oracle.start();
}

// Run if this is the main module
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { MarketDataOracle, OracleConfig };
