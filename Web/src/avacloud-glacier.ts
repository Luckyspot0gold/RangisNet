/**
 * Avalanche Glacier API Integration
 * Real-time blockchain data streaming with haptic feedback
 * 
 * Patent: Crypto Clashers LLC (Aug 2025)
 * Formula: H(t) = A(t) × sin(2πf₀t) where f₀ = 432 Hz
 */

// Browser-compatible WebSocket (no @avalabs/chainkit needed)
class GlacierWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private lastValue = 0;
  private isConnected = false;

  constructor(
    private endpoint: string = 'wss://api.avax-test.network/ext/bc/C/ws',
    private onMessage?: (data: any) => void
  ) {}

  connect(): void {
    try {
      this.ws = new WebSocket(this.endpoint);

      this.ws.onopen = () => {
        console.log('✅ Connected to Glacier API');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Subscribe to new transactions
        this.subscribe();
      };

      this.ws.onmessage = (event) => {
        try {
          const tx = JSON.parse(event.data);
          this.processTransaction(tx);
          
          if (this.onMessage) {
            this.onMessage(tx);
          }
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from Glacier API');
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('❌ Failed to connect to Glacier:', error);
      this.attemptReconnect();
    }
  }

  private subscribe(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    // Subscribe to newHeads (new blocks) or pendingTransactions
    const subscribeMsg = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_subscribe',
      params: ['newPendingTransactions'] // or 'newHeads' for blocks
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  private processTransaction(tx: any): void {
    if (!tx.value) return;

    try {
      const currentValue = parseFloat(tx.value) || 0;
      
      if (this.lastValue === 0) {
        this.lastValue = currentValue;
        return;
      }

      // Patent-protected formula: A(t) = (V(t) - V(t-1)) / V(t-1)
      const a_t = ((currentValue - this.lastValue) / this.lastValue) * 10000;
      
      // Patent-protected formula: H(t) = A(t) × sin(2πf₀t) where f₀ = 432 Hz
      const f0 = 432; // Fundamental frequency
      const t = Date.now() / 1000; // Time in seconds
      const h_t = a_t * Math.sin(2 * Math.PI * f0 * t);
      
      // Trigger haptic feedback based on volatility
      const intensity = Math.abs(h_t) / 10000;
      this.triggerHaptic(intensity, a_t);
      
      this.lastValue = currentValue;

      // Log for debugging
      console.log(`📊 Volatility: ${a_t.toFixed(2)}%, Haptic: ${(intensity * 100).toFixed(2)}%`);
    } catch (error) {
      console.error('❌ Transaction processing error:', error);
    }
  }

  private triggerHaptic(intensity: number, volatility: number): void {
    // Only trigger on significant changes (> 1%)
    if (Math.abs(volatility) < 100) {
      return;
    }

    // Browser Vibration API
    if ('vibrate' in navigator) {
      const duration = Math.min(Math.max(intensity * 1000, 50), 500);
      navigator.vibrate(duration);
    }

    // Dispatch custom event for React components
    window.dispatchEvent(new CustomEvent('rangis:haptic', {
      detail: {
        intensity,
        volatility,
        timestamp: Date.now()
      }
    }));

    // Log haptic event
    console.log(`📳 Haptic triggered: ${(intensity * 100).toFixed(2)}% (volatility: ${volatility.toFixed(2)}%)`);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const glacierStream = new GlacierWebSocket();

// Export class for custom instances
export default GlacierWebSocket;

// React Hook for easy integration
export function useGlacierStream(onUpdate?: (data: any) => void) {
  if (typeof window === 'undefined') {
    return null; // SSR safe
  }

  const stream = new GlacierWebSocket(
    'wss://api.avax-test.network/ext/bc/C/ws',
    onUpdate
  );

  // Auto-connect on mount
  if (typeof window !== 'undefined' && !stream.getConnectionStatus()) {
    stream.connect();
  }

  return stream;
}
