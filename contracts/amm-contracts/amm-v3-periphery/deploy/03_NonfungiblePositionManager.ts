import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

// always update for deployments

// import corecontracts from "../../deployments/v3core/sepolia_11155111.json";

const FACTORY_ADDRESS = "0xBAd33687bF083AcC7D5114406fa2Ea77c1363385";
const WNATIVE_ADDRESS = "0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2";

const func: DeployFunction = async function ({
  // ethers,
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();

  // if (!process.env.WNATIVE_ADDRESS) {
  //   throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`);
  // }

  // const WETH_SEPOLIA = "0xe8188160f0b8E4A2940A6B9779ed0FE9A2506dF7";

  if (!deployments.get("NonfungibleTokenPositionDescriptor")) {
    throw Error(`No NonfungibleTokenPositionDescriptor for chain #${chainId}!`);
  }

  const NonfungibleTokenPositionDescriptor = await deployments.get("NonfungibleTokenPositionDescriptor");

  await deploy("NonfungiblePositionManager", {
    from: deployer,
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS, NonfungibleTokenPositionDescriptor.address],
    log: true,
    deterministicDeployment: false,
  });
};

func.tags = ["NonfungiblePositionManager"];

func.dependencies = ["NonfungibleTokenPositionDescriptor"];

export default func;
