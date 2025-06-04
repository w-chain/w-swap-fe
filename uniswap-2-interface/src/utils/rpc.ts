import { ChainId } from '../constants/bridge/chainId'

// Alchemy API key should be stored in environment variables
const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY || ''

export function getAlchemyRpcUrl(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    case ChainId.WCHAIN:
      return 'https://rpc.w-chain.com'
    case ChainId.WCHAIN_TESTNET:
      return 'https://rpc-testnet.w-chain.com'
    case ChainId.BNB:
      return `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    default:
      throw new Error(`Unsupported chainId: ${chainId}`)
  }
}

// Fallback RPC URLs in case Alchemy is not available
export const FALLBACK_RPC_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [ChainId.WCHAIN]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.WCHAIN_TESTNET]: 'https://sepolia-rollup.arbitrum.io/rpc',
  [ChainId.BNB]: 'https://bsc-dataseed.binance.org'
}

// Get RPC URL with fallback
export function getRpcUrl(chainId: ChainId): string {
  try {
    return getAlchemyRpcUrl(chainId)
  } catch (error) {
    return FALLBACK_RPC_URLS[chainId]
  }
} 