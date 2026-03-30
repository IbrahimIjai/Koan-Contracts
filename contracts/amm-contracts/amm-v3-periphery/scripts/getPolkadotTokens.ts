import { ethers } from "ethers";

async function main() {
  const pools = [
    "0xD9BE64855b317Ab7036be7e729097F35cdCc15da", // WPES / rUSD
    "0xCAB406C24dBF90aa50BEE88606ACA812B926a76F", // PGT / rUSD
    "0x811BdAc6fFD7681c68E0616DFcf0cE23720a32Eb", // PGT / PES
  ];

  const poolAbi = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
  ];

  const erc20Abi = [
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)"
  ];

  // Using the Polkadot testnet RPC defined in hardhat.config.ts
  const provider = new ethers.providers.JsonRpcProvider("https://services.polkadothub-rpc.com/testnet");

  console.log("Fetching unique tokens from deployed pools...");

  const uniqueTokens: Set<string> = new Set();
  
  // The user explicitly wanted WPES included
  uniqueTokens.add("0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31");

  for (const poolAddress of pools) {
    try {
      const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
      const token0 = await poolContract.token0();
      const token1 = await poolContract.token1();
      uniqueTokens.add(token0);
      uniqueTokens.add(token1);
    } catch (error) {
      console.warn(`Could not fetch tokens for pool ${poolAddress}`);
    }
  }

  const tokensInfo = [];

  console.log(`Found ${uniqueTokens.size} unique token(s). Fetching token details...`);

  for (const tokenAddress of uniqueTokens) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      
      tokensInfo.push({
        address: tokenAddress,
        name,
        symbol,
        decimals,
      });
    } catch (error) {
      console.warn(`Could not fetch details for token ${tokenAddress}`);
    }
  }

  console.log("\n================ Tokens Info ================\n");
  console.log(JSON.stringify(tokensInfo, null, 2));
  console.log("\n=============================================\n");
}

main().catch((error) => {
  console.error("Error running script:", error);
  process.exitCode = 1;
});
