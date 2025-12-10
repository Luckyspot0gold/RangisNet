/**
 * API Route: Coinbase Commerce Webhook Handler
 * POST /api/payment/webhook
 * 
 * Handles payment status updates from Coinbase Commerce
 */

import { NextRequest, NextResponse } from 'next/server';
import { CoinbaseCommerceClient } from '@/lib/coinbase-commerce';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('X-CC-Webhook-Signature');
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    
    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing webhook signature or secret' },
        { status: 401 }
      );
    }
    
    // Get raw body
    const body = await req.text();
    
    // Verify signature
    const client = new CoinbaseCommerceClient({
      apiKey: process.env.COINBASE_COMMERCE_API_KEY || '',
      webhookSecret
    });
    
    const isValid = client.verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // Parse event
    const event = JSON.parse(body);
    const { type, data } = event;
    
    console.log(`Coinbase Commerce webhook: ${type}`, data);
    
    // Handle different event types
    switch (type) {
      case 'charge:created':
        console.log('New charge created:', data.id);
        break;
        
      case 'charge:confirmed':
        console.log('Payment confirmed:', data.id);
        // TODO: Grant user access to premium features
        // - Update Supabase user record
        // - Send confirmation email
        // - Activate premium tier
        break;
        
      case 'charge:failed':
        console.log('Payment failed:', data.id);
        // TODO: Notify user of payment failure
        break;
        
      case 'charge:delayed':
        console.log('Payment delayed:', data.id);
        // TODO: Send reminder to user
        break;
        
      case 'charge:pending':
        console.log('Payment pending:', data.id);
        break;
        
      case 'charge:resolved':
        console.log('Payment resolved:', data.id);
        break;
        
      default:
        console.log('Unknown event type:', type);
    }
    
    // Return success
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Coinbase Commerce webhook endpoint',
    supported_events: [
      'charge:created',
      'charge:confirmed',
      'charge:failed',
      'charge:delayed',
      'charge:pending',
      'charge:resolved'
    ]
  });
}
