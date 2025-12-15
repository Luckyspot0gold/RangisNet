// Audio Context for harmonic tones
let audioContext;
let currentPrediction = null;

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Announce to screen readers
function announce(message) {
    const ariaElement = document.getElementById('aria-announcements');
    ariaElement.textContent = message;
}

// Simple PTE Engine simulation
function runPrediction() {
    initAudio();
    announce('Analyzing market conditions...');
    
    const predictBtn = document.getElementById('predictBtn');
    predictBtn.disabled = true;
    predictBtn.textContent = 'Analyzing...';

    // Simulate PTE computation (normally <1μs)
    setTimeout(() => {
        // Mock data - in production, this comes from real PTE engine
        const rsi = 65 + Math.random() * 30;
        const vix = 15 + Math.random() * 10;
        
        // Simplified McCrea Equation (for demo): PRM = σ(ω/5000) where ω = 2 × RSI × VIX
        // Note: The full implementation in pte-engine.ts also includes sentiment and volume delta
        const omega = 2 * rsi * vix;
        const prm = 1 / (1 + Math.exp(-omega / 5000));
        
        // Map to frequency (432-1432 Hz)
        const frequency = 432 + (prm * 1000);
        
        // Get recommendation
        let recommendation, confidenceClass;
        if (prm >= 0.7) {
            recommendation = 'SEND';
            confidenceClass = 'confidence-high';
        } else if (prm >= 0.3) {
            recommendation = 'WAIT';
            confidenceClass = 'confidence-medium';
        } else {
            recommendation = 'REJECT';
            confidenceClass = 'confidence-low';
        }

        currentPrediction = { prm, frequency, recommendation };

        // Display results
        document.getElementById('confidenceValue').textContent = 
            (prm * 100).toFixed(1) + '%';
        document.getElementById('confidenceValue').className = 
            'metric-value ' + confidenceClass;
        document.getElementById('frequencyValue').textContent = 
            frequency.toFixed(0) + ' Hz';
        document.getElementById('recommendationValue').textContent = 
            recommendation;
        
        document.getElementById('predictResult').classList.add('visible');
        
        // Enable feel button
        document.getElementById('feelBtn').disabled = false;
        
        predictBtn.textContent = 'Analyze Again';
        predictBtn.disabled = false;

        // Announce results
        announce(`Prediction complete. Confidence: ${(prm * 100).toFixed(1)}%. Frequency: ${frequency.toFixed(0)} Hz. Recommendation: ${recommendation}`);
    }, 500);
}

// Trigger sensory feedback (haptic + audio)
function triggerFeedback() {
    if (!currentPrediction) return;

    initAudio();
    const { prm, frequency } = currentPrediction;

    announce('Activating sensory feedback...');

    // Show pulse indicator
    const pulseIndicator = document.getElementById('pulseIndicator');
    pulseIndicator.classList.add('active');

    // Haptic feedback via Vibration API
    if ('vibrate' in navigator) {
        const duration = prm > 0.7 ? 500 : prm > 0.3 ? 300 : 200;
        navigator.vibrate([duration, 100, duration]);
        announce(`Haptic feedback activated. Pattern: ${prm > 0.7 ? 'smooth pulse' : prm > 0.3 ? 'gentle wave' : 'alert buzz'}`);
    } else {
        announce('Haptic feedback not supported on this device.');
    }

    // Audio feedback via Web Audio API
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = prm > 0.7 ? 'sine' : prm > 0.3 ? 'triangle' : 'square';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);

    announce(`Audio tone playing at ${frequency.toFixed(0)} Hz`);

    // Enable pay button
    setTimeout(() => {
        document.getElementById('payBtn').disabled = false;
        pulseIndicator.classList.remove('active');
    }, 1500);
}

// Connect wallet (Thirdweb integration placeholder)
async function connectWallet() {
    const payBtn = document.getElementById('payBtn');
    const payStatus = document.getElementById('payStatus');
    
    payBtn.disabled = true;
    payBtn.textContent = 'Connecting...';
    payStatus.textContent = 'Connecting wallet...';

    announce('Connecting to wallet...');

    // Check for Web3 provider
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            payStatus.textContent = `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
            payBtn.textContent = 'Process Payment';
            
            announce(`Wallet connected successfully. Address: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
            
            // In production, this would call the smart contract
            payBtn.onclick = processPayment;
            payBtn.disabled = false;
            
        } catch (error) {
            payStatus.textContent = 'Connection failed';
            payBtn.textContent = 'Try Again';
            payBtn.disabled = false;
            announce('Wallet connection failed. Please try again.');
        }
    } else {
        payStatus.textContent = 'No wallet detected';
        payBtn.textContent = 'Install MetaMask';
        payBtn.onclick = () => window.open('https://metamask.io/download/', '_blank');
        payBtn.disabled = false;
        announce('No Web3 wallet detected. Please install MetaMask to continue.');
    }

    document.getElementById('payResult').classList.add('visible');
}

// Process payment (smart contract call placeholder)
async function processPayment() {
    const payBtn = document.getElementById('payBtn');
    const payStatus = document.getElementById('payStatus');
    
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';
    payStatus.textContent = 'Confirming transaction...';

    announce('Processing USDC micropayment on Avalanche Fuji...');

    // Simulate transaction (in production, calls RangisPayment.sol)
    setTimeout(() => {
        payStatus.textContent = '✅ Payment confirmed!';
        payBtn.textContent = 'Payment Complete';
        
        announce('Payment successful! Transaction confirmed on Avalanche Fuji testnet.');
        
        // Celebration haptic
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
    }, 2000);
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (focused.tagName === 'BUTTON' && !focused.disabled) {
        if (e.key === 'Enter' || e.key === ' ') {
            focused.click();
            // Only prevent default for space to avoid breaking page scroll
            if (e.key === ' ') {
                e.preventDefault();
            }
        }
    }
});
    </script>
