// X402 Client - Configured for Avalanche Fuji payments
// Note: x402-client requires specific wallet adapter
// For production, use x402-hono middleware in API routes (see api/service/route.ts)

/**
 * X402 Payment Configuration
 * 
 * The x402 payment system is integrated at the API layer via:
 * - /api/service/route.ts uses paymentMiddleware from x402-hono
 * - Facilitator: Thirdweb (lib/thirdwebFacilitator.ts)
 * - Network: Avalanche Fuji
 * - Price: $0.01 USD per API call
 * 
 * Client-side payments are handled automatically by the middleware
 * when users call the /api/service endpoint.
 */

export const X402_CONFIG = {
  facilitatorUrl: "https://api.thirdweb.com/x402",
  network: "avalanche-fuji",
  pricePerCall: "$0.01",
  usdcAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
};
