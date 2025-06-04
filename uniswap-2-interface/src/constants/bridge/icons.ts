import { ChainId } from './chainId'

export const NETWORK_ICONS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '/images/networks/ethereum.svg',
  [ChainId.WCHAIN]: '/images/networks/arbitrum.svg',
  [ChainId.WCHAIN_TESTNET]: '/images/networks/arbitrum.svg',
  [ChainId.BNB]: '/images/networks/bnb.svg'
} 