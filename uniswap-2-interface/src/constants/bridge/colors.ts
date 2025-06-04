import { ChainId } from './chainId'

export const NETWORK_COLORS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '#627EEA',
  [ChainId.WCHAIN]: '#28A0F0',
  [ChainId.WCHAIN_TESTNET]: '#28A0F0',
  [ChainId.BNB]: '#F3BA2F'
} 