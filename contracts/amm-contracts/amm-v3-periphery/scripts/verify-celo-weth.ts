import { createPublicClient, http, parseAbi } from 'viem';
import { celo } from 'viem/chains';

const UNISWAP_V3_FACTORY = '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc';
const SWAP_ROUTER_02 = '0x5615CDAb10dc425a742d643d949a7F474C01abc4';
const POSITION_MANAGER = '0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A';

const abi = parseAbi([
  'function WETH9() external view returns (address)',
  'function factory() external view returns (address)'
]);

async function verify() {
  const client = createPublicClient({
    chain: celo,
    transport: http('https://forno.celo.org'),
  });

  console.log('--- Verifying Uniswap V3 Celo Parameters ---');

  try {
    const routerWeth = await client.readContract({
      address: SWAP_ROUTER_02,
      abi,
      functionName: 'WETH9',
    });
    console.log('SwapRouter02 WETH9:', routerWeth);

    const pmWeth = await client.readContract({
      address: POSITION_MANAGER,
      abi,
      functionName: 'WETH9',
    });
    console.log('Position Manager WETH9:', pmWeth);

    const pmFactory = await client.readContract({
      address: POSITION_MANAGER,
      abi,
      functionName: 'factory',
    });
    console.log('Position Manager Factory:', pmFactory);

    const tokenAbi = parseAbi(['function symbol() view returns (string)', 'function name() view returns (string)']);
    
    try {
        const symbol = await client.readContract({
            address: '0x471ece3750da237f93b8e339c536989b8978a438',
            abi: tokenAbi,
            functionName: 'symbol',
        });
        console.log('Address 0x471... symbol:', symbol);
    } catch {
        console.log('Address 0x471... is NOT a token or has no symbol()');
    }

    if (routerWeth === pmWeth) {
        console.log('\n✅ Both periphery contracts use the same "WETH9" address.');
    } else {
        console.log('\n❌ MISMATCH detected in WETH9 addresses!');
    }

    if (routerWeth.toLowerCase() === '0x471ece3750da237f93b8e339c536989b8978a438'.toLowerCase()) {
        console.log('✅ Matches local WCELO address: 0x471EcE3750Da237f93B8E339c536989b8978a438');
    } else {
        console.log('❌ Does NOT match expected 0x471... address!');
    }

  } catch (error) {
    console.error('Error querying contracts:', error);
  }
}

verify();
