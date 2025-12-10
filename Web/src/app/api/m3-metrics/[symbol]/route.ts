/**
 * API Route: M3 McCrea Market Metrics
 * GET /api/m3-metrics/[symbol]
 * 
 * Returns complete M3 metrics suite for any symbol:
 * - Whale_Splash indicators
 * - Tax_Axe evaluations
 * - Trumpet_Dumpet warnings
 * - Market_Melee character
 * - Cymatics patterns
 * - Harmonic data transfer
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateMarketData, toMarketData } from '@/lib/api-aggregator';
import { M3MetricsEngine, HarmonicDataTransfer } from '@/lib/mccrea-metrics-m3';

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }
    
    // Get market data
    const aggregatedData = await aggregateMarketData(symbol.toUpperCase());
    
    if (!aggregatedData) {
      return NextResponse.json(
        { error: `No data available for ${symbol}` },
        { status: 404 }
      );
    }
    
    // Convert to MarketData format for M3 metrics
    const marketData = toMarketData(aggregatedData);
    
    // Calculate complete M3 metrics suite
    const m3Metrics = M3MetricsEngine.calculateM3Suite(marketData);
    
    // Generate harmonic frequencies for AI communication
    const harmonicData = HarmonicDataTransfer.encodeToFrequencies(marketData);
    
    // Return comprehensive response
    return NextResponse.json({
      symbol: aggregatedData.symbol,
      timestamp: aggregatedData.timestamp,
      marketData: {
        price: aggregatedData.price,
        volume24h: aggregatedData.volume24h,
        priceChange24h: aggregatedData.priceChange24h,
        confidence: aggregatedData.confidence,
        sources: aggregatedData.sources
      },
      m3Metrics: {
        whale: m3Metrics.whale,
        taxAxe: m3Metrics.taxAxe,
        trumpet: m3Metrics.trumpet,
        character: m3Metrics.character,
        cymatics: m3Metrics.cymatics,
        activeBell: {
          id: m3Metrics.activeBell.id,
          name: m3Metrics.activeBell.name,
          frequency: m3Metrics.activeBell.frequency,
          color: m3Metrics.activeBell.color
        },
        fearGreed: m3Metrics.fearGreed
      },
      harmonicData: {
        frequencies: harmonicData,
        encoding: 'Hz',
        description: 'Frequency array for AI-optimized data transfer'
      },
      accessibility: {
        audioDescription: `${marketData.symbol} is at ${m3Metrics.activeBell.name} (${m3Metrics.activeBell.frequency}Hz). ` +
          `Fear & Greed index: ${m3Metrics.fearGreed.toFixed(0)}/100. ` +
          (m3Metrics.whale ? `Whale activity detected: ${m3Metrics.whale.type} with ${m3Metrics.whale.intensity.toFixed(0)}% intensity. ` : '') +
          `Tax pressure: ${m3Metrics.taxAxe.taxPressure.toFixed(0)}/100. ` +
          `Market character is ${m3Metrics.character.animation}.`,
        hapticPattern: m3Metrics.whale?.hapticPattern || [100, 50, 100],
        colorScheme: m3Metrics.activeBell.color
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
      }
    });
    
  } catch (error) {
    console.error('M3 metrics calculation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate M3 metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Symbols array is required' },
        { status: 400 }
      );
    }
    
    if (symbols.length > 25) {
      return NextResponse.json(
        { error: 'Maximum 25 symbols per request' },
        { status: 400 }
      );
    }
    
    // Calculate M3 metrics for all symbols
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const aggregatedData = await aggregateMarketData(symbol.toUpperCase());
          if (!aggregatedData) return null;
          
          const marketData = toMarketData(aggregatedData);
          const m3Metrics = M3MetricsEngine.calculateM3Suite(marketData);
          const harmonicData = HarmonicDataTransfer.encodeToFrequencies(marketData);
          
          return {
            symbol: aggregatedData.symbol,
            m3Metrics,
            harmonicData
          };
        } catch {
          return null;
        }
      })
    );
    
    // Filter out failed calculations
    const successfulResults = results.filter(r => r !== null);
    
    return NextResponse.json({
      count: successfulResults.length,
      metrics: successfulResults
    });
    
  } catch (error) {
    console.error('Batch M3 metrics calculation failed:', error);
    return NextResponse.json(
      { error: 'Failed to calculate batch M3 metrics' },
      { status: 500 }
    );
  }
}
