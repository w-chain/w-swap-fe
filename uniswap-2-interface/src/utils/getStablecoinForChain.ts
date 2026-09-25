import { ChainId, Token } from '@uniswap/sdk'
import { USDC, WCHAIN_TOKENS, WCHAIN_TESTNET_TOKENS } from '../constants'

export function getUSDCForChain(chainId?: ChainId): Token | undefined {
  if (!chainId) return undefined
  switch (chainId) {
    case ChainId.MAINNET:
      return USDC
    case ChainId.WCHAIN:
      return WCHAIN_TOKENS.USDC
    case ChainId.WCHAIN_TESTNET:
      return WCHAIN_TESTNET_TOKENS.USDC
    default:
      return undefined
  }
}
