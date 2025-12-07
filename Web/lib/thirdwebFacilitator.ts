import { facilitator } from "thirdweb/x402";
import { thirdwebClient } from "./thirdweb";

export const thirdwebFacilitator = facilitator({
  client: thirdwebClient,
  serverWalletAddress: process.env.X402_RECEIVER!,  // wallet receiving USDC
  waitUntil: "confirmed", // ensures payment is finalized on Fuji
});
