import { AddEthereumChainParameter } from 'viem'

export enum EvmChainIdEnum {
  ETHEREUM = '0x1',
  KAIA = '0x2019', // 8217
  KAIROS = '0x3e9', // 1001 kaia testnet
  SEPOLIA = '0xaa36a7', // 11155111,
}

const evmChainParams: Record<EvmChainIdEnum, AddEthereumChainParameter> = {
  [EvmChainIdEnum.ETHEREUM]: {
    chainId: EvmChainIdEnum.ETHEREUM,
    chainName: 'Ethereum',
    rpcUrls: ['https://eth.merkle.io/'],
    nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  [EvmChainIdEnum.SEPOLIA]: {
    chainId: EvmChainIdEnum.SEPOLIA,
    chainName: 'Sepolia',
    rpcUrls: [
      'https://eth-sepolia.public.blastapi.io',
      'wss://ethereum-sepolia-rpc.publicnode.com',
      'https://1rpc.io/sepolia',
      'https://sepolia.drpc.org/',
    ],
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
  [EvmChainIdEnum.KAIA]: {
    chainId: EvmChainIdEnum.KAIA,
    chainName: 'Kaia Mainnet',
    rpcUrls: ['https://public-en.node.kaia.io/'],
    nativeCurrency: { name: 'Kaia Token', decimals: 18, symbol: 'KAIA' },
    blockExplorerUrls: ['https://kaiascan.io/'],
  },
  [EvmChainIdEnum.KAIROS]: {
    chainId: EvmChainIdEnum.KAIROS,
    chainName: 'Kaia Kairos Testnet',
    rpcUrls: ['https://public-en-kairos.node.kaia.io/'],
    nativeCurrency: { name: 'Kaia Token', decimals: 18, symbol: 'KAIA' },
    blockExplorerUrls: ['https://kairos.kaiascan.io/'],
  },
}

export default {
  evmChainParams,
}
