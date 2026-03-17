import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

// always update for deployments

// import corecontracts from "../../deployments/v3core/sepolia_11155111.json";

const FACTORY_ADDRESS = "0xBAd33687bF083AcC7D5114406fa2Ea77c1363385";
const WNATIVE_ADDRESS = "0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  // const chainId = await getChainId();
  // if (!process.env.WNATIVE_ADDRESS) {
  //   throw Error(`No WNATIVE_ADDRESS for chain #}!`);
  // }

  const v3Migrator = await hre.artifacts.readArtifact("V3Migrator");

  const NonfungiblePositionManager = await deployments.get("NonfungiblePositionManager");
  await deploy("V3Migrator", {
    from: deployer,
    contract: {
      bytecode: v3Migrator.bytecode,
      abi: v3Migrator.abi,
    },
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS, NonfungiblePositionManager.address],
    log: true,
    deterministicDeployment: false,
  });
};

export default func;
func.tags = ["V3Migrator"];
