import { config as dotenv } from "dotenv"; dotenv();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const PK = process.env.PRIVATE_KEY || "";
const FUJI_RPC = process.env.FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc";
const config: HardhatUserConfig = {
  solidity: { version: "0.8.24", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    fuji: { url: FUJI_RPC, accounts: PK ? [PK] : [] }
  }
};
export default config;
