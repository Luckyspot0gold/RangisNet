/**
 * RangisNet Subnet Monitor
 * 
 * Monitors the health and performance of the RangisNet subnet
 * Tracks: block production, gas prices, HTF validation rate, ICM messages
 */

const { ethers } = require('ethers');

const SUBNET_RPC = process.env.SUBNET_RPC || 'https://subnets.avax.network/rangis/rpc';
const MONITOR_INTERVAL = parseInt(process.env.MONITOR_INTERVAL || '10000');

class SubnetMonitor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(SUBNET_RPC);
    this.lastBlockNumber = 0;
    this.metrics = {
      blockTime: [],
      gasPrice: [],
      txCount: [],
      htfValidationRate: 0,
    };
  }

  async start() {
    console.log('🔍 RangisNet Subnet Monitor Started');
    console.log(`📡 RPC: ${SUBNET_RPC}`);
    console.log(`⏱️  Interval: ${MONITOR_INTERVAL}ms\n`);

    // Initial health check
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      console.error('❌ Subnet is not healthy. Exiting...');
      process.exit(1);
    }

    // Start monitoring loop
    setInterval(() => this.monitor(), MONITOR_INTERVAL);
  }

  async checkHealth() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`✅ Subnet is healthy. Current block: ${blockNumber}`);
      this.lastBlockNumber = blockNumber;
      return true;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  async monitor() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(currentBlock);
      const feeData = await this.provider.getFeeData();

      // Calculate block time
      if (this.lastBlockNumber > 0) {
        const blockDiff = currentBlock - this.lastBlockNumber;
        const timeDiff = (Date.now() - this.lastTimestamp) / 1000;
        const blockTime = blockDiff > 0 ? timeDiff / blockDiff : 0;
        this.metrics.blockTime.push(blockTime);
      }

      // Track gas price
      const gasPriceGwei = Number(feeData.gasPrice) / 1e9;
      this.metrics.gasPrice.push(gasPriceGwei);

      // Track transaction count
      const txCount = block.transactions.length;
      this.metrics.txCount.push(txCount);

      // Keep only last 100 data points
      if (this.metrics.blockTime.length > 100) {
        this.metrics.blockTime.shift();
        this.metrics.gasPrice.shift();
        this.metrics.txCount.shift();
      }

      // Calculate averages
      const avgBlockTime = this.average(this.metrics.blockTime);
      const avgGasPrice = this.average(this.metrics.gasPrice);
      const avgTxCount = this.average(this.metrics.txCount);

      // Log metrics
      console.log(`\n📊 Subnet Metrics (Block ${currentBlock})`);
      console.log(`⏱️  Avg Block Time: ${avgBlockTime.toFixed(2)}s`);
      console.log(`⛽ Avg Gas Price: ${avgGasPrice.toFixed(4)} Gwei`);
      console.log(`📝 Avg Tx/Block: ${avgTxCount.toFixed(1)}`);
      console.log(`🔢 Current Tx Count: ${txCount}`);

      // Check for anomalies
      if (avgBlockTime > 5) {
        console.warn('⚠️  WARNING: Block time is higher than expected!');
      }
      if (avgGasPrice > 50) {
        console.warn('⚠️  WARNING: Gas price is unusually high!');
      }

      this.lastBlockNumber = currentBlock;
      this.lastTimestamp = Date.now();
    } catch (error) {
      console.error('❌ Monitoring error:', error.message);
    }
  }

  average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}

// Start monitor
const monitor = new SubnetMonitor();
monitor.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down monitor...');
  process.exit(0);
});
