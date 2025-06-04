import { ChainId } from './chainId'

export const NETWORK_BLOCK_TIMES: { [chainId in ChainId]: number } = {
  [ChainId.MAINNET]: 12,
  [ChainId.WCHAIN]: 1,
  [ChainId.WCHAIN_TESTNET]: 1,
  [ChainId.BNB]: 3
} 