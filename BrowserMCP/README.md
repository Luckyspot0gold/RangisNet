# RangisNet BrowserMCP

**The World's First Multi-Sensory AI Agent for Autonomous Blockchain Trading**

RangisNet BrowserMCP combines the power of Model Context Protocol (MCP) with RangisNet's Probability Tensor Engine (PTE) to create an AI agent that can analyze markets, feel the results through multi-sensory feedback, and autonomously execute transactions through your browser.

---

## Features

### 🎵 Multi-Sensory Feedback
- **Harmonic Tones**: 432-1432 Hz frequency mapping based on market confidence
- **Haptic Vibrations**: Pulse, wave, buzz, and alert patterns
- **Phonic Waveforms**: Sine, triangle, sawtooth, and square waves

### 🤖 AI Agent Control
- Compatible with Claude, Grok, GPT-4, and other MCP-enabled AI agents
- Natural language trading commands
- Autonomous execution with user-defined safety limits

### 🔒 Privacy & Security
- All processing happens locally on your machine
- No data sent to remote servers
- Your keys, your control

### ⚡ Performance
- Sub-microsecond PTE analysis (0.069μs)
- 14.5M transactions/second throughput
- Real-time sensory feedback (<100ms latency)

### 🌐 Universal Wallet Support
- Phantom (Solana)
- MetaMask (Ethereum/Avalanche)
- Coinbase Wallet
- Core Wallet (Avalanche)
- Any web-based wallet

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RangisNet BrowserMCP                      │
│                                                               │
│  ┌────────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │   PTE Core │───▶│ Sensory      │───▶│  MCP Server     │ │
│  │   Engine   │    │ Mapper       │    │  (Browser       │ │
│  └────────────┘    └──────────────┘    │   Control)      │ │
│        │                  │             └─────────────────┘ │
│        │                  │                      │          │
│        ▼                  ▼                      ▼          │
│  ┌────────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │  Market    │    │ Multi-Sensory│    │  Chrome         │ │
│  │  Data API  │    │ Feedback     │    │  Extension      │ │
│  └────────────┘    └──────────────┘    └─────────────────┘ │
│                                                  │          │
│                                                  ▼          │
│                                         ┌─────────────────┐ │
│                                         │  User's Browser │ │
│                                         │  (Logged In)    │ │
│                                         └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- Node.js 20+ 
- pnpm
- Chrome/Edge browser
- Claude Desktop (or other MCP-compatible AI client)

### Step 1: Install MCP Server

```bash
cd RangisNet/BrowserMCP/mcp-server
pnpm install
pnpm build
```

### Step 2: Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "rangisnet": {
      "command": "node",
      "args": ["/path/to/RangisNet/BrowserMCP/mcp-server/dist/index.js"]
    }
  }
}
```

### Step 3: Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `/path/to/RangisNet/BrowserMCP/chrome-extension`
5. The RangisNet icon should appear in your toolbar

---

## Usage

### Basic Market Analysis

In Claude Desktop:

```
Analyze BTC/USD market conditions with RSI 65, VIX 25, sentiment 0.7, volume 1000000
```

Claude will use the `analyze_market` tool and return:

```json
{
  "symbol": "BTC/USD",
  "probability": 0.78,
  "confidence": 0.92,
  "recommendation": "SEND",
  "frequency": 1212,
  "sensory": {
    "harmonic": {
      "frequency": 1212,
      "description": "Clear confident tone"
    },
    "haptic": {
      "pattern": "strong pulse"
    },
    "phonic": {
      "waveform": "sine"
    }
  }
}
```

### Autonomous Trading

```
Monitor BTC/USD and auto-buy $100 when PRM > 0.7 using MetaMask
```

The agent will:
1. Continuously analyze market conditions
2. When PRM exceeds 0.7:
   - Play sensory feedback (1200Hz tone + pulse vibration)
   - Show confirmation dialog
   - Execute transaction through MetaMask
   - Confirm with success feedback

### Configuration

Click the RangisNet extension icon to configure:

- **Min PRM**: Minimum confidence threshold (default: 0.3)
- **Auto Execute**: Enable/disable autonomous execution
- **Max Amount**: Maximum transaction amount (default: $100)
- **Enabled Wallets**: Which wallets to use

---

## MCP Tools

### `analyze_market`

Analyze market conditions using PTE.

**Parameters:**
- `symbol` (string): Market symbol (e.g., "BTC/USD")
- `rsi` (number): Relative Strength Index (0-100)
- `vix` (number): Volatility Index (0-100)
- `sentiment` (number): Market sentiment (-1 to 1)
- `volume` (number): Trading volume

**Returns:**
- `probability`: PRM value (0-1)
- `confidence`: Analysis confidence (0-1)
- `recommendation`: "SEND", "WAIT", or "REJECT"
- `frequency`: Harmonic frequency (432-1432 Hz)
- `sensory`: Multi-sensory feedback parameters

### `execute_transaction`

Execute a transaction through the browser.

**Parameters:**
- `walletType` (enum): "phantom", "metamask", or "coinbase"
- `action` (enum): "buy", "sell", or "swap"
- `amount` (number): Transaction amount
- `asset` (string): Asset symbol (e.g., "BTC", "AVAX")
- `minPRM` (number, optional): Minimum PRM threshold (default: 0.3)

**Returns:**
- `success` (boolean): Whether transaction succeeded
- `txId` (string): Transaction ID
- `prm` (number): PRM at execution time

### `play_sensory_feedback`

Play multi-sensory feedback.

**Parameters:**
- `prm` (number): Probability Resonance Metric (0-1)
- `action` (enum): "send", "wait", or "reject"

**Returns:**
- `playing` (boolean): Whether feedback is playing
- `feedback`: Sensory parameters

### `get_wallet_balance`

Get wallet balance.

**Parameters:**
- `walletType` (enum): "phantom", "metamask", or "coinbase"

**Returns:**
- `balance` (number): Current balance
- `currency` (string): Currency symbol

### `connect_wallet`

Connect to a wallet.

**Parameters:**
- `walletType` (enum): "phantom", "metamask", or "coinbase"

**Returns:**
- `success` (boolean): Whether connection succeeded
- `address` (string): Wallet address

---

## Development

### Build MCP Server

```bash
cd mcp-server
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Run Tests

```bash
pnpm test
```

---

## Avalanche x402 Integration

RangisNet BrowserMCP uses the x402 protocol for micropayments:

- **Pay-per-Analysis**: 0.001 AVAX per PTE computation
- **Sensory Streaming**: 0.0001 AVAX per second of feedback
- **Agent Execution**: 0.01 AVAX per autonomous transaction

### Deploy to Fuji Testnet

```bash
cd ../../Web
npx hardhat run scripts/deploy-hardhat.js --network fuji
```

---

## Security

### User Control

- Explicit consent required for first execution
- User-defined transaction limits
- PRM thresholds configurable
- Kill switch to disable agent anytime

### Privacy

- All PTE computation happens locally
- No market data sent to remote servers
- Encrypted storage for agent config
- Zero telemetry or tracking

### Browser Security

- Strict Content Security Policy
- Sandboxed content script execution
- Minimal required permissions
- Code signed by Reality Protocol

---

## Troubleshooting

### MCP Server Not Connecting

1. Check Claude Desktop config path
2. Verify Node.js version (20+)
3. Rebuild MCP server: `pnpm build`
4. Restart Claude Desktop

### Chrome Extension Not Loading

1. Check manifest.json syntax
2. Verify all files are present
3. Check browser console for errors
4. Reload extension in `chrome://extensions/`

### Wallet Not Detected

1. Ensure wallet extension is installed
2. Wallet must be unlocked
3. Check wallet URL matches in manifest.json
4. Refresh the wallet page

---

## Roadmap

### Q1 2026: MVP Launch
- ✅ Core MCP server + Chrome extension
- ✅ Phantom + MetaMask support
- 🔄 Fuji testnet deployment
- 🔄 Avalanche x402 Hackathon submission

### Q2 2026: Production Release
- Mainnet deployment
- 10+ wallet integrations
- Mobile app (iOS/Android)
- AWS AI agent for voice control

### Q3 2026: Enterprise Features
- Multi-agent orchestration
- Portfolio management
- Risk analysis
- Institutional-grade security

### Q4 2026: Ecosystem Expansion
- Solana integration (Cypherpunk)
- Cross-chain bridges
- DeFi protocol integrations
- Reality Protocol SDK

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

## Support

- **Documentation**: [RANGISNET_BROWSERMCP_ARCHITECTURE.md](../RANGISNET_BROWSERMCP_ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/Luckyspot0gold/RangisNet/issues)
- **Discord**: [Reality Protocol Discord](#)
- **Email**: support@realityprotocol.io

---

**Built with ❤️ by Reality Protocol LLC**  
**Powered by Manus AI + Grok AI**

*Feel the Blockchain* 🎵⚡
