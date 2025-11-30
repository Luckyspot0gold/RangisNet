# RangisNet BrowserMCP: Usage Guide

**Version**: 1.0.0  
**Last Updated**: November 30, 2025

---

## Introduction

Welcome to the RangisNet BrowserMCP, the world's first multi-sensory AI agent for autonomous blockchain trading. This guide will walk you through how to use the BrowserMCP with your favorite AI agents like Claude, Grok, and GPT-4 to analyze markets, feel the results, and execute transactions automatically.

### Prerequisites

Before you begin, ensure you have completed the installation steps in the [README.md](./README.md).

- RangisNet MCP Server is running.
- Claude Desktop (or other MCP client) is configured.
- RangisNet Chrome Extension is installed and enabled.

---

## Core Concepts

### 1. **Multi-Sensory Feedback** 🎵

RangisNet translates complex market data into intuitive sensory feedback:

- **Harmonic Tones**: The frequency of the tone (432-1432 Hz) indicates the confidence (PRM) of the analysis. Higher frequency = higher confidence.
- **Haptic Vibrations**: The vibration pattern signals the recommended action (SEND, WAIT, REJECT).
- **Phonic Waveforms**: The shape of the audio wave provides additional texture to the feedback.

### 2. **Autonomous Execution** 🤖

The AI agent can autonomously execute transactions through your browser, but only within the safety limits you define:

- **Min PRM**: The agent will only execute if the market confidence is above this threshold.
- **Max Amount**: The agent will never exceed this amount per transaction.
- **Auto Execute**: You can enable or disable autonomous execution at any time.

### 3. **Browser Control** 🌐

The agent uses your existing browser session, meaning it can interact with any wallet you are already logged into. This is fast, private, and avoids bot detection.

---

## Using with AI Agents

### Example 1: Basic Market Analysis (Claude)

**Prompt:**

```
Use the rangisnet-mcp to analyze the BTC/USD market. Current conditions are:
- RSI: 68
- VIX: 22
- Sentiment: 0.75 (bullish)
- Volume: 1,200,000
```

**Agent Action:**

The AI agent will call the `analyze_market` tool:

```json
{
  "tool_name": "analyze_market",
  "arguments": {
    "symbol": "BTC/USD",
    "rsi": 68,
    "vix": 22,
    "sentiment": 0.75,
    "volume": 1200000
  }
}
```

**Result & Sensory Feedback:**

You will hear a high-frequency tone (~1200 Hz) and feel a strong, confident pulse vibration. The agent will return:

```json
{
  "probability": 0.81,
  "confidence": 0.95,
  "recommendation": "SEND",
  "frequency": 1242,
  "sensory": {
    "harmonic": {
      "frequency": 1242,
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

### Example 2: Autonomous Trading (Grok)

**Prompt:**

```
I want to buy $50 of AVAX using my MetaMask wallet, but only if the market conditions are favorable. Set the minimum PRM to 0.6.
```

**Agent Action:**

1.  The agent first calls `analyze_market` to check conditions.
2.  If the returned `probability` is greater than 0.6, it proceeds.
3.  The agent then calls `execute_transaction`:

```json
{
  "tool_name": "execute_transaction",
  "arguments": {
    "walletType": "metamask",
    "action": "buy",
    "amount": 50,
    "asset": "AVAX",
    "minPRM": 0.6
  }
}
```

**Result & Sensory Feedback:**

1.  You will hear a confident tone and feel a pulse vibration.
2.  A confirmation dialog will appear in your browser.
3.  Once you confirm, the transaction is executed through MetaMask.
4.  You will hear a success tone (432 Hz) and feel a success vibration pattern.

### Example 3: Playing Sensory Feedback Directly (GPT-4)

**Prompt:**

```
Play the sensory feedback for a market with a PRM of 0.25 and a 'REJECT' recommendation.
```

**Agent Action:**

```json
{
  "tool_name": "play_sensory_feedback",
  "arguments": {
    "prm": 0.25,
    "action": "reject"
  }
}
```

**Result & Sensory Feedback:**

You will hear a low, dissonant tone and feel a strong buzzing vibration, clearly signaling unfavorable conditions.

---

## Configuration

To configure the RangisNet BrowserMCP, click the extension icon in your browser toolbar. This will open the popup menu where you can adjust:

- **Minimum PRM Threshold**: The confidence level required for the agent to act. (Default: 0.3)
- **Auto Execute**: Toggle autonomous transaction execution. (Default: Off)
- **Max Transaction Amount**: The maximum amount the agent can spend in a single transaction. (Default: $100)
- **Enabled Wallets**: Select which wallets the agent is allowed to use.

Changes are saved automatically.

---

## Wallet Interaction

### Connecting a Wallet

Before the agent can execute transactions, you must be logged into your wallet in the browser.

**Prompt:**

```
Connect to my Phantom wallet.
```

**Agent Action:**

```json
{
  "tool_name": "connect_wallet",
  "arguments": {
    "walletType": "phantom"
  }
}
```

### Checking Balance

**Prompt:**

```
What is my current AVAX balance in MetaMask?
```

**Agent Action:**

```json
{
  "tool_name": "get_wallet_balance",
  "arguments": {
    "walletType": "metamask"
  }
}
```

---

## Troubleshooting

**Problem: Agent cannot find the tool `analyze_market`.**

- **Solution**: Ensure the MCP server is running and configured correctly in your AI client (e.g., Claude Desktop). Restart the client if necessary.

**Problem: Sensory feedback is not playing.**

- **Solution**: Check that your system audio is on. The Chrome extension must be active. Some browsers may require you to interact with the page first before audio can play.

**Problem: Transaction fails with "PRM below threshold".**

- **Solution**: This is a safety feature. The market conditions are not favorable enough for the agent to act. You can either wait for better conditions or lower the "Min PRM" threshold in the extension settings.

**Problem: Wallet not detected.**

- **Solution**: Make sure you are logged into your wallet in an active browser tab. The URL of the wallet must match the permissions in the `manifest.json` file.

---

## Advanced Usage

### Chaining Commands

You can create complex workflows by chaining commands together in a single prompt.

**Prompt:**

```
Analyze the SOL/USD market (RSI 60, VIX 30, sentiment 0.6, volume 500k). If the recommendation is SEND, buy $75 of SOL with my Phantom wallet. Otherwise, just play the sensory feedback for the result.
```

### Integrating with Other Tools

Combine RangisNet with other MCP tools for even more power.

**Prompt:**

```
Check the latest news for Avalanche. Based on the sentiment, analyze the AVAX/USD market using RangisNet. If the PRM is above 0.7, buy $100 of AVAX.
```

---

*Feel the Blockchain. Trade with Confidence.*

**Reality Protocol LLC © 2025**
