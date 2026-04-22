import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

// always update for deployments

// import corecontracts from "../../deployments/v3core/sepolia_11155111.json";

// const FACTORY_ADDRESS = "0x4E02A5e71197fAE4925b23CEdc35D987a4409DB0";
const FACTORY_ADDRESS = "0xbdf65e7100B459d402b714c25CbeAB5b4CB4dDc2";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  let factoryAddress = process.env.FACTORY_ADDRESS;
  let wnativeAddress = process.env.WNATIVE_ADDRESS;

  if (chainId === "42220") {
    // Celo Mainnet
    wnativeAddress = "0x0000000000000000000000000000000000000000";
  }

  // Fallback to deployments if not provided in env
  if (!factoryAddress) {
    const factoryDeployment = await deployments.getOrNull("UniswapV3Factory");
    if (factoryDeployment) {
      factoryAddress = factoryDeployment.address;
    }
  }

  if (!factoryAddress || !wnativeAddress) {
    throw Error(`No FACTORY_ADDRESS or WNATIVE_ADDRESS for chain #${chainId}!`);
  }

  const v3Migrator = await hre.artifacts.readArtifact("V3Migrator");

  const NonfungiblePositionManager = await deployments.get("NonfungiblePositionManager");
  await deploy("V3Migrator", {
    from: deployer,
    contract: {
      bytecode: v3Migrator.bytecode,
      abi: v3Migrator.abi,
    },
    args: [factoryAddress, wnativeAddress, NonfungiblePositionManager.address],
    log: true,
    deterministicDeployment: false,
  });
};

export default func;
func.tags = ["V3Migrator"];
