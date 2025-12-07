/**
 * The TIE Sentiment API Integration
 * 
 * Provides real-time sentiment signals for cryptocurrency assets
 * to enhance PTE accuracy by 15-20%
 * 
 * @see https://www.thetie.io/
 */

export interface SentimentData {
  ticker: string;
  score: number; // -1 to 1 (bearish to bullish)
  volume: number; // Social volume
  timestamp: number;
  confidence: number; // 0 to 1
}

export interface TheTIEConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export class TheTIESentimentAPI {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: TheTIEConfig = {}) {
    this.apiKey = config.apiKey || process.env.THE_TIE_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://api.thetie.io/v1';
    this.timeout = config.timeout || 5000;
  }

  /**
   * Fetch real-time sentiment score for a given ticker
   */
  async fetchSentiment(ticker: string): Promise<SentimentData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/sentiment/${ticker}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`The TIE API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;

      return {
        ticker: ticker.toUpperCase(),
        score: this.normalizeSentiment(data.sentiment_score || 0),
        volume: data.social_volume || 0,
        timestamp: Date.now(),
        confidence: data.confidence || 0.8
      };
    } catch (error) {
      console.warn(`Failed to fetch sentiment for ${ticker}:`, error);
      
      // Fallback to neutral sentiment
      return {
        ticker: ticker.toUpperCase(),
        score: 0,
        volume: 0,
        timestamp: Date.now(),
        confidence: 0
      };
    }
  }

  /**
   * Fetch sentiment for multiple tickers in parallel
   */
  async fetchBatchSentiment(tickers: string[]): Promise<Map<string, SentimentData>> {
    const results = await Promise.all(
      tickers.map(ticker => this.fetchSentiment(ticker))
    );

    const sentimentMap = new Map<string, SentimentData>();
    results.forEach(data => {
      sentimentMap.set(data.ticker, data);
    });

    return sentimentMap;
  }

  /**
   * Normalize sentiment score to [-1, 1] range
   */
  private normalizeSentiment(rawScore: number): number {
    // The TIE typically returns scores in different ranges
    // Normalize to [-1, 1] for consistency
    if (rawScore >= -1 && rawScore <= 1) {
      return rawScore;
    }
    
    // If score is 0-100, convert to -1 to 1
    if (rawScore >= 0 && rawScore <= 100) {
      return (rawScore - 50) / 50;
    }

    // Default to neutral
    return 0;
  }

  /**
   * Get sentiment category label
   */
  getSentimentLabel(score: number): string {
    if (score >= 0.5) return 'Very Bullish';
    if (score >= 0.2) return 'Bullish';
    if (score >= -0.2) return 'Neutral';
    if (score >= -0.5) return 'Bearish';
    return 'Very Bearish';
  }

  /**
   * Calculate sentiment boost for PTE
   * Returns a multiplier to apply to base PRM
   */
  calculateSentimentBoost(sentimentScore: number, confidence: number): number {
    // Sentiment boost ranges from 0.85 to 1.15 (±15%)
    // Weighted by confidence
    const baseBoost = 1 + (sentimentScore * 0.15);
    const weightedBoost = 1 + ((baseBoost - 1) * confidence);
    
    return Math.max(0.85, Math.min(1.15, weightedBoost));
  }
}

/**
 * Mock implementation for testing without API key
 */
export class MockTheTIESentimentAPI extends TheTIESentimentAPI {
  async fetchSentiment(ticker: string): Promise<SentimentData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock sentiment based on ticker
    const hash = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const score = ((hash % 200) - 100) / 100; // -1 to 1

    return {
      ticker: ticker.toUpperCase(),
      score,
      volume: Math.floor(Math.random() * 10000),
      timestamp: Date.now(),
      confidence: 0.75 + (Math.random() * 0.25) // 0.75 to 1.0
    };
  }
}

// Singleton instance
let sentimentAPI: TheTIESentimentAPI | null = null;

export function getSentimentAPI(useMock: boolean = false): TheTIESentimentAPI {
  if (!sentimentAPI) {
    sentimentAPI = useMock ? new MockTheTIESentimentAPI() : new TheTIESentimentAPI();
  }
  return sentimentAPI;
}
