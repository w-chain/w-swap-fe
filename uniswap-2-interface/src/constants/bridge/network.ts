import { ChainId } from './chainId'

export const NETWORK_LABELS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.WCHAIN]: 'Arbitrum',
  [ChainId.WCHAIN_TESTNET]: 'Arbitrum Sepolia',
  [ChainId.BNB]: 'BNB Chain'
} 