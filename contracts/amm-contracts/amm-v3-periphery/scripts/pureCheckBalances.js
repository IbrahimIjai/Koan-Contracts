require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) {
    console.log("No DEPLOYER_PRIVATE_KEY found in environment.");
    // try PRIVATE_KEY
    if(!process.env.PRIVATE_KEY) {
      console.log("No PRIVATE_KEY found either.");
      return;
    }
  }

  const provider = new ethers.providers.JsonRpcProvider("https://services.polkadothub-rpc.com/testnet");
  const wallet = new ethers.Wallet(pk || process.env.PRIVATE_KEY, provider);

  console.log("=========================================");
  console.log("Wallet Address:", wallet.address);

  const WPES_ADDRESS = "0x363eBDef9bDA316A993297a7dCCF8d69A39d938d"; 
  const WPES_OLD = "0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31";
  
  const poolAbi = ["function token0() external view returns (address)", "function token1() external view returns (address)"];
  const erc20Abi = [
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "function balanceOf(address) external view returns (uint256)"
  ];

  console.log("\nFetching token addresses from pools...");
  const uniqueTokens = new Set();
  uniqueTokens.add(WPES_ADDRESS);
  uniqueTokens.add(WPES_OLD);

  const pools = [
    "0xD9BE64855b317Ab7036be7e729097F35cdCc15da",
    "0xCAB406C24dBF90aa50BEE88606ACA812B926a76F",
  ];

  for (const pool of pools) {
    try {
      const p = new ethers.Contract(pool, poolAbi, provider);
      uniqueTokens.add(await p.token0());
      uniqueTokens.add(await p.token1());
    } catch (e) {
      console.log(`Failed to fetch from pool ${pool}: ${e.message}`);
    }
  }

  console.log("Checking balances...\n");

  for (const token of uniqueTokens) {
    try {
      const t = new ethers.Contract(token, erc20Abi, provider);
      const symbol = await t.symbol();
      const decimals = await t.decimals();
      const bal = await t.balanceOf(wallet.address);
      const formattedBal = ethers.utils.formatUnits(bal, decimals);
      console.log(`Token: ${symbol} (${token})`);
      console.log(`Balance: ${formattedBal}`);
      console.log("-----------------------------------------");
    } catch (e) {
      console.log(`Failed for token ${token}: ${e.message}`);
    }
  }
}

main().catch(console.error);
