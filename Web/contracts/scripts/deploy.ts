import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const RealityCapsule = await ethers.getContractFactory("RealityCapsule");
  const rc = await RealityCapsule.deploy(deployer.address);
  await rc.waitForDeployment();
  console.log("RealityCapsule:", await rc.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
