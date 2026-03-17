import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import fs from "fs";
import path from "path";

const func: DeployFunction = async function ({
  deployments,
  getChainId,
  network,
}: HardhatRuntimeEnvironment) {
  const chainId = await getChainId();
  const UniswapV3Factory = await deployments.get("UniswapV3Factory");

  const contracts = {
    UniswapV3Factory: UniswapV3Factory.address,
  };

  const deployDir = path.join(__dirname, "..", "deployments", "v3core");
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }

  const filePath = path.join(deployDir, `${network.name}_${chainId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
  console.log(`Updated deployment file: ${filePath}`);
};

export default func;
func.tags = ["Updater.."];
