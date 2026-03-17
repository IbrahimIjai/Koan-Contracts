const fs = require('fs');
const ethers = require('ethers');

const path = 'c:/Users/USER/Desktop/wek wek wek wek/whizness/koan/Koan-Contracts/contracts/amm-contracts/amm-v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
const artifact = JSON.parse(fs.readFileSync(path, 'utf8'));
const bytecode = artifact.bytecode;

const hash = ethers.utils.keccak256(bytecode);
console.log('POOL_INIT_CODE_HASH:', hash);
