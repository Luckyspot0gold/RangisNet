import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Used by:
 * - Google Cloud Run health checks
 * - Load balancers
 * - Monitoring systems
 * 
 * Returns service status and metadata
 */
export async function GET() {
  const status = {
    status: 'healthy',
    service: 'rangisnet-web',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      wallet: true,
      threed: true,
      haptics: true,
      audio: true,
      avalanche: true,
      thirdweb: !!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    },
  };

  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
