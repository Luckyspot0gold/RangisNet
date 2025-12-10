/**
 * Market Data API Route - Batch Query
 * POST /api/market-data/batch
 * 
 * Returns aggregated market data for multiple symbols
 * Request body: { symbols: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateBatchMarketData } from '@/lib/api-aggregator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { error: 'symbols array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    if (symbols.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 symbols allowed per batch request' },
        { status: 400 }
      );
    }
    
    // Fetch aggregated market data for all symbols
    const marketDataMap = await aggregateBatchMarketData(symbols.map(s => s.toUpperCase()));
    
    // Convert Map to object for JSON response
    const marketDataObject: Record<string, any> = {};
    marketDataMap.forEach((value, key) => {
      marketDataObject[key] = value;
    });
    
    return NextResponse.json(
      {
        count: marketDataMap.size,
        data: marketDataObject
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
        }
      }
    );
  } catch (error) {
    console.error('Batch market data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch batch market data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
