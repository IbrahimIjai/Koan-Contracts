import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
// import "@matterlabs/hardhat-zksync-solc";
// import "@matterlabs/hardhat-zksync-verify";

const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
export const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
// const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const basescanApiKey = process.env.BASESCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
          metadata: {
            bytecodeHash: "none",
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  // defaultNetwork: "hardhat",
  namedAccounts: {
    // deployer: {
    //   default: "0x261386C962c7f035E98C13271218eF5CBD09C47d",
    // },
    // wallet5: {
    //   default: "0xE3c347cEa95B7BfdB921074bdb39b8571F905f6D",
    // },
    deployer: {
      default: 0,
    },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
    dev: {
      default: 4,
    },
    feeTo: {
      default: 5,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.flashbots.net`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    polkadotTestnet: {
      url: "https://services.polkadothub-rpc.com/testnet",
      chainId: 420420417,
      accounts: [deployerPrivateKey!],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey!],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey!],
    },
  },
  etherscan: {
    apiKey: {
      polkadotTestnet: "no-api-key-needed",
    },
    customChains: [
      {
        network: "polkadotTestnet",
        chainId: 420420417,
        urls: {
          apiURL: "https://blockscout-testnet.polkadot.io/api",
          browserURL: "https://blockscout-testnet.polkadot.io/",
        },
      },
    ],
  },
};

export default config;
