#!/usr/bin/env node

/**
 * RangisNet MCP Server
 * 
 * Model Context Protocol server that exposes RangisNet's Probability Tensor Engine (PTE)
 * and browser automation capabilities to AI agents.
 * 
 * @author Reality Protocol LLC
 * @version 1.0.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PTEEngine } from '../../../Web/src/pte-engine.js';
import { SensoryMapper } from '../../../Web/src/sensory-mapper.js';

// Tool schemas
const AnalyzeMarketSchema = z.object({
  symbol: z.string().describe('Market symbol (e.g., BTC/USD)'),
  rsi: z.number().min(0).max(100).describe('Relative Strength Index'),
  vix: z.number().min(0).max(100).describe('Volatility Index'),
  sentiment: z.number().min(-1).max(1).describe('Market sentiment (-1 to 1)'),
  volume: z.number().min(0).describe('Trading volume'),
});

const ExecuteTransactionSchema = z.object({
  walletType: z.enum(['phantom', 'metamask', 'coinbase']).describe('Wallet type'),
  action: z.enum(['buy', 'sell', 'swap']).describe('Transaction action'),
  amount: z.number().positive().describe('Transaction amount'),
  asset: z.string().describe('Asset symbol (e.g., BTC, ETH, AVAX)'),
  minPRM: z.number().min(0).max(1).default(0.3).describe('Minimum PRM threshold'),
});

const PlaySensoryFeedbackSchema = z.object({
  prm: z.number().min(0).max(1).describe('Probability Resonance Metric'),
  action: z.enum(['send', 'wait', 'reject']).describe('Recommended action'),
});

// Initialize engines
const pteEngine = PTEEngine.getInstance();
const sensoryMapper = new SensoryMapper();

// Create MCP server
const server = new Server(
  {
    name: 'rangisnet-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_market',
        description: 'Analyze market conditions using RangisNet Probability Tensor Engine (PTE). Returns probability, confidence, and recommended action with sensory feedback parameters.',
        inputSchema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Market symbol (e.g., BTC/USD, ETH/USD, AVAX/USD)',
            },
            rsi: {
              type: 'number',
              description: 'Relative Strength Index (0-100)',
              minimum: 0,
              maximum: 100,
            },
            vix: {
              type: 'number',
              description: 'Volatility Index (0-100)',
              minimum: 0,
              maximum: 100,
            },
            sentiment: {
              type: 'number',
              description: 'Market sentiment (-1 to 1, where -1 is bearish, 1 is bullish)',
              minimum: -1,
              maximum: 1,
            },
            volume: {
              type: 'number',
              description: 'Trading volume (normalized)',
              minimum: 0,
            },
          },
          required: ['symbol', 'rsi', 'vix', 'sentiment', 'volume'],
        },
      },
      {
        name: 'execute_transaction',
        description: 'Execute a cryptocurrency transaction through the user\'s browser. Automatically validates with PTE and provides multi-sensory feedback before execution.',
        inputSchema: {
          type: 'object',
          properties: {
            walletType: {
              type: 'string',
              enum: ['phantom', 'metamask', 'coinbase'],
              description: 'Type of wallet to use',
            },
            action: {
              type: 'string',
              enum: ['buy', 'sell', 'swap'],
              description: 'Transaction action',
            },
            amount: {
              type: 'number',
              description: 'Transaction amount in USD or native currency',
              minimum: 0,
            },
            asset: {
              type: 'string',
              description: 'Asset symbol (e.g., BTC, ETH, AVAX, SOL)',
            },
            minPRM: {
              type: 'number',
              description: 'Minimum PRM threshold to execute (0-1, default 0.3)',
              minimum: 0,
              maximum: 1,
              default: 0.3,
            },
          },
          required: ['walletType', 'action', 'amount', 'asset'],
        },
      },
      {
        name: 'play_sensory_feedback',
        description: 'Play multi-sensory feedback (harmonic tone + haptic vibration) based on PRM and recommended action. Helps users "feel" market conditions.',
        inputSchema: {
          type: 'object',
          properties: {
            prm: {
              type: 'number',
              description: 'Probability Resonance Metric (0-1)',
              minimum: 0,
              maximum: 1,
            },
            action: {
              type: 'string',
              enum: ['send', 'wait', 'reject'],
              description: 'Recommended action based on PRM',
            },
          },
          required: ['prm', 'action'],
        },
      },
      {
        name: 'get_wallet_balance',
        description: 'Get the current balance of the user\'s connected wallet',
        inputSchema: {
          type: 'object',
          properties: {
            walletType: {
              type: 'string',
              enum: ['phantom', 'metamask', 'coinbase'],
              description: 'Type of wallet to query',
            },
          },
          required: ['walletType'],
        },
      },
      {
        name: 'connect_wallet',
        description: 'Connect to a wallet in the user\'s browser',
        inputSchema: {
          type: 'object',
          properties: {
            walletType: {
              type: 'string',
              enum: ['phantom', 'metamask', 'coinbase'],
              description: 'Type of wallet to connect',
            },
          },
          required: ['walletType'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze_market': {
        const params = AnalyzeMarketSchema.parse(args);
        
        // Compute PRM using PTE
        const result = pteEngine.computePRM({
          rsi: params.rsi,
          vix: params.vix,
          sentiment: params.sentiment,
          volume: params.volume,
        });

        // Get sensory feedback parameters
        const sensory = sensoryMapper.mapPRMToSensory(result.probability);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                symbol: params.symbol,
                probability: result.probability,
                confidence: result.confidence,
                recommendation: result.recommendation,
                frequency: result.frequency,
                sensory: {
                  harmonic: sensory.harmonic,
                  haptic: sensory.haptic,
                  phonic: sensory.phonic,
                },
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      }

      case 'execute_transaction': {
        const params = ExecuteTransactionSchema.parse(args);

        // First, analyze current market conditions
        // (In production, this would fetch real-time data)
        const mockMarketData = {
          rsi: 50,
          vix: 20,
          sentiment: 0.5,
          volume: 1000000,
        };

        const analysis = pteEngine.computePRM(mockMarketData);

        // Check if PRM meets threshold
        if (analysis.probability < params.minPRM) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  reason: 'PRM below threshold',
                  prm: analysis.probability,
                  minPRM: params.minPRM,
                  recommendation: 'REJECT',
                }, null, 2),
              },
            ],
          };
        }

        // In production, this would communicate with Chrome extension
        // to execute the transaction in the browser
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                txId: 'mock-tx-' + Date.now(),
                wallet: params.walletType,
                action: params.action,
                amount: params.amount,
                asset: params.asset,
                prm: analysis.probability,
                frequency: analysis.frequency,
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      }

      case 'play_sensory_feedback': {
        const params = PlaySensoryFeedbackSchema.parse(args);

        const sensory = sensoryMapper.mapPRMToSensory(params.prm);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                prm: params.prm,
                action: params.action,
                feedback: {
                  harmonic: `${sensory.harmonic.frequency}Hz ${sensory.harmonic.description}`,
                  haptic: sensory.haptic.pattern,
                  phonic: sensory.phonic.waveform,
                },
                playing: true,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_wallet_balance': {
        // Mock implementation - would connect to browser extension
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                wallet: args.walletType,
                balance: 1.5,
                currency: 'AVAX',
                usdValue: 60.75,
              }, null, 2),
            },
          ],
        };
      }

      case 'connect_wallet': {
        // Mock implementation - would connect to browser extension
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                wallet: args.walletType,
                address: '0x' + '1'.repeat(40),
                connected: true,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('RangisNet MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
