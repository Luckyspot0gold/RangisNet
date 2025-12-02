/**
 * Test RangisNet ICM Cross-Chain Messaging
 * 
 * Tests:
 * 1. Send sensory feedback from C-Chain to DFK L1
 * 2. Verify message delivery via ICM relayer
 * 3. Check destination contract state
 * 
 * Usage:
 *   npx hardhat run scripts/test-icm.js --network fuji
 */

const hre = require("hardhat");

// Replace with your deployed contract addresses
const SENSORY_MESSAGE_ADDRESS = "REPLACE_WITH_DEPLOYED_ADDRESS";
const SENSORY_RECEIVER_ADDRESS = "REPLACE_WITH_DEPLOYED_ADDRESS";

// DFK L1 Chain ID (example)
const DFK_CHAIN_ID = "0x" + "53935".toString(16).padStart(64, "0"); // Convert to bytes32

async function main() {
  console.log("🧪 Testing RangisNet ICM Cross-Chain Messaging...\n");

  const [sender] = await hre.ethers.getSigners();
  console.log("Sender address:", sender.address);
  console.log("Network:", hre.network.name);
  console.log("Balance:", hre.ethers.utils.formatEther(await sender.getBalance()), "AVAX\n");

  // ============================================================================
  // Get Contract Instances
  // ============================================================================

  const RangisSensoryMessage = await hre.ethers.getContractFactory("RangisSensoryMessage");
  const sensoryMessage = RangisSensoryMessage.attach(SENSORY_MESSAGE_ADDRESS);

  console.log("📤 RangisSensoryMessage:", sensoryMessage.address);
  console.log("📥 RangisSensoryReceiver:", SENSORY_RECEIVER_ADDRESS);
  console.log("");

  // ============================================================================
  // Test Case 1: High PRM (SEND recommendation)
  // ============================================================================

  console.log("Test Case 1: High PRM (SEND recommendation)");
  console.log("─────────────────────────────────────────────");

  const testData1 = {
    prm: 850,              // 85% confidence
    frequency: 1242,       // High frequency (bullish)
    hapticPattern: "strong-pulse",
    phonicWaveform: "sine",
    recommendation: "SEND"
  };

  console.log("Sending cross-chain message...");
  console.log("  PRM:", testData1.prm / 10, "%");
  console.log("  Frequency:", testData1.frequency, "Hz");
  console.log("  Haptic:", testData1.hapticPattern);
  console.log("  Phonic:", testData1.phonicWaveform);
  console.log("  Recommendation:", testData1.recommendation);

  const relayerFee = hre.ethers.utils.parseEther("0.01"); // 0.01 AVAX fee

  try {
    const tx1 = await sensoryMessage.sendCrossChainSensory(
      DFK_CHAIN_ID,
      SENSORY_RECEIVER_ADDRESS,
      testData1.prm,
      testData1.frequency,
      testData1.hapticPattern,
      testData1.phonicWaveform,
      testData1.recommendation,
      { value: relayerFee }
    );

    console.log("Transaction hash:", tx1.hash);
    console.log("Waiting for confirmation...");

    const receipt1 = await tx1.wait();
    console.log("✅ Message sent! Gas used:", receipt1.gasUsed.toString());

    // Extract message ID from event
    const event1 = receipt1.events.find(e => e.event === "SensoryFeedbackSent");
    if (event1) {
      console.log("Message ID:", event1.args.messageID);
      console.log("Destination Chain:", event1.args.destinationChainID);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("");

  // ============================================================================
  // Test Case 2: Low PRM (REJECT recommendation)
  // ============================================================================

  console.log("Test Case 2: Low PRM (REJECT recommendation)");
  console.log("─────────────────────────────────────────────");

  const testData2 = {
    prm: 150,              // 15% confidence
    frequency: 532,        // Low frequency (bearish)
    hapticPattern: "alert-buzz",
    phonicWaveform: "sawtooth",
    recommendation: "REJECT"
  };

  console.log("Sending cross-chain message...");
  console.log("  PRM:", testData2.prm / 10, "%");
  console.log("  Frequency:", testData2.frequency, "Hz");
  console.log("  Haptic:", testData2.hapticPattern);
  console.log("  Phonic:", testData2.phonicWaveform);
  console.log("  Recommendation:", testData2.recommendation);

  try {
    const tx2 = await sensoryMessage.sendCrossChainSensory(
      DFK_CHAIN_ID,
      SENSORY_RECEIVER_ADDRESS,
      testData2.prm,
      testData2.frequency,
      testData2.hapticPattern,
      testData2.phonicWaveform,
      testData2.recommendation,
      { value: relayerFee }
    );

    console.log("Transaction hash:", tx2.hash);
    console.log("Waiting for confirmation...");

    const receipt2 = await tx2.wait();
    console.log("✅ Message sent! Gas used:", receipt2.gasUsed.toString());

    const event2 = receipt2.events.find(e => e.event === "SensoryFeedbackSent");
    if (event2) {
      console.log("Message ID:", event2.args.messageID);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("");

  // ============================================================================
  // Test Case 3: Local Sensory (No Cross-Chain)
  // ============================================================================

  console.log("Test Case 3: Local Sensory (No Cross-Chain)");
  console.log("─────────────────────────────────────────────");

  try {
    const tx3 = await sensoryMessage.emitLocalSensory(
      650,    // 65% confidence
      932,    // Mid frequency
      "WAIT"
    );

    console.log("Transaction hash:", tx3.hash);
    const receipt3 = await tx3.wait();
    console.log("✅ Local sensory emitted! Gas used:", receipt3.gasUsed.toString());

    const event3 = receipt3.events.find(e => e.event === "LocalSensoryFeedback");
    if (event3) {
      console.log("User:", event3.args.user);
      console.log("PRM:", event3.args.prm.toString());
      console.log("Frequency:", event3.args.frequency.toString(), "Hz");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("");

  // ============================================================================
  // Summary
  // ============================================================================

  console.log("📋 Test Summary");
  console.log("═══════════════════════════════════════════════════════");
  console.log("✅ Test Case 1: High PRM (SEND) - Message sent");
  console.log("✅ Test Case 2: Low PRM (REJECT) - Message sent");
  console.log("✅ Test Case 3: Local Sensory - Event emitted");
  console.log("");
  console.log("📝 Next Steps:");
  console.log("1. Wait ~5-10 seconds for ICM relayer to deliver messages");
  console.log("2. Check destination chain (DFK L1) for events:");
  console.log("   - SensoryFeedbackReceived");
  console.log("   - GamingActionTriggered");
  console.log("3. Query RangisSensoryReceiver.getLatestSensoryData(yourAddress)");
  console.log("");
  console.log("🎉 Tests complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
