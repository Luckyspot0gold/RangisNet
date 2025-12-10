/**
 * API Route: Create Coinbase Commerce Charge
 * POST /api/payment/create-charge
 */

import { NextRequest, NextResponse } from 'next/server';
import { initCoinbaseCommerce, createPremiumCharge, PREMIUM_TIERS } from '@/lib/coinbase-commerce';

export async function POST(req: NextRequest) {
  try {
    const { tier, userEmail, userId } = await req.json();
    
    // Validate tier
    if (!tier || !PREMIUM_TIERS[tier as keyof typeof PREMIUM_TIERS]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: basic, pro, or enterprise' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!userEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, userId' },
        { status: 400 }
      );
    }
    
    // Initialize Coinbase Commerce
    const client = initCoinbaseCommerce();
    if (!client) {
      return NextResponse.json(
        { error: 'Coinbase Commerce not configured. Set COINBASE_COMMERCE_API_KEY' },
        { status: 500 }
      );
    }
    
    // Create charge
    const charge = await createPremiumCharge(
      client,
      tier as keyof typeof PREMIUM_TIERS,
      userEmail,
      userId
    );
    
    return NextResponse.json({
      success: true,
      charge: {
        id: charge.id,
        code: charge.code,
        hosted_url: charge.hosted_url,
        expires_at: charge.expires_at,
        pricing: charge.pricing
      }
    });
    
  } catch (error) {
    console.error('Charge creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create charge', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create a charge',
    tiers: PREMIUM_TIERS
  });
}
