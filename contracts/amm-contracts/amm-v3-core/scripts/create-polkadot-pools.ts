import * as dotenv from "dotenv";
import { ethers } from "ethers";
import factoryDeployment from "../deployments/polkadotTestnet/UniswapV3Factory.json";

dotenv.config();

const RPC_URL = "https://services.polkadothub-rpc.com/testnet";
const DEFAULT_FEE = 3000;

const TOKENS = {
  PGT: "0x53Ae18495aC7169D3730c258509f63D0eF84D9fb",
  rUSD: "0x246F0fCaF2Fa206dbaf575e604C5a81CF4b15C68",
  WPES: "0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31",
} as const;

const REQUESTED_POOLS = [
  { label: "wpes-rusd", tokenA: TOKENS.WPES, tokenB: TOKENS.rUSD, fee: DEFAULT_FEE },
  { label: "pes-rusd", tokenA: TOKENS.WPES, tokenB: TOKENS.rUSD, fee: DEFAULT_FEE },
  { label: "pgt-rusd", tokenA: TOKENS.PGT, tokenB: TOKENS.rUSD, fee: DEFAULT_FEE },
  { label: "pgt-pes", tokenA: TOKENS.PGT, tokenB: TOKENS.WPES, fee: DEFAULT_FEE },
] as const;

type PoolResult = {
  label: string;
  fee: number;
  tokenA: string;
  tokenB: string;
  pool: string;
  status: "created" | "existing" | "alias";
};

function normalize(address: string): string {
  return ethers.utils.getAddress(address);
}

function poolKey(tokenA: string, tokenB: string, fee: number): string {
  const [token0, token1] = [normalize(tokenA), normalize(tokenB)].sort((a, b) => a.localeCompare(b));
  return `${token0}:${token1}:${fee}`;
}

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.Contract(factoryDeployment.address, factoryDeployment.abi, wallet);

  console.log(`Deployer: ${wallet.address}`);
  console.log(`Factory: ${factory.address}`);
  console.log(`Fee: ${DEFAULT_FEE}`);

  const uniqueResults = new Map<string, PoolResult>();
  const finalResults: PoolResult[] = [];

  for (const requestedPool of REQUESTED_POOLS) {
    const key = poolKey(requestedPool.tokenA, requestedPool.tokenB, requestedPool.fee);
    const existingResult = uniqueResults.get(key);

    if (existingResult) {
      finalResults.push({
        ...existingResult,
        label: requestedPool.label,
        status: "alias",
      });
      continue;
    }

    let pool = await factory.getPool(requestedPool.tokenA, requestedPool.tokenB, requestedPool.fee);
    let status: PoolResult["status"] = "existing";

    if (pool === ethers.constants.AddressZero) {
      const tx = await factory.createPool(requestedPool.tokenA, requestedPool.tokenB, requestedPool.fee);
      console.log(`Creating ${requestedPool.label}: ${tx.hash}`);
      await tx.wait();
      pool = await factory.getPool(requestedPool.tokenA, requestedPool.tokenB, requestedPool.fee);
      status = "created";
    }

    const result: PoolResult = {
      label: requestedPool.label,
      fee: requestedPool.fee,
      tokenA: normalize(requestedPool.tokenA),
      tokenB: normalize(requestedPool.tokenB),
      pool: normalize(pool),
      status,
    };

    uniqueResults.set(key, result);
    finalResults.push(result);
  }

  console.log(JSON.stringify(finalResults, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
