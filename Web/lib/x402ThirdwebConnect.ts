/**
 * x402 + Thirdweb One-Tap Connect & Settle
 * Integrates Thirdweb payment facilitator with x402 micropayments
 * One-tap user experience for Avalanche Fuji transactions
 */

import { callPaidService } from "./paidService";
import { thirdwebFacilitator } from "./thirdwebFacilitator";
import { X402_CONFIG } from "./x402Client";

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  data?: any;
  error?: string;
}

/**
 * One-tap connect and settle payment via x402 + Thirdweb
 * @param serviceData - PTE computation parameters
 * @returns Payment result with transaction hash
 */
export async function oneTapConnectAndSettle(
  serviceData?: { run?: string; pair?: string; amount?: string }
): Promise<PaymentResult> {
  try {
    console.log("🚀 One-tap x402 + Thirdweb payment initiated...");
    console.log("📍 Network:", X402_CONFIG.network);
    console.log("💰 Price:", X402_CONFIG.pricePerCall);

    // Call paid service - x402 middleware handles payment automatically
    const result = await callPaidService(serviceData);

    if (result.payment_status === "verified") {
      return {
        success: true,
        data: result,
        txHash: result.txHash,
      };
    }

    return {
      success: false,
      error: "Payment verification failed",
    };
  } catch (error) {
    console.error("❌ One-tap payment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if x402 + Thirdweb is properly configured
 */
export function isX402Configured(): boolean {
  return (
    !!process.env.THIRDWEB_SECRET &&
    !!process.env.X402_RECEIVER &&
    !!X402_CONFIG.facilitatorUrl
  );
}

/**
 * Get payment configuration info
 */
export function getPaymentConfig() {
  return {
    ...X402_CONFIG,
    configured: isX402Configured(),
    facilitator: "Thirdweb",
  };
}
