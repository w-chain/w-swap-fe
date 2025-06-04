import { ChainId } from './chainId'

export const BRIDGE_CONFIRMATIONS: { [chainId in ChainId]: number } = {
  [ChainId.MAINNET]: 64,
  [ChainId.WCHAIN]: 64,
  [ChainId.WCHAIN_TESTNET]: 64,
  [ChainId.BNB]: 64
} 