# Polkadot Testnet AMM Deployments

Chain:
- Network: `polkadotTestnet`
- Chain ID: `420420417`
- Explorer: `https://blockscout-testnet.polkadot.io`

## Core

| Contract | Address | Blockscout |
| --- | --- | --- |
| UniswapV3Factory | `0xBAd33687bF083AcC7D5114406fa2Ea77c1363385` | https://blockscout-testnet.polkadot.io/address/0xBAd33687bF083AcC7D5114406fa2Ea77c1363385#code |

## Periphery

| Contract | Address | Blockscout |
| --- | --- | --- |
| SwapRouter | `0x938d59DA07F52887f701E82a7CCd654a55C1593d` | https://blockscout-testnet.polkadot.io/address/0x938d59DA07F52887f701E82a7CCd654a55C1593d#code |
| NFTDescriptor | `0xacFBE65392356184b400b941E8DFEEeE65e86F6E` | https://blockscout-testnet.polkadot.io/address/0xacFBE65392356184b400b941E8DFEEeE65e86F6E#code |
| NonfungibleTokenPositionDescriptor | `0x0Ed3D9B1659969038613E0f8e8b10384941fdE0c` | https://blockscout-testnet.polkadot.io/address/0x0Ed3D9B1659969038613E0f8e8b10384941fdE0c#code |
| NonfungiblePositionManager | `0x764885A086592e2Ce3dE9224392D361B3Ad4D233` | https://blockscout-testnet.polkadot.io/address/0x764885A086592e2Ce3dE9224392D361B3Ad4D233#code |
| UniswapInterfaceMulticall | `0xbAae079DAa0C376efb52C848beb34dBE81433f36` | https://blockscout-testnet.polkadot.io/address/0xbAae079DAa0C376efb52C848beb34dBE81433f36#code |
| V3Migrator | `0x301247E4955C4Adb4462Ee2863fC984e6Bae5527` | https://blockscout-testnet.polkadot.io/address/0x301247E4955C4Adb4462Ee2863fC984e6Bae5527#code |
| TickLens | `0xcc5586aaA2A22Cb4E98866DBE8ECD01Af6FaD6b3` | https://blockscout-testnet.polkadot.io/address/0xcc5586aaA2A22Cb4E98866DBE8ECD01Af6FaD6b3#code |
| QuoterV2 | `0xA56446745B69393E7b3D87F06C35f3e1450ef2dE` | https://blockscout-testnet.polkadot.io/address/0xA56446745B69393E7b3D87F06C35f3e1450ef2dE#code |
| V3PositionHelper | `0x2c043A87f6FC960a035b0465bcb9BBAcd9f38589` | https://blockscout-testnet.polkadot.io/address/0x2c043A87f6FC960a035b0465bcb9BBAcd9f38589#code |
| WPES | `0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31` | https://blockscout-testnet.polkadot.io/address/0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31#code |

## Wrapped PAS Note

The currently recorded periphery deployment uses `0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2` as its wrapped native token dependency in constructor arguments for:
- `SwapRouter`
- `NonfungibleTokenPositionDescriptor`
- `NonfungiblePositionManager`
- `V3Migrator`
- `QuoterV2`

Blockscout:
- Legacy wrapped PAS dependency: https://blockscout-testnet.polkadot.io/address/0x5Ac881DF30b6F9d1b8c370Dc493B4A1B2c8bCCd2#code
- Current verified `WPES`: https://blockscout-testnet.polkadot.io/address/0x25bDeB03a8f9f02928Bf035730363eBdef9bdA31#code

## Pools

Fee tier used:
- `3000`

| Pool | Address | Blockscout |
| --- | --- | --- |
| WPES / rUSD | `0xD9BE64855b317Ab7036be7e729097F35cdCc15da` | https://blockscout-testnet.polkadot.io/address/0xD9BE64855b317Ab7036be7e729097F35cdCc15da#code |
| PES / rUSD | `0xD9BE64855b317Ab7036be7e729097F35cdCc15da` | https://blockscout-testnet.polkadot.io/address/0xD9BE64855b317Ab7036be7e729097F35cdCc15da#code |
| PGT / rUSD | `0xCAB406C24dBF90aa50BEE88606ACA812B926a76F` | https://blockscout-testnet.polkadot.io/address/0xCAB406C24dBF90aa50BEE88606ACA812B926a76F#code |
| PGT / PES | `0x811BdAc6fFD7681c68E0616DFcf0cE23720a32Eb` | https://blockscout-testnet.polkadot.io/address/0x811BdAc6fFD7681c68E0616DFcf0cE23720a32Eb#code |

Pool note:
- `PES / rUSD` is the same pool as `WPES / rUSD` because the ERC-20 token used here is `WPES`.
