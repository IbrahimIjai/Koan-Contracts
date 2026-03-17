import { ethers } from "ethers";
import { deployerPrivateKey } from "../hardhat.config";

async function main() {
  if (!deployerPrivateKey) {
    console.error("DEPLOYER_PRIVATE_KEY not found in .env");
    return;
  }

  const wallet = new ethers.Wallet(deployerPrivateKey);
  console.log("Deployer Address:", wallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
