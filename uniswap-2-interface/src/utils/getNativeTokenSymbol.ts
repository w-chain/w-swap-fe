import { ChainId, Currency, ETHER } from '@uniswap/sdk'
import { WADZCHAIN_CHAIN_ID } from '../wadzchain_config'

const BNB_CHAIN_ID = 56

export function getNativeTokenSymbol(chainId?: ChainId) {
  if (chainId === WADZCHAIN_CHAIN_ID) {
    return 'WCO'
  }
  if (chainId === BNB_CHAIN_ID) {
    return 'BNB'
  }

  return 'ETH'
}

export function getWrappedNativeTokenSymbol(chainId?: ChainId) {
  if (chainId === WADZCHAIN_CHAIN_ID) {
    return 'WCO'
  } else if (chainId === BNB_CHAIN_ID) {
    return 'WBNB'
  }

  return 'WETH'
}

export function getCurrencySymbol(currency?: Currency | null, chainId?: ChainId) {
  if (currency === ETHER) {
    return getNativeTokenSymbol(chainId)
  }

  return currency?.symbol || ''
}
