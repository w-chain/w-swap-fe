import { ChainId } from './chainId'

export const LIQUIDITY_CONFIRMATIONS: { [chainId in ChainId]: number } = {
  [ChainId.MAINNET]: 1,
  [ChainId.WCHAIN]: 1,
  [ChainId.WCHAIN_TESTNET]: 1,
  [ChainId.BNB]: 1
} 