import { Networks } from '../constants/networks'
import { ChainId } from '@uniswap/sdk'

export const getNetworkChainId = (network: Networks, isTestnet: boolean): ChainId => {
  switch (network) {
    case Networks.ETH:
      return ChainId.MAINNET
    case Networks.BSC:
      return ChainId.BNB
    case Networks.WCHAIN:
      return isTestnet ? ChainId.WCHAIN_TESTNET : ChainId.WCHAIN
    default:
      return ChainId.MAINNET
  }
}

export const getNetworkFromChainId = (chainId: ChainId): Networks => {
  switch (chainId) {
    case ChainId.MAINNET:
      return Networks.ETH
    case ChainId.BNB:
      return Networks.BSC
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return Networks.WCHAIN
    default:
      return Networks.ETH
  }
} 