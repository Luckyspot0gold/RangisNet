/**
 * RangisNet Performance Monitoring
 * Tracks PTE performance metrics for production deployment
 */

export interface PerformanceMetrics {
  avgComputationTime: number;  // Average PRM computation time (μs)
  transactionSuccessRate: number;  // Percentage of successful transactions
  recommendationDistribution: RecommendationStats;
  sensoryFeedbackLatency: number;  // Average sensory feedback generation time (ms)
  totalTransactions: number;
  timestamp: number;
}

export interface RecommendationStats {
  send: number;    // Count of SEND recommendations
  wait: number;    // Count of WAIT recommendations
  reject: number;  // Count of REJECT recommendations
}

export class PerformanceMonitor {
  private computationTimes: number[] = [];
  private transactionResults: boolean[] = [];
  private recommendations: RecommendationStats = { send: 0, wait: 0, reject: 0 };
  private sensoryLatencies: number[] = [];
  private readonly MAX_SAMPLES = 1000;  // Keep last 1000 samples

  /**
   * Record a PRM computation time
   */
  recordComputationTime(timeInMicroseconds: number): void {
    this.computationTimes.push(timeInMicroseconds);
    if (this.computationTimes.length > this.MAX_SAMPLES) {
      this.computationTimes.shift();
    }
  }

  /**
   * Record a transaction result
   */
  recordTransactionResult(success: boolean): void {
    this.transactionResults.push(success);
    if (this.transactionResults.length > this.MAX_SAMPLES) {
      this.transactionResults.shift();
    }
  }

  /**
   * Record a recommendation
   */
  recordRecommendation(recommendation: 'SEND' | 'WAIT' | 'REJECT'): void {
    switch (recommendation) {
      case 'SEND':
        this.recommendations.send++;
        break;
      case 'WAIT':
        this.recommendations.wait++;
        break;
      case 'REJECT':
        this.recommendations.reject++;
        break;
    }
  }

  /**
   * Record sensory feedback generation latency
   */
  recordSensoryLatency(timeInMilliseconds: number): void {
    this.sensoryLatencies.push(timeInMilliseconds);
    if (this.sensoryLatencies.length > this.MAX_SAMPLES) {
      this.sensoryLatencies.shift();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      avgComputationTime: this.calculateAverage(this.computationTimes),
      transactionSuccessRate: this.calculateSuccessRate(),
      recommendationDistribution: { ...this.recommendations },
      sensoryFeedbackLatency: this.calculateAverage(this.sensoryLatencies),
      totalTransactions: this.transactionResults.length,
      timestamp: Date.now()
    };
  }

  /**
   * Get metrics summary as string
   */
  getSummary(): string {
    const metrics = this.getMetrics();
    const total = metrics.recommendationDistribution.send + 
                  metrics.recommendationDistribution.wait + 
                  metrics.recommendationDistribution.reject;

    return `
╔══════════════════════════════════════════════════════════════════╗
║                  RANGISNET PERFORMANCE METRICS                   ║
╚══════════════════════════════════════════════════════════════════╝

⚡ Performance
  • Avg Computation Time: ${metrics.avgComputationTime.toFixed(3)}μs
  • Sensory Latency: ${metrics.sensoryFeedbackLatency.toFixed(2)}ms
  • Target: <1μs (${metrics.avgComputationTime < 1 ? '✅ PASS' : '⚠ REVIEW'})

📊 Transaction Success Rate
  • Success Rate: ${metrics.transactionSuccessRate.toFixed(1)}%
  • Total Transactions: ${metrics.totalTransactions}
  • Target: >99% (${metrics.transactionSuccessRate > 99 ? '✅ PASS' : '⚠ REVIEW'})

📈 Recommendation Distribution
  • SEND: ${metrics.recommendationDistribution.send} (${((metrics.recommendationDistribution.send / total) * 100).toFixed(1)}%)
  • WAIT: ${metrics.recommendationDistribution.wait} (${((metrics.recommendationDistribution.wait / total) * 100).toFixed(1)}%)
  • REJECT: ${metrics.recommendationDistribution.reject} (${((metrics.recommendationDistribution.reject / total) * 100).toFixed(1)}%)

🎯 Status: ${this.getStatus(metrics)}
`;
  }

  /**
   * Export metrics to JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.getMetrics(), null, 2);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.computationTimes = [];
    this.transactionResults = [];
    this.recommendations = { send: 0, wait: 0, reject: 0 };
    this.sensoryLatencies = [];
  }

  /**
   * Check if metrics meet production standards
   */
  meetsProductionStandards(): boolean {
    const metrics = this.getMetrics();
    return (
      metrics.avgComputationTime < 1 &&  // <1μs computation time
      metrics.transactionSuccessRate > 99 &&  // >99% success rate
      metrics.sensoryFeedbackLatency < 1000  // <1s sensory feedback
    );
  }

  /**
   * Calculate average of an array
   */
  private calculateAverage(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  /**
   * Calculate transaction success rate
   */
  private calculateSuccessRate(): number {
    if (this.transactionResults.length === 0) return 0;
    const successes = this.transactionResults.filter(r => r).length;
    return (successes / this.transactionResults.length) * 100;
  }

  /**
   * Get overall status
   */
  private getStatus(metrics: PerformanceMetrics): string {
    if (this.meetsProductionStandards()) {
      return '✅ OPTIMAL - Production Ready';
    } else if (metrics.avgComputationTime < 10 && metrics.transactionSuccessRate > 95) {
      return '⚠ GOOD - Minor Optimization Needed';
    } else {
      return '❌ NEEDS ATTENTION - Review Required';
    }
  }
}

// Export singleton instance
export const Monitor = new PerformanceMonitor();

/**
 * Decorator to automatically monitor function execution time
 */
export function monitored(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    const timeInMicroseconds = (end - start) * 1000;
    
    Monitor.recordComputationTime(timeInMicroseconds);
    
    return result;
  };

  return descriptor;
}
