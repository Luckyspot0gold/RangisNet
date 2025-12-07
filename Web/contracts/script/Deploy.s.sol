// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../RangisPayment.sol";
import "../icm/RangisSensoryMessage.sol";
import "../icm/RangisSensoryReceiver.sol";

/**
 * @title DeployScript
 * @notice Foundry deployment script for RangisNet contracts
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PK --broadcast
 */
contract DeployScript is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PK");
        address teleporterRegistry = vm.envAddress("TELEPORTER_REGISTRY_FUJI_C_CHAIN");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy RangisPayment contract
        console.log("Deploying RangisPayment...");
        RangisPayment rangisPayment = new RangisPayment();
        console.log("RangisPayment deployed at:", address(rangisPayment));

        // 2. Deploy RangisSensoryMessage contract (for source chain)
        console.log("Deploying RangisSensoryMessage...");
        RangisSensoryMessage sensoryMessage = new RangisSensoryMessage(teleporterRegistry);
        console.log("RangisSensoryMessage deployed at:", address(sensoryMessage));

        // 3. Deploy RangisSensoryReceiver contract (for destination chain)
        console.log("Deploying RangisSensoryReceiver...");
        RangisSensoryReceiver sensoryReceiver = new RangisSensoryReceiver(teleporterRegistry);
        console.log("RangisSensoryReceiver deployed at:", address(sensoryReceiver));

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Network:", block.chainid);
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("RangisPayment:", address(rangisPayment));
        console.log("RangisSensoryMessage:", address(sensoryMessage));
        console.log("RangisSensoryReceiver:", address(sensoryReceiver));
        console.log("Teleporter Registry:", teleporterRegistry);
        console.log("==========================\n");

        // Save addresses to file for easy access
        string memory deploymentInfo = string(abi.encodePacked(
            "RANGIS_PAYMENT_CONTRACT=", vm.toString(address(rangisPayment)), "\n",
            "HARMONIC_CONTRACT=", vm.toString(address(sensoryMessage)), "\n",
            "SENSORY_RECEIVER_DFK=", vm.toString(address(sensoryReceiver)), "\n"
        ));
        
        vm.writeFile(".env.deployed", deploymentInfo);
        console.log("Deployment addresses saved to .env.deployed");
    }
}
