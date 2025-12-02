# RangisNet ICM Deployment Guide

**Project**: RangisNet BrowserMCP + Avalanche ICM Services  
**Purpose**: Step-by-step guide for deploying and testing the ICM integration  
**Date**: November 30, 2025

---

## Introduction

This guide provides the complete step-by-step process for deploying, configuring, and testing the RangisNet ICM (Interchain Messaging) integration on the Avalanche Fuji testnet. Following these steps will enable cross-chain sensory feedback between the Fuji C-Chain and the DFK subnet.

**Prerequisites**:

-   Node.js and pnpm installed
-   Docker installed and running
-   Hardhat project set up (`pnpm install`)
-   Fuji C-Chain testnet funds in your deployer wallet

---

## Step 1: Configure Hardhat

First, ensure your Hardhat configuration is set up for the Fuji testnet.

**File**: `hardhat.config.js`

Make sure you have a `fuji` network configuration and that your deployer private key is securely stored in a `.env` file.

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [process.env.FUJI_PRIVATE_KEY]
    }
  }
};
```

**File**: `.env`

```
FUJI_PRIVATE_KEY=your_fuji_private_key_here
```

---

## Step 2: Deploy Smart Contracts

Next, deploy the `RangisSensoryMessage` and `RangisSensoryReceiver` contracts to the Fuji testnet using the provided Hardhat script.

**Command**:

```bash
cd /home/ubuntu/RangisNet/Web
npx hardhat run scripts/deploy-icm.js --network fuji
```

**Expected Output**:

```
🚀 Deploying RangisNet ICM Contracts...

Deployer address: 0xYourDeployerAddress
Network: fuji
Balance: 10.0 AVAX

📤 Deploying RangisSensoryMessage (Source Chain)...
✅ RangisSensoryMessage deployed to: 0x...SensoryMessageAddress

📥 Deploying RangisSensoryReceiver (Destination Chain)...
✅ RangisSensoryReceiver deployed to: 0x...SensoryReceiverAddress

📋 Deployment Summary
═══════════════════════════════════════════════════════
RangisSensoryMessage: 0x...SensoryMessageAddress
RangisSensoryReceiver: 0x...SensoryReceiverAddress

🎉 Deployment complete!
```

**Action**: Copy the deployed contract addresses. You will need them for the next steps.

---

## Step 3: Configure the ICM Relayer

Now, configure the ICM Relayer to monitor your newly deployed contracts. The relayer runs in a Docker container and reads its configuration from a JSON file.

**File**: `icm-relayer-config.json`

1.  **Open** the `icm-relayer-config.json` file.
2.  **Update** the `message-contracts` section with the address of your `RangisSensoryMessage` contract.
3.  **Update** the `destination-blockchains` section with your relayer wallet's private key. This wallet needs Fuji AVAX to pay for gas on the destination chain.
4.  **Update** the `blockchain-id` for the destination if you are using a different subnet (for this guide, we use the C-Chain as both source and destination for simplicity).

**Example Configuration**:

```json
{
  "log-level": "info",
  "p-chain-api": { "base-url": "https://api.avax-test.network" },
  "info-api": { "base-url": "https://api.avax-test.network" },
  "source-blockchains": [
    {
      "blockchain-id": "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp", // Fuji C-Chain ID
      "rpc-endpoint": { "base-url": "https://api.avax-test.network/ext/bc/C/rpc" },
      "ws-endpoint": { "base-url": "wss://api.avax-test.network/ext/bc/C/ws" },
      "message-contracts": {
        "0x...SensoryMessageAddress": { // <-- PASTE YOUR ADDRESS HERE
          "message-format": "off-chain-registry"
        }
      }
    }
  ],
  "destination-blockchains": [
    {
      "blockchain-id": "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp", // Fuji C-Chain ID
      "rpc-endpoint": { "base-url": "https://api.avax-test.network/ext/bc/C/rpc" },
      "account-private-key": "0xYourRelayerPrivateKey" // <-- PASTE YOUR RELAYER KEY HERE
    }
  ]
}
```

---

## Step 4: Run the ICM Relayer

With the configuration file updated, you can now run the ICM Relayer using Docker. This command mounts your local configuration file into the container.

**Command**:

```bash
docker run -v $(pwd)/icm-relayer-config.json:/config.json \
  avaplatform/icm-relayer:latest --config-file /config.json
```

**Expected Output**:

The relayer will start up and begin listening for events. You should see logs indicating that it is connected to the Fuji network and monitoring your contract.

```
{"level":"info","ts":...,"msg":"starting relayer"}
{"level":"info","ts":...,"msg":"starting listener","chain":"C-Chain"}
{"level":"info","ts":...,"msg":"listening for new blocks","chain":"C-Chain"}
```

Keep this terminal window open. The relayer must be running to process messages.

---

## Step 5: Test the Cross-Chain Flow

Finally, test the end-to-end flow by sending a cross-chain message using the `test-icm.js` script.

**File**: `scripts/test-icm.js`

1.  **Open** the `scripts/test-icm.js` file.
2.  **Update** the `SENSORY_MESSAGE_ADDRESS` and `SENSORY_RECEIVER_ADDRESS` constants with the addresses you deployed in Step 2.

**Command**:

Open a **new terminal window** and run:

```bash
cd /home/ubuntu/RangisNet/Web
npx hardhat run scripts/test-icm.js --network fuji
```

**Expected Output**:

The script will send two cross-chain messages and one local event.

```
🧪 Testing RangisNet ICM Cross-Chain Messaging...

Test Case 1: High PRM (SEND recommendation)
─────────────────────────────────────────────
Sending cross-chain message...
✅ Message sent! Gas used: ...
Message ID: 0x...

Test Case 2: Low PRM (REJECT recommendation)
─────────────────────────────────────────────
Sending cross-chain message...
✅ Message sent! Gas used: ...
Message ID: 0x...

🎉 Tests complete!
```

---

## Step 6: Verify Delivery

Now, check the logs of your running ICM Relayer (from Step 4).

**Expected Relayer Logs**:

Within a few seconds, you should see the relayer detect, process, and deliver your messages.

```
{"level":"info","ts":...,"msg":"found new unsigned message","messageID":"0x..."}
{"level":"info","ts":...,"msg":"successfully fetched signatures","messageID":"0x..."}
{"level":"info","ts":...,"msg":"successfully delivered message","messageID":"0x...","txHash":"0x..."}
```

**Verification on Destination Chain**:

You can also verify the delivery by checking the `RangisSensoryReceiver` contract on a block explorer (like Snowtrace for Fuji) or by calling its `getLatestSensoryData` function.

---

## Conclusion

Congratulations! You have successfully deployed, configured, and tested the RangisNet ICM integration. This demonstrates a complete, end-to-end cross-chain workflow using official Avalanche infrastructure.

**Next Steps**:

-   Integrate this flow into the BrowserMCP and frontend UI.
-   Create a compelling demo video showcasing the cross-chain sensory feedback.
-   Prepare the final hackathon submission package.

**Status**: ✅ **Deployment and Testing Complete**
