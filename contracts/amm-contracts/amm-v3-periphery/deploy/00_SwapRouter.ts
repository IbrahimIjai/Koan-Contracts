import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

// always update for deployments

// import corecontracts from "../../deployments/v3core/baseSepolia_84532.json";

const FACTORY_ADDRESS = "0xBAd33687bF083AcC7D5114406fa2Ea77c1363385";
const WNATIVE_ADDRESS = "0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log({ chainId });
  // if (!process.env.WNATIVE_ADDRESS) {
  //   throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`);
  // }

  // if (!process.env.FACTORY_ADDRESS) {
  //   throw Error(`No FACTORY_ADDRESS for chain #${chainId}!`);
  // }

  const swapRouterArtifact = await hre.artifacts.readArtifact("SwapRouter");

  await deploy("SwapRouter", {
    from: deployer,
    contract: {
      bytecode: swapRouterArtifact.bytecode,
      abi: swapRouterArtifact.abi,
    },
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS],
    log: true,
    deterministicDeployment: false,
  });
};

export default func;
func.tags = ["SwapRouter"];
