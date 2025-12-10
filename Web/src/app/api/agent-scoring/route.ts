/**
 * AVALANCHE X402 AGENT SCORING API
 * REST endpoint for Rangi's Truth Detective system
 */

import { NextRequest, NextResponse } from 'next/server';
import { rangi } from '@/lib/ai-agent-scoring';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/agent-scoring
 * Returns Rangi's current brain state and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const brainState = rangi.getRecursiveBrainState();
    const report = rangi.generateReport();
    
    return NextResponse.json({
      success: true,
      agent: brainState,
      report,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Agent scoring error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve agent state',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-scoring
 * Actions: verify, detect, progress, deploy, store
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    let result: any;
    
    switch (action) {
      case 'verify':
        // Verify blockchain transaction
        result = await rangi.verifyBlockTransaction(data.txHash);
        break;
        
      case 'detect':
        // Detect market truth
        result = await rangi.detectTruth(data.marketData);
        break;
        
      case 'progress':
        // Progress civilization
        result = await rangi.progressCivilization(data.contribution);
        break;
        
      case 'deploy':
        // Deploy M3 arsenal
        result = await rangi.deployM3Arsenal(data.target);
        break;
        
      case 'store':
        // Store memory
        result = await rangi.storeMemory(data.memory);
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Agent action error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Action failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
