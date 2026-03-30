require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) {
    console.error("No DEPLOYER_PRIVATE_KEY found in environment.");
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider("https://services.polkadothub-rpc.com/testnet");
  const wallet = new ethers.Wallet(pk, provider);
  const targetAddress = "0xe726c27385c740A9C3B026891BA0e366B344E318";

  console.log("=========================================");
  console.log("Sender Address:", wallet.address);
  console.log("Target Address:", targetAddress);
  console.log("=========================================\n");

  const rUSDAddress = "0x246F0fCaF2Fa206dbaf575e604C5a81CF4b15C68";
  const pgtAddress = "0x53Ae18495aC7169D3730c258509f63D0eF84D9fb";

  const erc20Abi = [
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
  ];

  const rUSDContract = new ethers.Contract(rUSDAddress, erc20Abi, wallet);
  const pgtContract = new ethers.Contract(pgtAddress, erc20Abi, wallet);

  // Send 200 rUSD
  console.log("Transferring 200 rUSD...");
  try {
    const rusdDecimals = await rUSDContract.decimals();
    const rusdAmount = ethers.utils.parseUnits("200", rusdDecimals);
    const tx1 = await rUSDContract.transfer(targetAddress, rusdAmount);
    console.log(`tx hash: ${tx1.hash}`);
    await tx1.wait();
    console.log("rUSD transfer successful!\n");
  } catch (e) {
    console.error(`Failed to transfer rUSD: ${e.message}`);
  }

  // Send 100000 PGT
  console.log("Transferring 100000 PGT...");
  try {
    const pgtDecimals = await pgtContract.decimals();
    const pgtAmount = ethers.utils.parseUnits("100000", pgtDecimals);
    const tx2 = await pgtContract.transfer(targetAddress, pgtAmount);
    console.log(`tx hash: ${tx2.hash}`);
    await tx2.wait();
    console.log("PGT transfer successful!\n");
  } catch (e) {
    console.error(`Failed to transfer PGT: ${e.message}`);
  }

  console.log("Checking target balances...");
  try {
    const rusdBal = await rUSDContract.balanceOf(targetAddress);
    const pgtBal = await pgtContract.balanceOf(targetAddress);
    const rusdDecimals = await rUSDContract.decimals();
    const pgtDecimals = await pgtContract.decimals();
    console.log(`Target rUSD Balance: ${ethers.utils.formatUnits(rusdBal, rusdDecimals)}`);
    console.log(`Target PGT Balance: ${ethers.utils.formatUnits(pgtBal, pgtDecimals)}`);
  } catch (e) {
    console.error("Failed to fetch target balances.");
  }
}

main().catch(console.error);
