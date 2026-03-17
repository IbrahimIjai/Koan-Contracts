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
  const SwapRouter = await deployments.get("SwapRouter");
  const NFTDescriptor = await deployments.get("NFTDescriptor");
  const NonfungibleTokenPositionDescriptor = await deployments.get("NonfungibleTokenPositionDescriptor");
  const NonfungiblePositionManager = await deployments.get("NonfungiblePositionManager");
  const UniswapInterfaceMulticall = await deployments.get("UniswapInterfaceMulticall");
  const V3Migrator = await deployments.get("V3Migrator");
  const TickLens = await deployments.get("TickLens");
  const QuoterV2 = await deployments.get("QuoterV2");

  const contracts = {
    SwapRouter: SwapRouter.address,
    NFTDescriptor: NFTDescriptor.address,
    NonfungibleTokenPositionDescriptor: NonfungibleTokenPositionDescriptor.address,
    NonfungiblePositionManager: NonfungiblePositionManager.address,
    UniswapInterfaceMulticall: UniswapInterfaceMulticall.address,
    V3Migrator: V3Migrator.address,
    TickLens: TickLens.address,
    QuoterV2: QuoterV2.address,
  };

  const deployDir = path.join(__dirname, "..", "deployments", "v3periphery");
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }

  const filePath = path.join(deployDir, `${network.name}_${chainId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
  console.log(`Updated deployment file: ${filePath}`);
};

export default func;
func.tags = ["Updater.."];
