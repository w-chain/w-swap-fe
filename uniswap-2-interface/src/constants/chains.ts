import { ChainId } from '@uniswap/sdk'

export interface ChainConfig {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  iconUrl?: string
}

export interface NetworkInfo {
  chainId: ChainId
  name: string
  shortName: string
  icon: string
  color: string
  isTestnet: boolean
}

export const CHAIN_CONFIG: { [chainId in ChainId]?: ChainConfig } = {
  [ChainId.MAINNET]: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ethereum-rpc.publicnode.com'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  [ChainId.BNB]: {
    chainId: 56,
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-rpc.publicnode.com'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.WCHAIN]: {
    chainId: 171717,
    chainName: 'W Chain Network',
    nativeCurrency: {
      name: 'WCOIN',
      symbol: 'W',
      decimals: 18
    },
    rpcUrls: ['https://rpc.w-chain.com'],
    blockExplorerUrls: ['https://explorer.w-chain.com']
  },
  [ChainId.WCHAIN_TESTNET]: {
    chainId: 71117,
    chainName: 'W Chain Testnet',
    nativeCurrency: {
      name: 'WCOIN',
      symbol: 'W',
      decimals: 18
    },
    rpcUrls: ['https://rpc-testnet.w-chain.com'],
    blockExplorerUrls: ['https://explorer-testnet.w-chain.com']
  }
}

export const NETWORK_INFO: { [chainId in ChainId]?: NetworkInfo } = {
  [ChainId.MAINNET]: {
    chainId: ChainId.MAINNET,
    name: 'Ethereum',
    shortName: 'ETH',
    icon: '/images/networks/eth.webp',
    color: '#627EEA',
    isTestnet: false
  },
  [ChainId.BNB]: {
    chainId: ChainId.BNB,
    name: 'BSC',
    shortName: 'BSC',
    icon: '/images/networks/bsc.webp',
    color: '#F0B90B',
    isTestnet: false
  },
  [ChainId.WCHAIN]: {
    chainId: ChainId.WCHAIN,
    name: 'W Chain',
    shortName: 'W',
    icon: '/images/networks/w-chain.webp',
    color: '#043F84',
    isTestnet: false
  },
  [ChainId.WCHAIN_TESTNET]: {
    chainId: ChainId.WCHAIN_TESTNET,
    name: 'W Chain Testnet',
    shortName: 'W Test',
    icon: '/images/networks/w-chain.webp',
    color: '#043F84',
    isTestnet: true
  }
}

export const SELECTABLE_CHAINS = [
  ChainId.WCHAIN,
  ChainId.BNB,
  ChainId.MAINNET
]

export function getNetworkInfo(chainId: ChainId | undefined): NetworkInfo | undefined {
  if (!chainId) return undefined
  return NETWORK_INFO[chainId]
}

export function getChainConfig(chainId: ChainId | undefined): ChainConfig | undefined {
  if (!chainId) return undefined
  return CHAIN_CONFIG[chainId]
}

export function isSelectableChain(chainId: ChainId | undefined): boolean {
  if (!chainId) return false
  return SELECTABLE_CHAINS.includes(chainId)
}
