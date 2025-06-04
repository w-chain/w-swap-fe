import { ChainId } from './chainId'

export const NETWORK_EXPLORERS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://etherscan.io',
  [ChainId.WCHAIN]: 'https://arbiscan.io',
  [ChainId.WCHAIN_TESTNET]: 'https://sepolia.arbiscan.io',
  [ChainId.BNB]: 'https://bscscan.com'
} 