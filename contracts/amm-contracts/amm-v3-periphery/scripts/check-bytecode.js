const { ethers } = require("hardhat");

async function main() {
  const address = "0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2";
  const bytecode = await ethers.provider.getCode(address);
  console.log("Bytecode length:", bytecode.length);
  if (bytecode.length > 2) {
    console.log("Bytecode starts with:", bytecode.substring(0, 10));
  } else {
    console.log("NO BYTECODE FOUND at", address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
