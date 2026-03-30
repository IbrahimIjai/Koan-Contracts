import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=========================================");
  console.log("Wallet Address:", deployer.address);

  // We know WPES is at:
  const WPES_ADDRESS = "0x363eBDef9bDA316A993297a7dCCF8D69A39D938d"; 
  // Wait, let's also check the old WPES from the deployments just in case
  const WPES_OLD = "0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31";
  
  // From the pools in getPolkadotTokens.ts:
  // "0xD9BE64855b317Ab7036be7e729097F35cdCc15da" (WPES / rUSD) -> WPES_OLD and rUSD
  // "0xCAB406C24dBF90aa50BEE88606ACA812B926a76F" (PGT / rUSD) -> PGT and rUSD

  const poolAbi = ["function token0() external view returns (address)", "function token1() external view returns (address)"];
  const erc20Abi = [
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "function balanceOf(address) external view returns (uint256)"
  ];

  console.log("\nFetching token addresses from pools...");
  const uniqueTokens: Set<string> = new Set();
  uniqueTokens.add(WPES_ADDRESS);
  uniqueTokens.add(WPES_OLD);

  const pools = [
    "0xD9BE64855b317Ab7036be7e729097F35cdCc15da",
    "0xCAB406C24dBF90aa50BEE88606ACA812B926a76F",
  ];

  for (const pool of pools) {
    try {
      const p = new ethers.Contract(pool, poolAbi, deployer);
      uniqueTokens.add(await p.token0());
      uniqueTokens.add(await p.token1());
    } catch (e) {
      console.log(`Failed to fetch from pool ${pool}`);
    }
  }

  console.log("Checking balances...\n");

  for (const token of uniqueTokens) {
    try {
      const t = new ethers.Contract(token, erc20Abi, deployer);
      const symbol = await t.symbol();
      const decimals = await t.decimals();
      const bal = await t.balanceOf(deployer.address);
      const formattedBal = ethers.utils.formatUnits(bal, decimals);
      console.log(`Token: ${symbol} (${token})`);
      console.log(`Balance: ${formattedBal}`);
      console.log("-----------------------------------------");
    } catch (e) {
      // ignore failures for unverified or non-erc20
    }
  }
}

main().catch(console.error);
