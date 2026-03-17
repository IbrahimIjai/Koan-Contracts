const ethers = require("ethers");
const label = "PAS";
const labelBytes = ethers.utils.formatBytes32String(label);
console.log(`Label: ${label}, Bytes: ${labelBytes}`);
