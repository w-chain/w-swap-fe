import { ChainId } from '@uniswap/sdk'

export const NETWORK_LABELS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.WCHAIN]: 'W Chain',
  [ChainId.WCHAIN_TESTNET]: 'W Chain Testnet',
  [ChainId.BNB]: 'BNB'
} 