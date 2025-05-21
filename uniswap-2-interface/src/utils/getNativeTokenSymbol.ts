import { ChainId, Currency, ETHER } from '@uniswap/sdk'

export function getNativeTokenSymbol(chainId?: ChainId) {
  switch (chainId) {
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return 'WCO';
    case ChainId.BNB:
      return 'BNB';
    default:
      return 'ETH';
  }
}

export function getWrappedNativeTokenSymbol(chainId?: ChainId) {
  switch (chainId) {
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return 'WWCO';
    case ChainId.BNB:
      return 'WBNB';
    default:
      return 'WETH';
  }
}

export function getCurrencySymbol(currency?: Currency | null, chainId?: ChainId) {
  if (currency === ETHER) {
    return getNativeTokenSymbol(chainId)
  }

  return currency?.symbol || ''
}
