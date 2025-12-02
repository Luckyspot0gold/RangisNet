/**
 * Deploy RangisNet ICM Contracts
 * 
 * Deploys:
 * 1. RangisSensoryMessage on source chain (C-Chain/Fuji)
 * 2. RangisSensoryReceiver on destination chain (DFK L1)
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-icm.js --network fuji
 */

const hre = require("hardhat");

// Teleporter addresses (Fuji testnet)
const FUJI_TELEPORTER_MESSENGER = "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf";
const DFK_TELEPORTER_MESSENGER = "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf"; // Same on all chains

async function main() {
  console.log("🚀 Deploying RangisNet ICM Contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("Balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "AVAX\n");

  // ============================================================================
  // Deploy RangisSensoryMessage (Source Chain)
  // ============================================================================

  console.log("📤 Deploying RangisSensoryMessage (Source Chain)...");
  
  const RangisSensoryMessage = await hre.ethers.getContractFactory("RangisSensoryMessage");
  const sensoryMessage = await RangisSensoryMessage.deploy(FUJI_TELEPORTER_MESSENGER);
  await sensoryMessage.deployed();

  console.log("✅ RangisSensoryMessage deployed to:", sensoryMessage.address);
  console.log("   Teleporter:", await sensoryMessage.getTeleporterMessenger());
  console.log("");

  // ============================================================================
  // Deploy RangisSensoryReceiver (Destination Chain)
  // ============================================================================

  console.log("📥 Deploying RangisSensoryReceiver (Destination Chain)...");
  console.log("⚠️  Note: This should be deployed on DFK L1, not C-Chain");
  console.log("⚠️  For prototype, deploying on same chain for testing\n");
  
  const RangisSensoryReceiver = await hre.ethers.getContractFactory("RangisSensoryReceiver");
  const sensoryReceiver = await RangisSensoryReceiver.deploy(DFK_TELEPORTER_MESSENGER);
  await sensoryReceiver.deployed();

  console.log("✅ RangisSensoryReceiver deployed to:", sensoryReceiver.address);
  console.log("   Teleporter:", await sensoryReceiver.getTeleporterMessenger());
  console.log("");

  // ============================================================================
  // Summary
  // ============================================================================

  console.log("📋 Deployment Summary");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("");
  console.log("RangisSensoryMessage:", sensoryMessage.address);
  console.log("RangisSensoryReceiver:", sensoryReceiver.address);
  console.log("");
  console.log("📝 Next Steps:");
  console.log("1. Update icm-relayer-config.json with contract addresses");
  console.log("2. Deploy RangisSensoryReceiver to DFK L1 (if not already)");
  console.log("3. Start ICM relayer:");
  console.log("   docker run -v $(pwd)/icm-relayer-config.json:/config.json \\");
  console.log("     avaplatform/icm-relayer:latest --config-file /config.json");
  console.log("4. Test cross-chain message:");
  console.log("   npx hardhat run scripts/test-icm.js --network fuji");
  console.log("");
  console.log("🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
