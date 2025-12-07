const hre = require("hardhat");

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║     RANGISNET DEPLOYMENT TO AVALANCHE FUJI TESTNET             ║");
  console.log("║     Hack2Build: Payments x402                                   ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📋 Deployment Information:");
  console.log("   Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("   Account balance:", hre.ethers.utils.formatEther(balance), "AVAX\n");

  if (balance.lt(hre.ethers.utils.parseEther("0.1"))) {
    console.log("⚠️  WARNING: Low balance! Get more test AVAX from:");
    console.log("   https://core.app/tools/testnet-faucet/");
    console.log("   Coupon code: Hack2Build_payments\n");
  }

  // Deploy contract
  console.log("🚀 Deploying RangisPayment contract...");
  const RangisPayment = await hre.ethers.getContractFactory("RangisPayment");
  const rangisPayment = await RangisPayment.deploy();

  await rangisPayment.deployed();

  console.log("\n✅ Deployment Successful!\n");
  console.log("📍 Contract Details:");
  console.log("   Address:", rangisPayment.address);
  console.log("   Network: Fuji Testnet");
  console.log("   Chain ID: 43113");
  console.log("   Deployer:", deployer.address);
  
  console.log("\n🔍 Explorer:");
  console.log("   https://testnet.snowtrace.io/address/" + rangisPayment.address);
  
  console.log("\n📊 Contract Configuration:");
  const minPRM = await rangisPayment.MIN_PRM();
  const minFreq = await rangisPayment.MIN_FREQUENCY();
  const maxFreq = await rangisPayment.MAX_FREQUENCY();
  console.log("   Min PRM:", minPRM.toString(), "(0.3 threshold)");
  console.log("   Frequency Range:", minFreq.toString(), "-", maxFreq.toString(), "Hz");
  
  console.log("\n🎯 Next Steps:");
  console.log("   1. Verify contract on Snowtrace:");
  console.log("      npx hardhat verify --network fuji", rangisPayment.address);
  console.log("\n   2. Test micropayment:");
  console.log("      npx hardhat run scripts/test-payment.js --network fuji");
  console.log("\n   3. Integrate with PTE frontend");
  console.log("\n   4. Record demo video");
  console.log("\n   5. Submit to Avalanche Builder Hub");
  
  console.log("\n🏆 Status: READY FOR HACKATHON SUBMISSION");
  console.log("\n╔══════════════════════════════════════════════════════════════════╗");
  console.log("║              RangisNet - Feel the Blockchain                    ║");
  console.log("║              Reality Protocol LLC                                ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: "fuji",
    chainId: 43113,
    contractAddress: rangisPayment.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    explorer: `https://testnet.snowtrace.io/address/${rangisPayment.address}`
  };
  
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
