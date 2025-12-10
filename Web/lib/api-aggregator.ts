/**
 * Market Data API Aggregation Layer
 * RangisNet Layer 1.5 - Live Market Data Integration
 * 
 * Aggregates market data from multiple sources with weighted averaging
 * and outlier detection for reliable real-time data.
 */

import axios from 'axios';

export interface MarketDataPoint {
  symbol: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
  timestamp: number;
  source: string;
}

export interface AggregatedMarketData {
  symbol: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
  timestamp: number;
  sources: string[];
  confidence: number;
}

// Export MarketData type for M3 metrics compatibility
export interface MarketData {
  symbol: string;
  price: number;
  prevPrice: number;
  volume: number;
  volume24h: number; // Added for M3 metrics compatibility
  volatility: number;
  marketCap: number;
  priceChange24h: number;
  timestamp: number;
}

// Data source weights based on liquidity and reliability
const SOURCE_WEIGHTS = {
  binance: 0.40,
  coinbase: 0.30,
  coingecko: 0.20,
  coinstats: 0.10
};

/**
 * Fetches market data from Binance
 */
async function fetchBinanceData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    const ticker = `${symbol.toUpperCase()}USDT`;
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr`, {
      params: { symbol: ticker },
      timeout: 5000
    });
    
    return {
      symbol,
      price: parseFloat(response.data.lastPrice),
      volume24h: parseFloat(response.data.volume),
      priceChange24h: parseFloat(response.data.priceChangePercent),
      timestamp: Date.now(),
      source: 'binance'
    };
  } catch (error) {
    console.error(`Binance fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches market data from Coinbase
 */
async function fetchCoinbaseData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    const pair = `${symbol.toUpperCase()}-USD`;
    const response = await axios.get(`https://api.coinbase.com/v2/prices/${pair}/spot`, {
      timeout: 5000
    });
    
    const statsResponse = await axios.get(`https://api.pro.coinbase.com/products/${pair}/stats`, {
      timeout: 5000
    });
    
    return {
      symbol,
      price: parseFloat(response.data.data.amount),
      volume24h: parseFloat(statsResponse.data.volume),
      priceChange24h: parseFloat(statsResponse.data.open) > 0 
        ? ((parseFloat(statsResponse.data.last) - parseFloat(statsResponse.data.open)) / parseFloat(statsResponse.data.open)) * 100
        : 0,
      timestamp: Date.now(),
      source: 'coinbase'
    };
  } catch (error) {
    console.error(`Coinbase fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches market data from CoinGecko
 */
async function fetchCoinGeckoData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    const coinId = symbol.toLowerCase();
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_vol: true,
        include_24hr_change: true
      },
      timeout: 5000
    });
    
    const data = response.data[coinId];
    if (!data) return null;
    
    return {
      symbol,
      price: data.usd,
      volume24h: data.usd_24h_vol || 0,
      priceChange24h: data.usd_24h_change || 0,
      timestamp: Date.now(),
      source: 'coingecko'
    };
  } catch (error) {
    console.error(`CoinGecko fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches market data from CoinStats
 */
async function fetchCoinStatsData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    const coinId = symbol.toLowerCase();
    const response = await axios.get(`https://api.coinstats.app/public/v1/coins/${coinId}`, {
      params: { currency: 'USD' },
      timeout: 5000
    });
    
    const coin = response.data.coin;
    
    return {
      symbol,
      price: coin.price,
      volume24h: coin.volume || 0,
      priceChange24h: coin.priceChange1d || 0,
      timestamp: Date.now(),
      source: 'coinstats'
    };
  } catch (error) {
    console.error(`CoinStats fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches market data from Avalanche Subnet (if available)
 */
async function fetchAvalancheData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    // This would connect to your custom Avalanche subnet endpoint
    // For now, using placeholder logic
    const subnetEndpoint = process.env.AVALANCHE_SUBNET_RPC || 'http://localhost:9650';
    
    // Implementation would query your subnet's market data module
    // Placeholder for now
    return null;
  } catch (error) {
    console.error(`Avalanche fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches market data from Solana (if available)
 */
async function fetchSolanaData(symbol: string): Promise<MarketDataPoint | null> {
  try {
    // This would connect to Solana DEXes like Jupiter or Raydium
    // Placeholder for now
    return null;
  } catch (error) {
    console.error(`Solana fetch error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Detects and removes outliers using the Interquartile Range (IQR) method
 */
function removeOutliers(dataPoints: MarketDataPoint[]): MarketDataPoint[] {
  if (dataPoints.length < 3) return dataPoints;
  
  const prices = dataPoints.map(d => d.price).sort((a, b) => a - b);
  const q1 = prices[Math.floor(prices.length * 0.25)];
  const q3 = prices[Math.floor(prices.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return dataPoints.filter(d => d.price >= lowerBound && d.price <= upperBound);
}

/**
 * Calculates weighted average of market data from multiple sources
 */
function calculateWeightedAverage(dataPoints: MarketDataPoint[]): AggregatedMarketData {
  const validData = removeOutliers(dataPoints);
  
  if (validData.length === 0) {
    throw new Error('No valid data points available after outlier removal');
  }
  
  let totalWeight = 0;
  let weightedPrice = 0;
  let weightedVolume = 0;
  let weightedPriceChange = 0;
  
  validData.forEach(dataPoint => {
    const weight = SOURCE_WEIGHTS[dataPoint.source as keyof typeof SOURCE_WEIGHTS] || 0.1;
    totalWeight += weight;
    weightedPrice += dataPoint.price * weight;
    weightedVolume += dataPoint.volume24h * weight;
    weightedPriceChange += dataPoint.priceChange24h * weight;
  });
  
  const confidence = Math.min(validData.length / Object.keys(SOURCE_WEIGHTS).length, 1);
  
  return {
    symbol: validData[0].symbol,
    price: weightedPrice / totalWeight,
    volume24h: weightedVolume / totalWeight,
    priceChange24h: weightedPriceChange / totalWeight,
    timestamp: Date.now(),
    sources: validData.map(d => d.source),
    confidence
  };
}

/**
 * Generate mock market data when API calls fail (fallback for demos)
 */
function generateMockData(symbol: string): MarketDataPoint {
  const basePrice = symbol === 'AVAX' ? 35 : symbol === 'BTC' ? 42000 : symbol === 'ETH' ? 2200 : 1.0;
  const randomChange = (Math.random() - 0.5) * 10; // -5% to +5%
  
  return {
    symbol,
    price: basePrice * (1 + randomChange / 100),
    volume24h: Math.random() * 1000000000,
    priceChange24h: randomChange,
    timestamp: Date.now(),
    source: 'mock'
  };
}

/**
 * Main aggregation function - fetches from all sources and returns weighted average
 */
export async function aggregateMarketData(symbol: string): Promise<AggregatedMarketData> {
  const fetchPromises = [
    fetchBinanceData(symbol),
    fetchCoinbaseData(symbol),
    fetchCoinGeckoData(symbol),
    fetchCoinStatsData(symbol),
    fetchAvalancheData(symbol),
    fetchSolanaData(symbol)
  ];
  
  const results = await Promise.allSettled(fetchPromises);
  const dataPoints: MarketDataPoint[] = results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => (r as PromiseFulfilledResult<MarketDataPoint | null>).value!)
    .filter(Boolean);
  
  // Fallback to mock data if all API calls fail (useful for demos/testing)
  if (dataPoints.length === 0) {
    console.warn(`All API calls failed for ${symbol}, using mock data`);
    dataPoints.push(generateMockData(symbol));
  }
  
  return calculateWeightedAverage(dataPoints);
}

/**
 * Batch aggregation for multiple symbols
 */
export async function aggregateBatchMarketData(symbols: string[]): Promise<Map<string, AggregatedMarketData>> {
  const results = new Map<string, AggregatedMarketData>();
  
  const promises = symbols.map(async (symbol) => {
    try {
      const data = await aggregateMarketData(symbol);
      results.set(symbol, data);
    } catch (error) {
      console.error(`Failed to aggregate data for ${symbol}:`, error);
    }
  });
  
  await Promise.all(promises);
  return results;
}

/**
 * Convert AggregatedMarketData to MarketData format for M3 metrics
 */
export function toMarketData(aggregated: AggregatedMarketData): MarketData {
  return {
    symbol: aggregated.symbol,
    price: aggregated.price,
    prevPrice: aggregated.price * (1 - aggregated.priceChange24h / 100), // Calculate from price change
    volume: aggregated.volume24h,
    volume24h: aggregated.volume24h,
    volatility: Math.abs(aggregated.priceChange24h), // Simplified volatility from price change
    marketCap: 0, // Not available in aggregated data, would need separate API call
    priceChange24h: aggregated.priceChange24h,
    timestamp: aggregated.timestamp
  };
}
