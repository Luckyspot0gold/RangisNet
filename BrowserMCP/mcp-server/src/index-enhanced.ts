#!/usr/bin/env node

/**
 * RangisNet MCP Server - Enhanced with Avalanche Data API
 * 
 * Model Context Protocol server with multi-chain analysis capabilities
 * 
 * @author Reality Protocol LLC
 * @version 2.0.0
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
import AvalancheAPI, { 
  analyzeMultiChainActivity, 
  analyzeDFKActivity, 
  convertToMarketMetrics 
} from './avalanche-api.js';

// Enhanced tool schemas
const AnalyzeMarketEnhancedSchema = z.object({
  address: z.string().optional().describe('Wallet address for multi-chain analysis'),
  symbol: z.string().describe('Market symbol (e.g., BTC/USD, AVAX/USD)'),
  rsi: z.number().min(0).max(100).optional().describe('Relative Strength Index'),
  vix: z.number().min(0).max(100).optional().describe('Volatility Index'),
  sentiment: z.number().min(-1).max(1).optional().describe('Market sentiment'),
  volume: z.number().min(0).optional().describe('Trading volume'),
  useAvalancheData: z.boolean().default(true).describe('Use Avalanche Data API for enhanced analysis'),
});

const AnalyzeDFKSchema = z.object({
  address: z.string().describe('Wallet address to analyze on DFK gaming subnet'),
});

const AnalyzeMultiChainSchema = z.object({
  address: z.string().describe('Wallet address to analyze across all Avalanche chains'),
});

// Initialize engines
const pteEngine = PTEEngine.getInstance();
const sensoryMapper = new SensoryMapper();

// Create MCP server
const server = new Server(
  {
    name: 'rangisnet-mcp-enhanced',
    version: '2.0.0',
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
        name: 'analyze_market_enhanced',
        description: 'Enhanced market analysis using PTE + Avalanche Data API. Analyzes multi-chain activity, balances, and transaction history to provide comprehensive market insights with sensory feedback.',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Wallet address for multi-chain analysis (optional)',
            },
            symbol: {
              type: 'string',
              description: 'Market symbol (e.g., AVAX/USD, BTC/USD)',
            },
            rsi: {
              type: 'number',
              description: 'Relative Strength Index (0-100, optional)',
              minimum: 0,
              maximum: 100,
            },
            vix: {
              type: 'number',
              description: 'Volatility Index (0-100, optional)',
              minimum: 0,
              maximum: 100,
            },
            sentiment: {
              type: 'number',
              description: 'Market sentiment (-1 to 1, optional)',
              minimum: -1,
              maximum: 1,
            },
            volume: {
              type: 'number',
              description: 'Trading volume (optional)',
              minimum: 0,
            },
            useAvalancheData: {
              type: 'boolean',
              description: 'Use Avalanche Data API for enhanced analysis',
              default: true,
            },
          },
          required: ['symbol'],
        },
      },
      {
        name: 'analyze_dfk_gaming',
        description: 'Analyze DFK (DeFi Kingdoms) gaming subnet activity for an address. Returns JEWEL balance, recent transactions, and gaming activity score with sensory feedback.',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Wallet address to analyze on DFK subnet',
            },
          },
          required: ['address'],
        },
      },
      {
        name: 'analyze_multichain',
        description: 'Comprehensive multi-chain analysis across all Avalanche chains (C-Chain, DFK, Fuji, etc.). Returns balances, NFTs, transactions, and activity score.',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Wallet address to analyze',
            },
          },
          required: ['address'],
        },
      },
      // Include original tools...
      {
        name: 'execute_transaction',
        description: 'Execute a cryptocurrency transaction with PTE validation and multi-sensory feedback',
        inputSchema: {
          type: 'object',
          properties: {
            walletType: {
              type: 'string',
              enum: ['phantom', 'metamask', 'coinbase'],
            },
            action: {
              type: 'string',
              enum: ['buy', 'sell', 'swap'],
            },
            amount: { type: 'number', minimum: 0 },
            asset: { type: 'string' },
            minPRM: { type: 'number', minimum: 0, maximum: 1, default: 0.3 },
          },
          required: ['walletType', 'action', 'amount', 'asset'],
        },
      },
      {
        name: 'play_sensory_feedback',
        description: 'Play multi-sensory feedback based on PRM',
        inputSchema: {
          type: 'object',
          properties: {
            prm: { type: 'number', minimum: 0, maximum: 1 },
            action: { type: 'string', enum: ['send', 'wait', 'reject'] },
          },
          required: ['prm', 'action'],
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
      case 'analyze_market_enhanced': {
        const params = AnalyzeMarketEnhancedSchema.parse(args);
        
        let marketData = {
          rsi: params.rsi || 50,
          vix: params.vix || 20,
          sentiment: params.sentiment || 0,
          volume: params.volume || 1000000,
        };

        // If address provided and Avalanche Data API enabled, enhance with multi-chain data
        if (params.address && params.useAvalancheData) {
          try {
            const multiChainAnalysis = await analyzeMultiChainActivity(params.address);
            const apiMetrics = convertToMarketMetrics(multiChainAnalysis);
            
            // Fuse API data with provided metrics
            marketData = {
              rsi: params.rsi || 50,
              vix: params.vix || (apiMetrics.volatility * 100),
              sentiment: params.sentiment || apiMetrics.sentiment,
              volume: params.volume || apiMetrics.volume_delta,
            };

            // Compute PRM with enhanced data
            const result = pteEngine.computePRM(marketData);
            const sensory = sensoryMapper.mapPRMToSensory(result.probability);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    symbol: params.symbol,
                    address: params.address,
                    multiChainData: {
                      chains: multiChainAnalysis.chains.map(c => c.chainName),
                      totalValueUSD: multiChainAnalysis.totalValueUSD,
                      activityScore: multiChainAnalysis.activityScore,
                      nftCount: multiChainAnalysis.nfts.length,
                    },
                    analysis: {
                      probability: result.probability,
                      confidence: result.confidence,
                      recommendation: result.recommendation,
                      frequency: result.frequency,
                    },
                    sensory: {
                      harmonic: sensory.harmonic,
                      haptic: sensory.haptic,
                      phonic: sensory.phonic,
                    },
                    marketData,
                    timestamp: new Date().toISOString(),
                  }, null, 2),
                },
              ],
            };
          } catch (error) {
            console.error('Avalanche API error, falling back to basic analysis:', error);
          }
        }

        // Fallback to basic analysis
        const result = pteEngine.computePRM(marketData);
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
                marketData,
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      }

      case 'analyze_dfk_gaming': {
        const params = AnalyzeDFKSchema.parse(args);
        
        const dfkData = await analyzeDFKActivity(params.address);
        
        if (!dfkData) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Unable to fetch DFK data',
                  address: params.address,
                }, null, 2),
              },
            ],
          };
        }

        // Compute PRM based on gaming activity
        const gamingMetrics = {
          rsi: dfkData.gamingScore * 100,
          vix: (1 - dfkData.gamingScore) * 100,
          sentiment: dfkData.isActive ? 0.7 : 0.3,
          volume: dfkData.balanceUSD,
        };

        const result = pteEngine.computePRM(gamingMetrics);
        const sensory = sensoryMapper.mapPRMToSensory(result.probability);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                address: params.address,
                dfkData: {
                  chainId: dfkData.chainId,
                  token: dfkData.tokenSymbol,
                  balance: dfkData.balance,
                  balanceUSD: dfkData.balanceUSD,
                  recentTransactions: dfkData.recentTransactions.length,
                  gamingScore: dfkData.gamingScore,
                  isActive: dfkData.isActive,
                },
                analysis: {
                  probability: result.probability,
                  confidence: result.confidence,
                  recommendation: result.recommendation,
                  frequency: result.frequency,
                },
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

      case 'analyze_multichain': {
        const params = AnalyzeMultiChainSchema.parse(args);
        
        const analysis = await analyzeMultiChainActivity(params.address);
        const metrics = convertToMarketMetrics(analysis);

        // Compute PRM based on multi-chain activity
        const result = pteEngine.computePRM({
          rsi: analysis.activityScore * 100,
          vix: metrics.volatility * 100,
          sentiment: metrics.sentiment,
          volume: metrics.volume_delta,
        });

        const sensory = sensoryMapper.mapPRMToSensory(result.probability);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                address: params.address,
                multiChainAnalysis: {
                  chains: analysis.chains.map(c => ({
                    name: c.chainName,
                    id: c.chainId,
                    token: c.networkToken.symbol,
                  })),
                  balances: analysis.balances,
                  totalValueUSD: analysis.totalValueUSD,
                  recentTransactions: analysis.recentTransactions.length,
                  nfts: analysis.nfts.length,
                  activityScore: analysis.activityScore,
                },
                analysis: {
                  probability: result.probability,
                  confidence: result.confidence,
                  recommendation: result.recommendation,
                  frequency: result.frequency,
                },
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

      case 'execute_transaction':
      case 'play_sensory_feedback':
        // Use original implementations from base server
        // (code omitted for brevity - would be same as original)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ message: 'Tool not yet implemented in enhanced version' }, null, 2),
            },
          ],
        };

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
  console.error('RangisNet MCP Server (Enhanced) running on stdio');
  console.error('Avalanche Data API integration enabled');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
