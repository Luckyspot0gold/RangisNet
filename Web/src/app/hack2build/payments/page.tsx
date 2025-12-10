/**
 * HACK2BUILD PAYMENTS PAGE
 * Live X402 Payment Demo for Avalanche Hack2Build 2025
 * 
 * Demonstrates:
 * - x402-rs facilitator integration
 * - USDC micropayments on Avalanche Fuji
 * - AI agent autonomous payments
 * - Real-time transaction verification
 * 
 * @copyright Reality Protocol LLC © 2025
 * @author Justin McCrea (Luckyspot0gold)
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X402Client, RANGIS_PRICE_TAGS, type X402PriceTag } from '@/lib/x402-client';

export default function Hack2BuildPaymentsPage() {
  const [facilitatorStatus, setFacilitatorStatus] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string>('rangi-detective');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Check facilitator status on load
  useEffect(() => {
    checkFacilitatorHealth();
  }, []);
  
  async function checkFacilitatorHealth() {
    try {
      const client = new X402Client();
      const health = await client.checkHealth();
      setFacilitatorStatus(health);
    } catch (err) {
      console.error('Facilitator health check failed:', err);
      setFacilitatorStatus({ status: 'offline', networks: [] });
    }
  }
  
  async function sendTestPayment() {
    if (!privateKey) {
      setError('Private key required for demo');
      return;
    }
    
    setLoading(true);
    setError('');
    setPaymentResult(null);
    
    try {
      const client = new X402Client(
        process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'http://localhost:8080',
        privateKey
      );
      
      const priceTag = RANGIS_PRICE_TAGS[selectedService];
      
      console.log('📤 Sending payment:', priceTag);
      
      const result = await client.sendPayment(priceTag);
      
      setPaymentResult(result);
      
      if (result.verified) {
        console.log('✅ Payment verified:', result.txHash);
      } else {
        setError(result.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }
  
  const priceTag = RANGIS_PRICE_TAGS[selectedService];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            💳 X402 PAYMENTS ON AVALANCHE
          </h1>
          <p className="text-xl text-gray-300">
            Live Micropayment Demo - Hack2Build 2025
          </p>
          <p className="text-lg text-blue-300">
            HTTP 402 Payment Required + On-Chain Settlement
          </p>
        </div>
        
        {/* Facilitator Status */}
        <Card className="bg-black/50 border-cyan-500">
          <CardHeader>
            <CardTitle className="text-cyan-400">X402-RS Facilitator Status</CardTitle>
            <CardDescription className="text-gray-400">
              Production Rust implementation for Avalanche C-Chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {facilitatorStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${facilitatorStatus.status === 'ok' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-2xl font-bold text-white">
                    {facilitatorStatus.status === 'ok' ? '✅ ONLINE' : '❌ OFFLINE'}
                  </span>
                </div>
                
                {facilitatorStatus.networks && facilitatorStatus.networks.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Supported Networks:</div>
                    <div className="flex flex-wrap gap-2">
                      {facilitatorStatus.networks.map((network: string) => (
                        <span 
                          key={network}
                          className="px-3 py-1 bg-blue-600 rounded-full text-sm font-mono"
                        >
                          {network}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={checkFacilitatorHealth}
                  variant="outline"
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Refresh Status
                </Button>
              </div>
            ) : (
              <div className="text-yellow-400">Checking facilitator...</div>
            )}
          </CardContent>
        </Card>
        
        {/* Payment Demo */}
        <Card className="bg-black/50 border-purple-500">
          <CardHeader>
            <CardTitle className="text-purple-400">Send Test Payment</CardTitle>
            <CardDescription className="text-gray-400">
              Demonstrate x402 micropayments on Avalanche Fuji testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Select Service:</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-3 bg-black border border-purple-500 rounded-lg text-white"
              >
                {Object.entries(RANGIS_PRICE_TAGS).map(([key, tag]) => (
                  <option key={key} value={key}>
                    {tag.description} - {tag.price} {tag.token}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Tag Display */}
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500">
              <div className="text-sm text-gray-400 mb-2">Payment Details:</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="text-xl font-bold text-purple-300">
                    {priceTag.price} {priceTag.token}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Network</div>
                  <div className="text-lg font-mono text-purple-300">
                    {priceTag.network}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">Pay To</div>
                  <div className="text-sm font-mono text-purple-300 break-all">
                    {priceTag.payTo}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Private Key Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Private Key (Fuji testnet - DEMO ONLY):
              </label>
              <Input
                type="password"
                placeholder="0x..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="bg-black border-purple-500 text-white font-mono"
              />
              <div className="text-xs text-yellow-400">
                ⚠️ For demo purposes only. Never use real mainnet keys in browser.
              </div>
            </div>
            
            {/* Send Button */}
            <Button
              onClick={sendTestPayment}
              disabled={loading || !privateKey || facilitatorStatus?.status !== 'ok'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
            >
              {loading ? '⏳ Sending Payment...' : '💳 Send Payment (x402)'}
            </Button>
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <div className="font-bold text-red-300">❌ Error:</div>
                <div className="text-red-200 text-sm mt-2">{error}</div>
              </div>
            )}
            
            {/* Payment Result */}
            {paymentResult && (
              <div className={`p-4 rounded-lg border ${paymentResult.verified ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
                <div className="font-bold text-2xl mb-4">
                  {paymentResult.verified ? '✅ PAYMENT VERIFIED!' : '❌ PAYMENT FAILED'}
                </div>
                
                {paymentResult.verified && paymentResult.txHash && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Transaction Hash:</div>
                    <div className="font-mono text-xs bg-black/50 p-2 rounded break-all">
                      {paymentResult.txHash}
                    </div>
                    <a
                      href={`https://testnet.snowtrace.io/tx/${paymentResult.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      View on Snowtrace →
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* What is x402? */}
        <Card className="bg-black/50 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-400">What is x402?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              <strong className="text-blue-300">x402</strong> is a protocol that enables blockchain payments 
              directly through HTTP using the native <code className="bg-black px-2 py-1 rounded">402 Payment Required</code> status code.
            </p>
            
            <div className="space-y-2">
              <div className="text-lg font-bold text-blue-300">How it works:</div>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Client requests protected resource</li>
                <li>Server responds <code className="bg-black px-2 py-1 rounded">HTTP 402</code> with payment details</li>
                <li>Client signs payment payload with private key</li>
                <li>Facilitator verifies signature matches price tag</li>
                <li>Facilitator submits transaction to Avalanche C-Chain</li>
                <li>Server grants access after confirmation</li>
              </ol>
            </div>
            
            <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500">
              <div className="font-bold text-blue-300 mb-2">Key Benefits:</div>
              <ul className="space-y-1 ml-4">
                <li>✅ <strong>No custody:</strong> Facilitator never holds funds</li>
                <li>✅ <strong>Native HTTP:</strong> Works with any HTTP client</li>
                <li>✅ <strong>Micropayments:</strong> 0.01-0.05 USDC per request</li>
                <li>✅ <strong>AI-friendly:</strong> Agents can pay autonomously</li>
                <li>✅ <strong>Avalanche-native:</strong> Fast finality, low fees</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* RangisNet Integration */}
        <Card className="bg-black/50 border-pink-500">
          <CardHeader>
            <CardTitle className="text-pink-400">RangisNet x402 Integration</CardTitle>
            <CardDescription className="text-gray-400">
              Financial cognition system with micropayment monetization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-4">
                RangisNet is the world's first <strong className="text-pink-300">financial cognition system</strong> that 
                enables 8+ billion humans to <strong>hear, feel, and see</strong> economics in real-time through:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-pink-900/30 rounded-lg border border-pink-500">
                  <div className="text-lg font-bold text-pink-300 mb-2">🎵 Harmonic Sonification</div>
                  <div className="text-sm">432Hz-based audio tones mapped to market states (7-Bell system)</div>
                </div>
                
                <div className="p-4 bg-pink-900/30 rounded-lg border border-pink-500">
                  <div className="text-lg font-bold text-pink-300 mb-2">📳 Haptic Feedback</div>
                  <div className="text-sm">Vibrational patterns convey volatility and momentum</div>
                </div>
                
                <div className="p-4 bg-pink-900/30 rounded-lg border border-pink-500">
                  <div className="text-lg font-bold text-pink-300 mb-2">🌀 3D/4D Visualization</div>
                  <div className="text-sm">Immaculate Spinor with spherical coordinates (VR-ready)</div>
                </div>
                
                <div className="p-4 bg-pink-900/30 rounded-lg border border-pink-500">
                  <div className="text-lg font-bold text-pink-300 mb-2">🤖 AI Agent Scoring</div>
                  <div className="text-sm">Rangi detective with recursive memory and truth detection</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500">
                <div className="font-bold text-yellow-300 mb-2">💰 Monetized with x402:</div>
                <ul className="space-y-1 text-sm">
                  <li>• Rangi Detective Dashboard: <strong>0.025 USDC</strong> per access</li>
                  <li>• Real-time Heartbeat: <strong>0.01 USDC</strong> per minute</li>
                  <li>• Agent Scoring API: <strong>0.05 USDC</strong> per request</li>
                  <li>• M3 Metrics: <strong>0.02 USDC</strong> per symbol</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <a
                href="/rangi-detective"
                className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg text-lg font-bold"
              >
                Try Rangi Detective (0.025 USDC) →
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* Technical Details */}
        <Card className="bg-black/50 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-300 font-mono">
              <div>
                <div className="text-green-400 font-bold mb-1">Facilitator:</div>
                <div className="bg-black p-2 rounded">x402-rs (Rust) @ {process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'http://localhost:8080'}</div>
              </div>
              
              <div>
                <div className="text-green-400 font-bold mb-1">Network:</div>
                <div className="bg-black p-2 rounded">Avalanche Fuji Testnet (Chain ID: 43113)</div>
              </div>
              
              <div>
                <div className="text-green-400 font-bold mb-1">Token:</div>
                <div className="bg-black p-2 rounded">USDC @ 0x5425890298aed601595a70AB815c96711a31Bc65</div>
              </div>
              
              <div>
                <div className="text-green-400 font-bold mb-1">GitHub:</div>
                <div className="bg-black p-2 rounded">
                  <a 
                    href="https://github.com/Luckyspot0gold/RangisNet" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Luckyspot0gold/RangisNet →
                  </a>
                </div>
              </div>
              
              <div>
                <div className="text-green-400 font-bold mb-1">Contact:</div>
                <div className="bg-black p-2 rounded">
                  Justin McCrea - justin@realityprotocol.io
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-white">
          <CardHeader>
            <CardTitle className="text-white text-2xl">🏆 Avalanche Hack2Build 2025</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-4">
            <p className="text-lg">
              <strong>RangisNet</strong> by Reality Protocol LLC - The financial cognition system 
              for 8+ billion humans + AI agents.
            </p>
            
            <div className="text-sm space-y-2">
              <div>📧 <strong>Email:</strong> StoneYardGames@proton.me</div>
              <div>🐙 <strong>GitHub:</strong> @Luckyspot0gold</div>
              <div>🌐 <strong>Live Demo:</strong> rangis.net</div>
              <div>💼 <strong>Company:</strong> Reality Protocol LLC (EIN: 39-3754298)</div>
            </div>
            
            <p className="italic text-gray-200">
              "I have a vision, you have the product, we can change the world together."
            </p>
            
            <div className="pt-4">
              <a
                href="https://arena.colosseum.org/hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-purple-900 rounded-lg text-xl font-bold hover:bg-gray-200"
              >
                Submit to Colosseum →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
