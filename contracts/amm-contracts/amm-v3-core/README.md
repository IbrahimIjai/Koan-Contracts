# AMM V3 Core

## Deployment Instructions (Base Sepolia)

To test and deploy the core contracts to Base Sepolia, follow these steps:

1. **Set up Environment Variables:**
   Create a `.env` file in the `amm-v3-core` directory (you can copy `.env.example`) and add your deployment private key and API keys:

   ```env
   DEPLOYER_PRIVATE_KEY=your_testnet_private_key_here
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

2. **Install Dependencies:**
   Ensure you have installed the required packages from the root directory of the workspace:
   ```bash
   pnpm install
   ```

3. **Compile the Contracts:**
   ```bash
   npx hardhat compile
   ```

4. **Deploy to Base Sepolia:**
   Run the deployment script specifically for the Base Sepolia network:
   ```bash
   npx hardhat deploy --network baseSepolia
   ```

5. **Verify the Deployment:**
   If you want to verify the contracts on Basescan, run:
   ```bash
   npx hardhat etherscan-verify --network baseSepolia
   ```

**Important:** Make sure your deployer wallet has enough Base Sepolia ETH to cover the deployment gas fees!
