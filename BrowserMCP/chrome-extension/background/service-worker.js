/**
 * RangisNet BrowserMCP - Background Service Worker
 * 
 * Handles communication between MCP server and content scripts.
 * Manages PTE computations and sensory feedback coordination.
 * 
 * @author Reality Protocol LLC
 */

// Import PTE Engine and Sensory Mapper (bundled)
importScripts('../shared/pte-engine-bundle.js');
importScripts('../shared/sensory-mapper-bundle.js');

const pteEngine = PTEEngine.getInstance();
const sensoryMapper = new SensoryMapper();

// WebSocket connection to MCP server
let mcpConnection = null;

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('RangisNet BrowserMCP installed');
  
  // Set default configuration
  chrome.storage.local.set({
    config: {
      minPRM: 0.3,
      autoExecute: false,
      maxTransactionAmount: 100,
      enabledWallets: ['phantom', 'metamask', 'coinbase'],
    },
    stats: {
      totalAnalyses: 0,
      totalTransactions: 0,
      successRate: 0,
    },
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.action) {
    case 'analyzeMarket':
      handleAnalyzeMarket(message.data, sendResponse);
      return true; // Keep channel open for async response

    case 'executeTransaction':
      handleExecuteTransaction(message.data, sendResponse);
      return true;

    case 'playSensoryFeedback':
      handlePlaySensoryFeedback(message.data, sendResponse);
      return true;

    case 'getConfig':
      handleGetConfig(sendResponse);
      return true;

    case 'updateConfig':
      handleUpdateConfig(message.data, sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

/**
 * Analyze market conditions using PTE
 */
async function handleAnalyzeMarket(data, sendResponse) {
  try {
    const result = pteEngine.computePRM({
      rsi: data.rsi,
      vix: data.vix,
      sentiment: data.sentiment,
      volume: data.volume,
    });

    const sensory = sensoryMapper.mapPRMToSensory(result.probability);

    // Update stats
    const stats = await chrome.storage.local.get('stats');
    stats.stats.totalAnalyses++;
    await chrome.storage.local.set({ stats: stats.stats });

    sendResponse({
      success: true,
      result: {
        ...result,
        sensory,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Execute transaction through wallet
 */
async function handleExecuteTransaction(data, sendResponse) {
  try {
    const config = await chrome.storage.local.get('config');

    // Validate amount
    if (data.amount > config.config.maxTransactionAmount) {
      throw new Error(`Amount exceeds max limit: ${config.config.maxTransactionAmount}`);
    }

    // Analyze market first
    const analysis = pteEngine.computePRM(data.marketData);

    // Check PRM threshold
    if (analysis.probability < config.config.minPRM) {
      // Play rejection feedback
      await playSensoryFeedback(analysis.probability, 'reject');

      sendResponse({
        success: false,
        reason: 'PRM below threshold',
        prm: analysis.probability,
        minPRM: config.config.minPRM,
      });
      return;
    }

    // Play confidence feedback
    await playSensoryFeedback(analysis.probability, 'send');

    // Find the wallet tab
    const tabs = await chrome.tabs.query({ url: `*://*.${data.walletType}.*/` });
    
    if (tabs.length === 0) {
      throw new Error(`${data.walletType} wallet not found. Please open it first.`);
    }

    // Send execution command to content script
    const response = await chrome.tabs.sendMessage(tabs[0].id, {
      action: 'executeTx',
      params: {
        action: data.action,
        amount: data.amount,
        asset: data.asset,
        prm: analysis.probability,
      },
    });

    // Update stats
    const stats = await chrome.storage.local.get('stats');
    stats.stats.totalTransactions++;
    if (response.success) {
      stats.stats.successRate = 
        (stats.stats.successRate * (stats.stats.totalTransactions - 1) + 1) / 
        stats.stats.totalTransactions;
    }
    await chrome.storage.local.set({ stats: stats.stats });

    sendResponse({
      success: true,
      txId: response.txId,
      prm: analysis.probability,
      frequency: analysis.frequency,
    });
  } catch (error) {
    console.error('Transaction error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Play sensory feedback
 */
async function handlePlaySensoryFeedback(data, sendResponse) {
  try {
    await playSensoryFeedback(data.prm, data.action);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Get configuration
 */
async function handleGetConfig(sendResponse) {
  const config = await chrome.storage.local.get('config');
  sendResponse({ success: true, config: config.config });
}

/**
 * Update configuration
 */
async function handleUpdateConfig(data, sendResponse) {
  try {
    const current = await chrome.storage.local.get('config');
    const updated = { ...current.config, ...data };
    await chrome.storage.local.set({ config: updated });
    sendResponse({ success: true, config: updated });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Play sensory feedback (audio + haptic)
 */
async function playSensoryFeedback(prm, action) {
  const sensory = sensoryMapper.mapPRMToSensory(prm);

  // Send notification with sensory info
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../icons/icon128.png',
    title: 'RangisNet Alert',
    message: `${action.toUpperCase()}: ${sensory.harmonic.description}`,
    priority: 2,
  });

  // In a real implementation, this would trigger:
  // 1. Audio tone via Web Audio API (in popup or content script)
  // 2. Haptic feedback via Vibration API (on mobile)
  // 3. Visual feedback in extension popup

  console.log(`Playing sensory feedback: ${sensory.harmonic.frequency}Hz, ${sensory.haptic.pattern}`);
}

/**
 * Connect to MCP server (WebSocket)
 */
function connectToMCPServer() {
  // In production, this would establish WebSocket connection
  // to the local MCP server for bidirectional communication
  console.log('MCP server connection would be established here');
}

// Initialize MCP connection
connectToMCPServer();

console.log('RangisNet BrowserMCP background service worker loaded');
