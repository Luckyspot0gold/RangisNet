import { facilitator } from "thirdweb/x402";
import { thirdwebClient } from "./thirdweb";

export const thirdwebFacilitator = facilitator({
  client: thirdwebClient,
  serverWalletAddress: (process.env.X402_RECEIVER || "0x0000000000000000000000000000000000000000") as `0x${string}`,  // fallback for build
  waitUntil: "confirmed", // ensures payment is finalized on Fuji
});
