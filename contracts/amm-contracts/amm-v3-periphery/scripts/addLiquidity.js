require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider("https://services.polkadothub-rpc.com/testnet");
  const wallet = new ethers.Wallet(pk, provider);

  const nfpmAddress = "0x764885A086592e2Ce3dE9224392D361B3Ad4D233";
  const rUSDAddress = "0x246F0fCaF2Fa206dbaf575e604C5a81CF4b15C68";
  const pgtAddress  = "0x53Ae18495aC7169D3730c258509f63D0eF84D9fb";
  const wpesAddress = "0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31";
  
  const pools = [
    { name: "WPES / rUSD", address: "0xD9BE64855b317Ab7036be7e729097F35cdCc15da", tokenA: wpesAddress, tokenB: rUSDAddress, amountA: "40", amountB: "400" }
  ];

  const poolAbi = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function initialize(uint160 sqrtPriceX96) external"
  ];
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function deposit() public payable",
    "function decimals() external view returns (uint8)"
  ];
  const nfpmAbi = [
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)",
    "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ];

  const nfpm = new ethers.Contract(nfpmAddress, nfpmAbi, wallet);
  const markdowns = ["# Pool Liquidity Transactions\n"];

  // 1. Get WPES if needed
  /*
  console.log("Wrapping 45 native PAS to WPES...");
  try {
    const wpes = new ethers.Contract(wpesAddress, erc20Abi, wallet);
    const tx = await wpes.deposit({ value: ethers.utils.parseEther("45.0") });
    await tx.wait();
    console.log("Wrapped successfully.");
  } catch(e) {
    console.error("Failed to wrap:", e.message);
  }
  */

  // Helper to ensure approval
  async function ensureApprove(tokenA, tokenB) {
    const t0 = new ethers.Contract(tokenA, erc20Abi, wallet);
    const t1 = new ethers.Contract(tokenB, erc20Abi, wallet);
    console.log("Approving NFPM...");
    await (await t0.approve(nfpmAddress, ethers.constants.MaxUint256)).wait();
    await (await t1.approve(nfpmAddress, ethers.constants.MaxUint256)).wait();
  }

  for (const poolInfo of pools) {
    console.log(`\nAdding liquidity to ${poolInfo.name}...`);
    try {
      const p = new ethers.Contract(poolInfo.address, poolAbi, wallet);
      const token0 = await p.token0();
      const token1 = await p.token1();
      const fee = await p.fee();
      
      let slot0;
      try {
        slot0 = await p.slot0();
      } catch (e) { }

      // 1:1 ratio = 2^96 (approx 7.92e28)
      // 1000 PGT : 10 rUSD = 100:1 ratio.
      // Sqrt price is sqrt(token1 / token0) * 2^96.
      // We will just do 1:1 for simplicity everywhere and pass arbitrary amounts, this is a testnet AMM.
      const sqrtPriceX96 = "79228162514264337593543950336"; // 1:1 price
      
      if (!slot0 || slot0.sqrtPriceX96.toString() === "0") {
        console.log("Initializing pool...");
        const txInit = await p.initialize(sqrtPriceX96);
        await txInit.wait();
      } else {
        console.log("Pool already initialized.");
      }

      await ensureApprove(token0, token1);

      // parse amounts
      const dec0 = await (new ethers.Contract(token0, erc20Abi, wallet)).decimals();
      const dec1 = await (new ethers.Contract(token1, erc20Abi, wallet)).decimals();
      
      const isA0 = token0.toLowerCase() === poolInfo.tokenA.toLowerCase();
      const amount0 = ethers.utils.parseUnits(isA0 ? poolInfo.amountA : poolInfo.amountB, dec0);
      const amount1 = ethers.utils.parseUnits(isA0 ? poolInfo.amountB : poolInfo.amountA, dec1);

      const params = {
        token0: token0,
        token1: token1,
        fee: fee,
        tickLower: -60000,
        tickUpper: 60000,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: 0,
        amount1Min: 0,
        recipient: wallet.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10
      };

      console.log("Minting liquidity...");
      let txMint;
      let retries = 3;
      while(retries > 0) {
        try {
           txMint = await nfpm.mint(params, { gasLimit: 5000000 });
           console.log("Tx sent: " + txMint.hash);
           // Short wait to allow the mempool to register it
           await new Promise(r => setTimeout(r, 5000));
           break;
        } catch(e) {
           console.error(`Mint attempt failed: ${e.message}. Retrying...`);
           retries--;
           if(retries === 0) throw e;
           await new Promise(r => setTimeout(r, 10000));
        }
      }
      
      console.log("Minted successfully!");
      
      markdowns.push(`## ${poolInfo.name}\n- **Pool Address:** \`${poolInfo.address}\`\n- **Tx Hash:** \`${txMint.hash}\`\n- **Token0:** \`${token0}\`\n- **Token1:** \`${token1}\`\n`);
    } catch (e) {
      console.log(`Failed for ${poolInfo.name}: ${e.message}`);
      markdowns.push(`## ${poolInfo.name}\n**Failed Error:** ${e.message}\n`);
    }
  }

  // Write to output spec
  fs.writeFileSync("../../pool liquidity .md", markdowns.join("\n"));
  console.log("Wrote fully to pool liquidity .md in project root.");
}

main().catch(console.error);
