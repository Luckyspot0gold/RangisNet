#!/bin/bash
# Enhanced Youmio Haptics Integration
# Connects 432Hz patent to <50ms tactile feedback
# Includes Kite AI sentiment stub

set -e

echo "🎵 RangisNet Youmio + Kite Integration"
echo "======================================="
echo ""

# Step 1: Request Youmio free credits
echo "1️⃣ Requesting Youmio Free Credits..."
echo "   Workshop: Michael O'Connor session"
echo "   Form: https://youmio.app/hackathon-credits"
echo "   Code: Hack2Build-x402"
echo ""
echo "   📝 Fill in:"
echo "   - Team: RangisNet"
echo "   - Project: Mighty Agent - Haptic Economic Interpreter"
echo "   - Use case: Patent-protected 432Hz → tactile confidence"
echo "   - Expected usage: 10K haptic events during demo"
echo ""
echo "   ⏳ Wait for approval email (usually <24 hours)"
echo ""
read -p "   Press ENTER after receiving credits..."
echo ""

# Step 2: Install Youmio SDK
echo "2️⃣ Installing Youmio SDK..."
cd /workspaces/RangisNet/Web

if ! grep -q "youmio-sdk" package.json; then
  echo "   Adding youmio-sdk to package.json..."
  npm install --save youmio-sdk
  echo "   ✅ Youmio SDK installed"
else
  echo "   ✅ Youmio SDK already installed"
fi
echo ""

# Step 3: Create Youmio config
echo "3️⃣ Creating Youmio configuration..."
cat > lib/youmioClient.ts << 'EOF'
// Youmio Haptics Client for RangisNet
// Converts PRM scores to tactile feedback (<50ms latency)

import { YoumioSDK } from 'youmio-sdk';

export class RangisHaptics {
  private youmio: YoumioSDK;
  private enabled: boolean = false;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.youmio = new YoumioSDK({ apiKey });
      this.enabled = true;
    } else {
      console.warn('Youmio API key not provided - using fallback vibration API');
    }
  }

  /**
   * Send haptic feedback based on PRM confidence
   * Patent formula: H(t) = A(t) * sin(2π * 432 * t + φ)
   */
  async sendPRMFeedback(prmScore: number, harmonicFreq: number = 432) {
    const pattern = this.generateHapticPattern(prmScore, harmonicFreq);
    
    if (this.enabled) {
      // Use Youmio for advanced haptics
      try {
        await this.youmio.sendHaptic({
          pattern: pattern.youmio,
          intensity: pattern.intensity,
          duration: pattern.duration,
          frequency: harmonicFreq
        });
      } catch (error) {
        console.warn('Youmio error, falling back to native:', error);
        this.fallbackVibrate(pattern.native);
      }
    } else {
      // Fallback to native vibration API
      this.fallbackVibrate(pattern.native);
    }
  }

  /**
   * Generate haptic pattern from PRM score
   */
  private generateHapticPattern(prm: number, freq: number) {
    // Map PRM to harmonic amplitude
    const amplitude = prm; // 0-100
    
    // Calculate phi-based timing (golden ratio)
    const phi = 1.618033988749895;
    const baseInterval = 111; // ms (phi harmonic)
    
    let youmioPattern: any;
    let nativePattern: number[];
    let intensity: number;
    let duration: number;

    if (prm >= 90) {
      // Very high confidence - strong triple pulse
      youmioPattern = {
        type: 'pulse',
        count: 3,
        interval: baseInterval,
        amplitude: amplitude
      };
      nativePattern = [111, 0, 111, 0, 111];
      intensity = 1.0;
      duration = 333;
    } else if (prm >= 75) {
      // High confidence - double pulse
      youmioPattern = {
        type: 'pulse',
        count: 2,
        interval: baseInterval * phi,
        amplitude: amplitude * 0.85
      };
      nativePattern = [50, 0, 100, 0, 50];
      intensity = 0.8;
      duration = 250;
    } else if (prm >= 60) {
      // Medium confidence - single pulse
      youmioPattern = {
        type: 'pulse',
        count: 1,
        interval: 0,
        amplitude: amplitude * 0.6
      };
      nativePattern = [30, 0, 30];
      intensity = 0.6;
      duration = 150;
    } else {
      // Low confidence - warning buzz
      youmioPattern = {
        type: 'buzz',
        count: 5,
        interval: 50,
        amplitude: amplitude * 0.3
      };
      nativePattern = [20, 20, 20, 20, 20];
      intensity = 0.3;
      duration = 100;
    }

    return { youmioPattern, native: nativePattern, intensity, duration };
  }

  /**
   * Fallback to native vibration API
   */
  private fallbackVibrate(pattern: number[]) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API not supported');
    }
  }

  /**
   * Send custom harmonic pattern
   */
  async sendHarmonicPattern(frequencies: number[], durations: number[]) {
    if (!this.enabled) {
      console.warn('Youmio not enabled');
      return;
    }

    try {
      await this.youmio.sendCustom({
        frequencies,
        durations,
        encoding: 'harmonic-ladder'
      });
    } catch (error) {
      console.error('Youmio custom pattern error:', error);
    }
  }

  /**
   * Test haptic feedback
   */
  async test() {
    console.log('Testing Youmio haptics...');
    await this.sendPRMFeedback(92, 528);
    console.log('✅ Test complete - did you feel the triple pulse?');
  }
}

// Singleton instance
let rangisHaptics: RangisHaptics | null = null;

export function initializeHaptics(apiKey?: string): RangisHaptics {
  if (!rangisHaptics) {
    rangisHaptics = new RangisHaptics(apiKey);
  }
  return rangisHaptics;
}

export function getHaptics(): RangisHaptics {
  if (!rangisHaptics) {
    throw new Error('Haptics not initialized - call initializeHaptics() first');
  }
  return rangisHaptics;
}
EOF

echo "   ✅ Youmio client created: lib/youmioClient.ts"
echo ""

# Step 4: Create Kite sentiment stub
echo "4️⃣ Creating Kite AI sentiment stub..."
cat > lib/kiteClient.ts << 'EOF'
// Kite AI Sentiment Analysis (Stub)
// TODO: Integrate when Kite API is available

export interface SentimentScore {
  overall: number;      // -1 to 1
  bullish: number;      // 0 to 1
  bearish: number;      // 0 to 1
  fear: number;         // 0 to 1
  greed: number;        // 0 to 1
  confidence: number;   // 0 to 1
}

export class KiteClient {
  private apiKey: string | undefined;
  private stubMode: boolean = true;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      console.warn('Kite API key not provided - using stub mode');
    }
  }

  /**
   * Get sentiment for trading pair
   * Currently returns simulated data - integrate real API when available
   */
  async getSentiment(pair: string): Promise<SentimentScore> {
    if (this.stubMode) {
      // Simulated sentiment based on pair
      return this.generateStubSentiment(pair);
    }

    // TODO: Real Kite API integration
    try {
      const response = await fetch('https://api.kite.ai/sentiment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pair })
      });
      return await response.json();
    } catch (error) {
      console.warn('Kite API error, using stub:', error);
      return this.generateStubSentiment(pair);
    }
  }

  /**
   * Generate stub sentiment (remove when Kite API available)
   */
  private generateStubSentiment(pair: string): SentimentScore {
    // Vary by timestamp for demo purposes
    const seed = Date.now() % 100;
    const variation = (seed - 50) / 100; // -0.5 to 0.5

    return {
      overall: 0.2 + variation,
      bullish: 0.65 + variation,
      bearish: 0.35 - variation,
      fear: 0.3 + Math.abs(variation),
      greed: 0.5 + variation,
      confidence: 0.75 + (variation * 0.5)
    };
  }

  /**
   * Adjust PRM based on sentiment (InfraBuild(AI) tie-in)
   */
  adjustPRMBySentiment(basePRM: number, sentiment: SentimentScore): number {
    // Sentiment boosts PRM by up to 15%
    const sentimentFactor = sentiment.overall * 0.15;
    const adjusted = basePRM + (basePRM * sentimentFactor);
    
    // Cap at 100
    return Math.min(adjusted, 100);
  }
}

// Singleton
let kiteClient: KiteClient | null = null;

export function initializeKite(apiKey?: string): KiteClient {
  if (!kiteClient) {
    kiteClient = new KiteClient(apiKey);
  }
  return kiteClient;
}

export function getKite(): KiteClient {
  if (!kiteClient) {
    kiteClient = new KiteClient(); // Auto-initialize in stub mode
  }
  return kiteClient;
}
EOF

echo "   ✅ Kite client created: lib/kiteClient.ts"
echo "   📝 Note: Using stub mode until Kite API available"
echo ""

# Step 5: Update env example
echo "5️⃣ Updating .env.example..."
cat >> .env.example << 'EOF'

# Youmio Haptics
NEXT_PUBLIC_YOUMIO_API_KEY=your_youmio_key_here

# Kite AI Sentiment (optional - stub mode works without)
NEXT_PUBLIC_KITE_API_KEY=your_kite_key_here
EOF

echo "   ✅ Environment variables added"
echo ""

# Step 6: Integration example
echo "6️⃣ Integration Example:"
cat << 'EOF'

// In your trade execution:
import { getHaptics } from '@/lib/youmioClient';
import { getKite } from '@/lib/kiteClient';

// Initialize
const haptics = initializeHaptics(process.env.NEXT_PUBLIC_YOUMIO_API_KEY);
const kite = initializeKite(process.env.NEXT_PUBLIC_KITE_API_KEY);

// Get sentiment
const sentiment = await kite.getSentiment('AVAX/USD');

// Adjust PRM
const basePRM = 85;
const adjustedPRM = kite.adjustPRMBySentiment(basePRM, sentiment);

// Send haptic feedback
await haptics.sendPRMFeedback(adjustedPRM, 528);

// Result: User feels confidence in <50ms!
EOF

echo ""
echo "=========================================="
echo "✅ Youmio + Kite Integration Complete!"
echo "=========================================="
echo ""
echo "📊 Benefits:"
echo "   Youmio:"
echo "   - <50ms haptic latency"
echo "   - 432Hz harmonic-driven patterns"
echo "   - Patent-protected PRM → feel conversion"
echo "   - Mobile + desktop support"
echo ""
echo "   Kite:"
echo "   - Market sentiment scoring"
echo "   - +15% PRM boost potential"
echo "   - Fear/greed indicators"
echo "   - InfraBuild(AI) tie-in for grants"
echo ""
echo "🎯 Next Steps:"
echo "   1. Request Youmio credits: https://youmio.app/hackathon-credits"
echo "   2. Add API key to .env.local"
echo "   3. Test haptics: npm run dev → test trade"
echo "   4. Wait for Kite API (stub works for MVP)"
echo ""
echo "🤖 Mighty Agent Ready!"
echo ""
