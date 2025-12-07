// API Route: /api/pte/route.ts
// Next.js API handler for PTE (Probability-Tactile-Execution)

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to handle client-side execution
let handleTrade: any;
if (typeof window === 'undefined') {
  // Server-side: This will be handled by the API route
  handleTrade = async (req: any) => {
    const { handleTrade: serverHandleTrade } = await import('../../../pte.js');
    return serverHandleTrade(req);
  };
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * POST /api/pte
 * Execute PTE trade with ICM/Teleporter cross-chain routing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.command && !body.pair) {
      return NextResponse.json(
        { error: 'Missing required field: command or pair' },
        { status: 400 }
      );
    }

    // Execute trade with multi-sensory feedback
    const result = await handleTrade({
      command: body.command || 'PTE_TRADE',
      pair: body.pair || 'AVAX/USD',
      amount: body.amount || '0.01',
      dfkAddress: body.dfkAddress,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('PTE API error:', error);
    
    return NextResponse.json(
      {
        error: 'Trade execution failed',
        message: error.message,
        ariaLive: 'assertive',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pte
 * Health check and status endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'PTE (Probability-Tactile-Execution)',
    status: 'operational',
    network: 'fuji',
    teleporter: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
    features: [
      'Pyth Oracle Integration',
      'PRM Harmonic Analysis',
      'ICM/Teleporter Warp Routing',
      'Multi-Sensory Feedback',
    ],
    timestamp: new Date().toISOString(),
  });
}
