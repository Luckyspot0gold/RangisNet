// Deploy IBPWalletWithOfframp - Fiat Off-Ramp Integration
// Avalanche Hack2Build x402 Competition - December 7, 2025

import { ethers } from "hardhat";

async function main() {
  console.log("🌈 Deploying IBPWalletWithOfframp to Avalanche Fuji...");
  console.log("================================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX\n");

  // Deploy IBPWalletWithOfframp
  console.log("1️⃣ Deploying IBPWalletWithOfframp...");
  const IBPWalletWithOfframp = await ethers.getContractFactory("IBPWalletWithOfframp");
  const wallet = await IBPWalletWithOfframp.deploy();
  await wallet.waitForDeployment();
  const walletAddress = await wallet.getAddress();
  
  console.log("   ✅ IBPWalletWithOfframp deployed:", walletAddress);

  // Configure off-ramp provider (Transak webhook address)
  // In production, this would be Transak's webhook endpoint
  const TRANSAK_WEBHOOK = deployer.address; // Placeholder for demo
  
  console.log("\n2️⃣ Configuring off-ramp provider...");
  const authTx = await wallet.authorizeOfframpProvider(TRANSAK_WEBHOOK, true);
  await authTx.wait();
  console.log("   ✅ Authorized Transak webhook:", TRANSAK_WEBHOOK);

  // Set reasonable off-ramp fee (2.99%)
  console.log("\n3️⃣ Setting off-ramp fee (2.99%)...");
  const feeTx = await wallet.setOfframpFee(299); // 299 basis points = 2.99%
  await feeTx.wait();
  console.log("   ✅ Off-ramp fee set: 2.99%");

  // Display configuration
  console.log("\n📋 Deployment Summary");
  console.log("=====================");
  console.log("Network: Avalanche Fuji (43113)");
  console.log("Contract: IBPWalletWithOfframp");
  console.log("Address:", walletAddress);
  console.log("Deployer:", deployer.address);
  console.log("Off-ramp Provider:", TRANSAK_WEBHOOK);
  console.log("Off-ramp Fee: 2.99%");

  // Save deployment info
  const deploymentInfo = {
    network: "avalanche-fuji",
    chainId: 43113,
    contractName: "IBPWalletWithOfframp",
    address: walletAddress,
    deployer: deployer.address,
    offrampProvider: TRANSAK_WEBHOOK,
    offrampFee: "2.99%",
    timestamp: new Date().toISOString(),
    features: [
      "Deposit/Withdraw AVAX & ERC20",
      "Reputation scoring",
      "Trade recording",
      "Fiat off-ramp (Transak)",
      "Bank account cashout"
    ]
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Usage instructions
  console.log("\n\n🚀 Usage Instructions");
  console.log("=====================\n");
  
  console.log("1. Add to .env.local:");
  console.log(`   NEXT_PUBLIC_IBP_WALLET_ADDRESS=${walletAddress}\n`);
  
  console.log("2. Create wallet:");
  console.log("   await contract.createWallet();\n");
  
  console.log("3. Deposit USDC:");
  console.log("   await contract.depositToken(USDC_ADDRESS, amount);\n");
  
  console.log("4. Request off-ramp:");
  console.log("   await contract.requestOfframp(");
  console.log("     USDC_ADDRESS,");
  console.log("     ethers.parseUnits('100', 6), // 100 USDC");
  console.log("     'USD',");
  console.log("     'TRANSAK_MANAGED'");
  console.log("   );\n");
  
  console.log("5. Check status:");
  console.log("   await contract.getOfframpRequest(requestId);\n");

  console.log("\n🎯 Next Steps:");
  console.log("- Get Transak API key: https://transak.com/developers");
  console.log("- Update /Web/lib/transakOfframp.ts with contract address");
  console.log("- Test cashout flow with $1 USDC");
  console.log("- Record demo video showing full flow\n");

  console.log("✅ Deployment complete! Ready for competition submission.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
