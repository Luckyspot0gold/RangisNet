/**
 * RangisNet BrowserMCP - Wallet Controller Content Script
 * 
 * Injected into wallet pages to control transactions and provide sensory feedback.
 * 
 * @author Reality Protocol LLC
 */

console.log('RangisNet Wallet Controller loaded');

class WalletController {
  constructor() {
    this.walletType = this.detectWalletType();
    this.audioContext = null;
    this.init();
  }

  /**
   * Detect which wallet we're on
   */
  detectWalletType() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('phantom')) return 'phantom';
    if (hostname.includes('metamask')) return 'metamask';
    if (hostname.includes('coinbase')) return 'coinbase';
    if (hostname.includes('uniswap')) return 'uniswap';
    if (hostname.includes('raydium')) return 'raydium';
    if (hostname.includes('core.app')) return 'core';
    
    return 'unknown';
  }

  /**
   * Initialize wallet controller
   */
  async init() {
    console.log(`Wallet type detected: ${this.walletType}`);

    // Initialize Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sendResponse);
      return true; // Keep channel open
    });

    // Inject RangisNet UI overlay
    this.injectOverlay();
  }

  /**
   * Handle messages from background script
   */
  async handleMessage(message, sendResponse) {
    console.log('Content script received:', message);

    switch (message.action) {
      case 'executeTx':
        await this.executeTransaction(message.params, sendResponse);
        break;

      case 'playSensoryFeedback':
        await this.playSensoryFeedback(message.params, sendResponse);
        break;

      case 'getBalance':
        await this.getBalance(sendResponse);
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  /**
   * Execute transaction
   */
  async executeTransaction(params, sendResponse) {
    try {
      console.log('Executing transaction:', params);

      // Play sensory feedback first
      await this.playSensoryFeedback({
        prm: params.prm,
        action: 'send',
      });

      // Wait for user confirmation (if needed)
      const confirmed = await this.showConfirmationDialog(params);

      if (!confirmed) {
        sendResponse({ success: false, reason: 'User cancelled' });
        return;
      }

      // Execute based on wallet type
      let txId;
      switch (this.walletType) {
        case 'phantom':
          txId = await this.executePhantomTx(params);
          break;
        case 'metamask':
          txId = await this.executeMetaMaskTx(params);
          break;
        case 'coinbase':
          txId = await this.executeCoinbaseTx(params);
          break;
        default:
          throw new Error(`Unsupported wallet: ${this.walletType}`);
      }

      // Play success feedback
      await this.playSensoryFeedback({
        prm: 1.0,
        action: 'send',
      });

      sendResponse({ success: true, txId });
    } catch (error) {
      console.error('Transaction execution error:', error);

      // Play rejection feedback
      await this.playSensoryFeedback({
        prm: 0,
        action: 'reject',
      });

      sendResponse({ success: false, error: error.message });
    }
  }

  /**
   * Execute Phantom (Solana) transaction
   */
  async executePhantomTx(params) {
    // In production, this would interact with Phantom's web API
    console.log('Executing Phantom transaction:', params);

    // Simulate transaction
    await this.simulateDelay(2000);

    return 'phantom-tx-' + Date.now();
  }

  /**
   * Execute MetaMask (Ethereum/Avalanche) transaction
   */
  async executeMetaMaskTx(params) {
    // In production, this would use window.ethereum
    console.log('Executing MetaMask transaction:', params);

    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        // Send transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: accounts[0],
            to: params.recipient || accounts[0],
            value: '0x' + (params.amount * 1e18).toString(16),
          }],
        });

        return txHash;
      } catch (error) {
        throw new Error(`MetaMask error: ${error.message}`);
      }
    }

    // Simulate if MetaMask not available
    await this.simulateDelay(2000);
    return 'metamask-tx-' + Date.now();
  }

  /**
   * Execute Coinbase Wallet transaction
   */
  async executeCoinbaseTx(params) {
    // In production, this would interact with Coinbase Wallet API
    console.log('Executing Coinbase transaction:', params);

    await this.simulateDelay(2000);

    return 'coinbase-tx-' + Date.now();
  }

  /**
   * Play sensory feedback (audio + haptic)
   */
  async playSensoryFeedback(params) {
    const { prm, action } = params;

    // Calculate frequency (432-1432 Hz based on PRM)
    const frequency = 432 + (prm * 1000);

    // Play audio tone
    await this.playTone(frequency, 0.5);

    // Trigger haptic feedback (if supported)
    if (navigator.vibrate) {
      const pattern = this.getHapticPattern(action, prm);
      navigator.vibrate(pattern);
    }

    // Show visual feedback
    this.showVisualFeedback(action, prm, frequency);
  }

  /**
   * Play audio tone
   */
  async playTone(frequency, duration) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return new Promise(resolve => {
      setTimeout(resolve, duration * 1000);
    });
  }

  /**
   * Get haptic vibration pattern
   */
  getHapticPattern(action, prm) {
    if (action === 'send' && prm > 0.7) {
      return [50, 50, 50, 50, 200]; // Strong confident pulse
    } else if (action === 'wait') {
      return [100, 100, 100]; // Gentle wave
    } else if (action === 'reject') {
      return [200, 100, 200, 100, 200]; // Alert buzz
    }
    return [100]; // Default
  }

  /**
   * Show visual feedback overlay
   */
  showVisualFeedback(action, prm, frequency) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'rangisnet-feedback';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getColorForAction(action, prm)};
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;

    overlay.innerHTML = `
      <div>${action.toUpperCase()}</div>
      <div style="font-size: 12px; font-weight: normal; margin-top: 5px;">
        PRM: ${(prm * 100).toFixed(1)}% | ${frequency.toFixed(0)}Hz
      </div>
    `;

    document.body.appendChild(overlay);

    // Remove after 3 seconds
    setTimeout(() => {
      overlay.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => overlay.remove(), 300);
    }, 3000);
  }

  /**
   * Get color for action
   */
  getColorForAction(action, prm) {
    if (action === 'send' && prm > 0.7) {
      return 'linear-gradient(135deg, #00ff88, #00cc66)';
    } else if (action === 'wait') {
      return 'linear-gradient(135deg, #ffaa00, #ff8800)';
    } else if (action === 'reject') {
      return 'linear-gradient(135deg, #ff4444, #cc0000)';
    }
    return 'linear-gradient(135deg, #666, #444)';
  }

  /**
   * Show confirmation dialog
   */
  async showConfirmationDialog(params) {
    return new Promise(resolve => {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 1000000;
        font-family: Arial, sans-serif;
        max-width: 400px;
      `;

      dialog.innerHTML = `
        <h2 style="margin: 0 0 15px 0; color: #333;">Confirm Transaction</h2>
        <p style="color: #666; margin: 0 0 10px 0;">
          <strong>Action:</strong> ${params.action}<br>
          <strong>Amount:</strong> ${params.amount} ${params.asset}<br>
          <strong>Confidence:</strong> ${(params.prm * 100).toFixed(1)}%
        </p>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="rangisnet-confirm" style="
            flex: 1;
            padding: 12px;
            background: #00cc66;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
          ">Confirm</button>
          <button id="rangisnet-cancel" style="
            flex: 1;
            padding: 12px;
            background: #ccc;
            color: #333;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
          ">Cancel</button>
        </div>
      `;

      document.body.appendChild(dialog);

      document.getElementById('rangisnet-confirm').onclick = () => {
        dialog.remove();
        resolve(true);
      };

      document.getElementById('rangisnet-cancel').onclick = () => {
        dialog.remove();
        resolve(false);
      };
    });
  }

  /**
   * Get wallet balance
   */
  async getBalance(sendResponse) {
    // In production, this would query the actual wallet
    console.log('Getting balance for:', this.walletType);

    sendResponse({
      success: true,
      balance: 1.5,
      currency: this.walletType === 'phantom' ? 'SOL' : 'AVAX',
    });
  }

  /**
   * Inject RangisNet overlay UI
   */
  injectOverlay() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    console.log('RangisNet overlay injected');
  }

  /**
   * Simulate delay
   */
  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize wallet controller
const walletController = new WalletController();

console.log('RangisNet Wallet Controller initialized');
