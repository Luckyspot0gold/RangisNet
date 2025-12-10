/**
 * Market Data API Route - Single Symbol
 * GET /api/market-data/[symbol]
 * 
 * Returns aggregated market data from multiple sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateMarketData } from '@/lib/api-aggregator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }
    
    // Fetch aggregated market data
    const marketData = await aggregateMarketData(symbol.toUpperCase());
    
    return NextResponse.json(marketData, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
      }
    });
  } catch (error) {
    console.error('Market data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
