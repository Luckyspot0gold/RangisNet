/**
 * WebSocket Server for Real-Time Market Data
 * RangisNet Layer 1.5 - Live Market Data Integration
 * 
 * Provides WebSocket streaming for real-time market data and PRM analysis
 */

import { WebSocketServer, WebSocket } from 'ws';
import { aggregateMarketData } from './lib/api-aggregator';
import { analyzePRM } from './lib/prm-engine';

interface ClientSubscription {
  ws: WebSocket;
  symbols: Set<string>;
  lastUpdate: Map<string, number>;
}

class MarketDataWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, ClientSubscription> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private port: number;
  private updateIntervalMs: number;

  constructor(port: number = 8080, updateIntervalMs: number = 5000) {
    this.port = port;
    this.updateIntervalMs = updateIntervalMs;
    this.wss = new WebSocketServer({ port: this.port });
  }

  /**
   * Start the WebSocket server
   */
  start(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');
      
      // Initialize client subscription
      this.clients.set(ws, {
        ws,
        symbols: new Set(),
        lastUpdate: new Map()
      });
      
      // Send welcome message
      this.sendMessage(ws, {
        type: 'connected',
        message: 'Connected to RangisNet Market Data WebSocket',
        timestamp: Date.now()
      });
      
      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('Error parsing client message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });
      
      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
    
    // Start update loop
    this.startUpdateLoop();
    
    console.log(`🚀 WebSocket server started on port ${this.port}`);
    console.log(`Update interval: ${this.updateIntervalMs}ms`);
  }

  /**
   * Handle messages from clients
   */
  private handleClientMessage(ws: WebSocket, message: any): void {
    const client = this.clients.get(ws);
    if (!client) return;
    
    switch (message.type) {
      case 'subscribe':
        if (message.symbols && Array.isArray(message.symbols)) {
          message.symbols.forEach((symbol: string) => {
            client.symbols.add(symbol.toUpperCase());
          });
          this.sendMessage(ws, {
            type: 'subscribed',
            symbols: Array.from(client.symbols),
            timestamp: Date.now()
          });
          console.log(`Client subscribed to: ${Array.from(client.symbols).join(', ')}`);
        }
        break;
        
      case 'unsubscribe':
        if (message.symbols && Array.isArray(message.symbols)) {
          message.symbols.forEach((symbol: string) => {
            client.symbols.delete(symbol.toUpperCase());
          });
          this.sendMessage(ws, {
            type: 'unsubscribed',
            symbols: message.symbols,
            timestamp: Date.now()
          });
        }
        break;
        
      case 'ping':
        this.sendMessage(ws, {
          type: 'pong',
          timestamp: Date.now()
        });
        break;
        
      default:
        this.sendError(ws, `Unknown message type: ${message.type}`);
    }
  }

  /**
   * Start the periodic update loop
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(async () => {
      await this.broadcastUpdates();
    }, this.updateIntervalMs);
  }

  /**
   * Broadcast updates to all subscribed clients
   */
  private async broadcastUpdates(): Promise<void> {
    // Collect all unique symbols from all clients
    const allSymbols = new Set<string>();
    this.clients.forEach(client => {
      client.symbols.forEach(symbol => allSymbols.add(symbol));
    });
    
    if (allSymbols.size === 0) return;
    
    // Fetch data for all symbols in parallel
    const updatePromises = Array.from(allSymbols).map(async (symbol) => {
      try {
        const marketData = await aggregateMarketData(symbol);
        const prmAnalysis = analyzePRM(marketData);
        return { symbol, marketData, prmAnalysis, error: null };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return { symbol, marketData: null, prmAnalysis: null, error: error.message };
      }
    });
    
    const updates = await Promise.all(updatePromises);
    
    // Send updates to subscribed clients
    this.clients.forEach((client, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        updates.forEach(update => {
          if (client.symbols.has(update.symbol)) {
            if (update.error) {
              this.sendError(ws, `Error fetching ${update.symbol}: ${update.error}`);
            } else {
              this.sendMessage(ws, {
                type: 'market-update',
                symbol: update.symbol,
                marketData: update.marketData,
                prmAnalysis: update.prmAnalysis,
                timestamp: Date.now()
              });
              
              // Update last update time
              client.lastUpdate.set(update.symbol, Date.now());
            }
          }
        });
      }
    });
  }

  /**
   * Send a message to a client
   */
  private sendMessage(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send an error message to a client
   */
  private sendError(ws: WebSocket, error: string): void {
    this.sendMessage(ws, {
      type: 'error',
      error,
      timestamp: Date.now()
    });
  }

  /**
   * Stop the WebSocket server
   */
  stop(): void {
    console.log('Stopping WebSocket server...');
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Close all client connections
    this.clients.forEach((client, ws) => {
      ws.close();
    });
    
    this.wss.close(() => {
      console.log('WebSocket server stopped');
    });
  }
}

// Main execution
if (require.main === module) {
  const port = parseInt(process.env.WS_PORT || '8080');
  const updateIntervalMs = parseInt(process.env.WS_UPDATE_INTERVAL || '5000');
  
  const server = new MarketDataWebSocketServer(port, updateIntervalMs);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down...');
    server.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down...');
    server.stop();
    process.exit(0);
  });
  
  server.start();
}

export { MarketDataWebSocketServer };
