// /Web/src/pte.js (Vercel deploy)
// PTE: Probability-Tactile-Execution Layer
// Integrates Thirdweb SDK, Pyth Oracle, and PRM (Probability Resonance Metric)

import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

const sdk = new ThirdwebSDK('fuji');

/**
 * Fetch real-time price data from Pyth Network
 * @param {string} pair - Trading pair (e.g., 'AVAX/USD')
 * @returns {Promise<Object>} Price data with confidence intervals
 */
async function fetchPyth(pair) {
  try {
    // Pyth price feed IDs for Avalanche
    const PRICE_FEEDS = {
      'AVAX/USD': '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
      'ETH/USD': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    };

    const feedId = PRICE_FEEDS[pair];
    if (!feedId) throw new Error(`Unknown trading pair: ${pair}`);

    const response = await fetch(`https://hermes.pyth.network/api/latest_price_feeds?ids[]=${feedId}`);
    const data = await response.json();
    
    return {
      price: parseFloat(data[0].price.price) * Math.pow(10, data[0].price.expo),
      confidence: parseFloat(data[0].price.conf) * Math.pow(10, data[0].price.expo),
      timestamp: data[0].price.publish_time,
    };
  } catch (error) {
    console.error('Pyth fetch error:', error);
    throw error;
  }
}

/**
 * Compute PRM (Probability Resonance Metric) using patented harmonic analysis
 * @param {Object} data - Price data from Pyth
 * @returns {Object} Probability score and resonance frequency
 */
function computePRM(data) {
  const { price, confidence, timestamp } = data;
  
  // Patent-protected harmonic stability calculation
  const confidenceRatio = 1 - (confidence / price);
  const baseFrequency = 528; // Solfeggio frequency (Hz) - harmonic resonance
  
  // Probability score based on confidence interval
  const prob = Math.min(0.99, Math.max(0, confidenceRatio));
  
  // Frequency modulation based on market stability
  // Higher stability = closer to 528Hz resonance
  const freq = baseFrequency + (prob - 0.5) * 100;
  
  return {
    prob: parseFloat(prob.toFixed(2)),
    freq: Math.round(freq),
    stability: confidenceRatio > 0.7 ? 'high' : 'low',
  };
}

/**
 * Trigger haptic feedback pattern
 * @param {string} pattern - Feedback type ('send', 'wait', 'error')
 */
function triggerHaptic(pattern) {
  if (!navigator.vibrate) {
    console.warn('Haptic feedback not supported');
    return;
  }

  const patterns = {
    send: [200, 50, 200], // Strong double pulse
    wait: [100, 100, 100], // Gentle buzz
    error: [50, 50, 50, 50, 50], // Rapid alert
  };

  navigator.vibrate(patterns[pattern] || patterns.wait);
}

/**
 * Encode ICM/Teleporter warp message for cross-chain routing
 * @param {Object} params - Warp message parameters
 * @returns {string} Encoded message as hex string
 */
function encodeWarpMessage(params) {
  const {
    destinationChainId = '0x0001', // DFK Subnet chain ID
    destinationAddress,
    payload = '0x',
    fee = ethers.utils.parseEther('0.001'),
  } = params;

  // Teleporter message format: [version, sourceChain, destinationChain, nonce, sender, recipient, payload]
  const abiCoder = ethers.utils.defaultAbiCoder;
  
  const warpMessage = abiCoder.encode(
    ['uint8', 'bytes32', 'bytes32', 'uint256', 'address', 'address', 'bytes'],
    [
      1, // Protocol version
      ethers.utils.hexZeroPad('0x01', 32), // Source: Fuji C-Chain
      ethers.utils.hexZeroPad(destinationChainId, 32), // Destination: DFK/custom subnet
      Date.now(), // Nonce
      ethers.constants.AddressZero, // Will be replaced by actual sender
      destinationAddress || ethers.constants.AddressZero,
      payload,
    ]
  );

  // Prepend function selector for ICM relayer: sendCrossChainMessage(bytes)
  const functionSelector = '0x4c63e562'; // keccak256('sendCrossChainMessage(bytes)').slice(0, 10)
  
  return functionSelector + warpMessage.slice(2);
}

/**
 * Play sonic frequency feedback
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 */
function playSonicFeedback(frequency, duration = 500) {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gainNode = audio.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audio.destination);
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + duration / 1000);
    
    osc.start();
    osc.stop(audio.currentTime + duration / 1000);
  } catch (error) {
    console.error('Audio feedback error:', error);
  }
}

/**
 * Main PTE handler for trade execution with multi-sensory feedback
 * @param {Object} req - Request object with command and parameters
 * @returns {Promise<Object>} Execution status and transaction details
 */
export async function handleTrade(req) {
  const { command, pair = 'AVAX/USD', amount = '0.01', dfkAddress } = req;
  
  try {
    // Step 1: Fetch real-time oracle data
    const data = await fetchPyth(pair);
    
    // Step 2: Compute PRM (Patent-protected metric)
    const { prob, freq, stability } = computePRM(data);
    
    console.log(`PRM Analysis: prob=${prob}, freq=${freq}Hz, stability=${stability}`);
    
    // Step 3: Execute if probability threshold met
    if (prob >= 0.7) {
      // Multi-sensory confirmation feedback
      triggerHaptic('send');
      playSonicFeedback(freq);
      
      // Step 4: Connect wallet via Thirdweb one-tap
      const wallet = await sdk.wallet.connect();
      const address = await wallet.getAddress();
      
      // Step 5: Encode ICM/Teleporter warp message for cross-chain routing
      const warpData = encodeWarpMessage({
        destinationChainId: '0x0001', // DFK Subnet
        destinationAddress: dfkAddress || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        payload: ethers.utils.defaultAbiCoder.encode(
          ['string', 'uint256', 'uint256', 'uint256'],
          [
            command || 'PTE_TRADE', // Trade command
            Math.floor(prob * 1000), // Probability (scaled)
            freq, // Resonance frequency
            Date.now(), // Timestamp
          ]
        ),
        fee: ethers.utils.parseEther('0.001'),
      });
      
      // Step 6: Execute transaction with warp message
      const tx = await wallet.sendTransaction({
        to: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf', // Teleporter Messenger (Fuji)
        value: ethers.utils.parseEther(amount).add(ethers.utils.parseEther('0.001')), // Amount + warp fee
        data: warpData,
        gasLimit: 500000, // Sufficient gas for cross-chain message
      });
      
      console.log(`Transaction sent: ${tx.hash}`);
      console.log(`Warp message to chain 0x0001, destination: ${dfkAddress}`);
      
      // Step 7: Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        status: 'Warp sent—trade felt!',
        txHash: receipt.hash,
        probability: prob,
        frequency: freq,
        ariaLive: 'polite', // ARIA accessibility
        sensory: {
          haptic: 'send',
          sonic: `${freq}Hz resonance`,
        },
      };
    }
    
    // Probability too low - wait signal
    triggerHaptic('wait');
    playSonicFeedback(400, 300); // Lower frequency = caution
    
    return {
      status: 'Wait—buzz felt',
      probability: prob,
      threshold: 0.7,
      ariaLive: 'polite',
      sensory: {
        haptic: 'wait',
        sonic: '400Hz caution tone',
      },
    };
    
  } catch (error) {
    console.error('PTE execution error:', error);
    triggerHaptic('error');
    
    return {
      status: 'Error—trade aborted',
      error: error.message,
      ariaLive: 'assertive',
      sensory: {
        haptic: 'error',
      },
    };
  }
}

/**
 * Export utility functions for modular use
 */
export {
  fetchPyth,
  computePRM,
  encodeWarpMessage,
  triggerHaptic,
  playSonicFeedback,
};
