import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "build-placeholder", // fallback for build
});
