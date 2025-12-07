/**
 * Accessibility + Youmio Integration
 * ARIA attributes, voice synthesis, haptic feedback
 * Target: 2B users with accessibility needs - Dec 8
 */

export interface AccessibilityFeatures {
  ariaLive: boolean;
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  highContrast: boolean;
}

/**
 * Update ARIA live region with confidence score
 * @param prob - Confidence probability (0-1)
 * @param action - Recommended action
 */
export function updateAriaLive(prob: number, action: string = "trade"): void {
  const confidencePercent = (prob * 100).toFixed(1);
  const message = `Confidence: ${confidencePercent}%. Recommended action: ${action}`;
  
  // Set ARIA live region on body or specific element
  const ariaElement = document.querySelector('[role="status"]') || document.body;
  ariaElement.setAttribute("aria-live", "polite");
  ariaElement.setAttribute("aria-atomic", "true");
  ariaElement.setAttribute("aria-relevant", "text");
  
  // Update screen reader announcement
  const announcement = document.createElement("div");
  announcement.className = "sr-only";
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Clean up after announcement
  setTimeout(() => {
    announcement.remove();
  }, 3000);
  
  console.log("♿ ARIA Live updated:", message);
}

/**
 * Speak confidence message using Web Speech API
 * @param prob - Confidence probability (0-1)
 * @param action - Recommended action
 */
export function speakConfidence(prob: number, action: string = "trade"): void {
  if (!("speechSynthesis" in window)) {
    console.warn("⚠️  Speech synthesis not supported");
    return;
  }

  const synth = window.speechSynthesis;
  
  // Cancel any ongoing speech
  synth.cancel();
  
  const confidencePercent = (prob * 100).toFixed(0);
  let message: string;
  
  if (prob > 0.7) {
    message = `Feels confident at ${confidencePercent} percent. Ready to ${action}?`;
  } else if (prob > 0.5) {
    message = `Moderate confidence at ${confidencePercent} percent. Consider ${action}.`;
  } else {
    message = `Low confidence at ${confidencePercent} percent. Recommend holding.`;
  }
  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  utterance.lang = "en-US";
  
  synth.speak(utterance);
  console.log("🔊 Voice:", message);
}

/**
 * Trigger haptic feedback pattern based on confidence
 * @param prob - Confidence probability (0-1)
 * @param type - Feedback type: 'notification', 'success', 'warning', 'error'
 */
export function triggerHapticFeedback(
  prob: number,
  type: "notification" | "success" | "warning" | "error" = "notification"
): void {
  if (!("vibrate" in navigator)) {
    console.warn("⚠️  Vibration API not supported");
    return;
  }

  let pattern: number[];
  
  switch (type) {
    case "success":
      // Double pulse for high confidence
      pattern = [200, 50, 200];
      break;
    case "warning":
      // Triple short pulse for medium confidence
      pattern = [100, 50, 100, 50, 100];
      break;
    case "error":
      // Long buzz for errors
      pattern = [500];
      break;
    case "notification":
    default:
      // Single pulse scaled by confidence
      const duration = Math.floor(100 + prob * 200); // 100-300ms
      pattern = [duration, 50];
      break;
  }
  
  navigator.vibrate(pattern);
  console.log("📳 Haptic:", pattern);
}

/**
 * Complete accessibility feedback for confidence update
 * Combines ARIA, voice, and haptics
 */
export function announceConfidence(
  prob: number,
  action: string = "trade",
  features: Partial<AccessibilityFeatures> = {}
): void {
  const config: AccessibilityFeatures = {
    ariaLive: true,
    voiceEnabled: true,
    hapticsEnabled: true,
    highContrast: false,
    ...features,
  };

  // ARIA live region update
  if (config.ariaLive) {
    updateAriaLive(prob, action);
  }

  // Voice announcement
  if (config.voiceEnabled) {
    speakConfidence(prob, action);
  }

  // Haptic feedback
  if (config.hapticsEnabled) {
    const type = prob > 0.7 ? "success" : prob > 0.5 ? "notification" : "warning";
    triggerHapticFeedback(prob, type);
  }
}

/**
 * Initialize accessibility features on page load
 */
export function initAccessibility(): void {
  // Add ARIA landmark roles
  const main = document.querySelector("main");
  if (main && !main.getAttribute("role")) {
    main.setAttribute("role", "main");
  }

  // Create live region for announcements
  if (!document.querySelector('[role="status"]')) {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.id = "aria-live-region";
    document.body.appendChild(liveRegion);
  }

  // Add skip to main content link
  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `;
    skipLink.addEventListener("focus", () => {
      skipLink.style.top = "0";
    });
    skipLink.addEventListener("blur", () => {
      skipLink.style.top = "-40px";
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  console.log("♿ Accessibility features initialized");
}

/**
 * Youmio SDK placeholder
 * Request credits via form + code integration
 * Note: Actual Youmio integration requires API credentials
 */
export async function requestYoumioCredits(
  email: string,
  projectName: string = "RangisNet"
): Promise<{ success: boolean; message: string }> {
  console.log("🎯 Requesting Youmio credits for:", email);
  
  // This would integrate with Youmio API
  // For now, provide manual request instructions
  return {
    success: true,
    message: `
Youmio Integration Request:
1. Visit: https://youmio.com/developer
2. Register project: ${projectName}
3. Request accessibility credits
4. Use email: ${email}
5. Add API key to .env: YOUMIO_API_KEY=your_key_here

Once approved, Youmio will enhance:
- Multi-language voice synthesis
- Advanced haptic patterns
- Accessibility analytics
    `.trim(),
  };
}

// CSS for screen reader only content
export const srOnlyStyles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;
