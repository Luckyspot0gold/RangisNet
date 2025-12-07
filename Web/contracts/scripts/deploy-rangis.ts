// Hardhat deployment script for RangisNet contracts
// Deploys: RangisAgent, SensoryTeleporter, ERC8004Router

import { ethers } from "hardhat";

async function main() {
  console.log("🌈 RangisNet Contract Deployment");
  console.log("==================================");
  console.log("");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX");
  console.log("");

  // Fuji Testnet Addresses
  const TELEPORTER_MESSENGER_FUJI = "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf";
  const USDC_FUJI = "0x5425890298aed601595a70AB815c96711a31Bc65";
  
  // Step 1: Deploy mock PollyOracle
  console.log("1️⃣ Deploying PollyOracle (mock)...");
  const PollyOracle = await ethers.getContractFactory("PollyOracleMock");
  const pollyOracle = await PollyOracle.deploy();
  await pollyOracle.waitForDeployment();
  const pollyAddress = await pollyOracle.getAddress();
  console.log("   ✅ PollyOracle:", pollyAddress);
  console.log("");

  // Step 2: Deploy mock IBPWallet
  console.log("2️⃣ Deploying IBPWallet (mock)...");
  const IBPWallet = await ethers.getContractFactory("IBPWalletMock");
  const ibpWallet = await IBPWallet.deploy();
  await ibpWallet.waitForDeployment();
  const ibpAddress = await ibpWallet.getAddress();
  console.log("   ✅ IBPWallet:", ibpAddress);
  console.log("");

  // Step 3: Deploy RangisAgent
  console.log("3️⃣ Deploying RangisAgent...");
  const RangisAgent = await ethers.getContractFactory("RangisAgent");
  const rangisAgent = await RangisAgent.deploy(
    pollyAddress,
    TELEPORTER_MESSENGER_FUJI,
    ibpAddress
  );
  await rangisAgent.waitForDeployment();
  const agentAddress = await rangisAgent.getAddress();
  console.log("   ✅ RangisAgent:", agentAddress);
  console.log("");

  // Step 4: Deploy SensoryMessageSender
  console.log("4️⃣ Deploying SensoryMessageSender...");
  const SensorySender = await ethers.getContractFactory("SensoryMessageSender");
  const sensorySender = await SensorySender.deploy(TELEPORTER_MESSENGER_FUJI);
  await sensorySender.waitForDeployment();
  const senderAddress = await sensorySender.getAddress();
  console.log("   ✅ SensoryMessageSender:", senderAddress);
  console.log("");

  // Step 5: Deploy SensoryMessageReceiver
  console.log("5️⃣ Deploying SensoryMessageReceiver...");
  const SensoryReceiver = await ethers.getContractFactory("SensoryMessageReceiver");
  const sensoryReceiver = await SensoryReceiver.deploy(TELEPORTER_MESSENGER_FUJI);
  await sensoryReceiver.waitForDeployment();
  const receiverAddress = await sensoryReceiver.getAddress();
  console.log("   ✅ SensoryMessageReceiver:", receiverAddress);
  console.log("");

  // Step 6: Deploy ERC8004Router
  console.log("6️⃣ Deploying ERC8004Router...");
  const ERC8004Router = await ethers.getContractFactory("ERC8004Router");
  const erc8004Router = await ERC8004Router.deploy(TELEPORTER_MESSENGER_FUJI);
  await erc8004Router.waitForDeployment();
  const routerAddress = await erc8004Router.getAddress();
  console.log("   ✅ ERC8004Router:", routerAddress);
  console.log("");

  // Step 7: Configure ERC-8004 route
  console.log("7️⃣ Configuring payment route...");
  const destinationChainID = "0x0000000000000000000000000000000000000000000000000000000000069711"; // RangisNet subnet
  await erc8004Router.configureRoute(
    USDC_FUJI,
    destinationChainID,
    USDC_FUJI, // Same token on destination
    senderAddress,
    10 // 0.1% fee
  );
  console.log("   ✅ Route configured: Fuji → RangisNet Subnet");
  console.log("");

  // Summary
  console.log("==================================");
  console.log("✅ Deployment Complete!");
  console.log("==================================");
  console.log("");
  console.log("📋 Contract Addresses:");
  console.log("   PollyOracle:           ", pollyAddress);
  console.log("   IBPWallet:             ", ibpAddress);
  console.log("   RangisAgent:           ", agentAddress);
  console.log("   SensoryMessageSender:  ", senderAddress);
  console.log("   SensoryMessageReceiver:", receiverAddress);
  console.log("   ERC8004Router:         ", routerAddress);
  console.log("");
  console.log("🔗 Next Steps:");
  console.log("   1. Create agent: rangisAgent.createAgent(...)");
  console.log("   2. Fund IBP wallet: ibpWallet.deposit(...)");
  console.log("   3. Evaluate trade: rangisAgent.evaluateTrade(...)");
  console.log("   4. Send warp: sensorySender.sendSensoryWarp(...)");
  console.log("");
  console.log("🎯 Ready for Mighty Agent demo!");
  console.log("");

  // Save addresses to file
  const addresses = {
    network: "fuji",
    chainId: 43113,
    deployer: deployer.address,
    contracts: {
      PollyOracle: pollyAddress,
      IBPWallet: ibpAddress,
      RangisAgent: agentAddress,
      SensoryMessageSender: senderAddress,
      SensoryMessageReceiver: receiverAddress,
      ERC8004Router: routerAddress,
    },
    teleporter: TELEPORTER_MESSENGER_FUJI,
    usdc: USDC_FUJI,
  };

  console.log("💾 Saving deployment info to deployed-addresses.json...");
  const fs = require("fs");
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("   ✅ Saved!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
