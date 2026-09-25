import { ChainId, Pair, Token, TokenAmount, WETH } from '@uniswap/sdk'
import { USDC, USDT, WCHAIN_TOKENS, WCHAIN_TESTNET_TOKENS } from '../constants'

export function getStablecoinsForChain(chainId?: ChainId): Token[] {
  if (!chainId) return []
  switch (chainId) {
    case ChainId.MAINNET:
      return [USDC, USDT]
    case ChainId.WCHAIN:
      return [WCHAIN_TOKENS.USDC, WCHAIN_TOKENS.USDT]
    case ChainId.WCHAIN_TESTNET:
      return [WCHAIN_TESTNET_TOKENS.USDC, WCHAIN_TESTNET_TOKENS.USDT]
    default:
      return []
  }
}

function reserveUsd(amount: TokenAmount, chainId: ChainId | undefined, wethUsd?: number): number | undefined {
  if (!chainId) return undefined
  const stables = getStablecoinsForChain(chainId)
  if (stables.some(token => token.equals(amount.token))) {
    return parseFloat(amount.toSignificant(6))
  }
  const weth = WETH[chainId]
  if (weth?.equals(amount.token) && wethUsd !== undefined) {
    return parseFloat(amount.toSignificant(6)) * wethUsd
  }
  return undefined
}

export function estimatePairTvlUsd(pair: Pair, chainId: ChainId | undefined, wethUsd?: number): number | undefined {
  const r0 = reserveUsd(pair.reserve0, chainId, wethUsd)
  const r1 = reserveUsd(pair.reserve1, chainId, wethUsd)
  if (r0 !== undefined && r1 !== undefined) return r0 + r1
  if (r0 !== undefined) return r0 * 2
  if (r1 !== undefined) return r1 * 2
  return undefined
}

export function estimatePositionValueUsd(
  pair: Pair,
  userLpBalance: TokenAmount,
  totalLpSupply: TokenAmount,
  chainId: ChainId | undefined,
  wethUsd?: number
): number | undefined {
  const tvl = estimatePairTvlUsd(pair, chainId, wethUsd)
  if (tvl === undefined || totalLpSupply.equalTo('0')) return undefined
  const share = parseFloat(userLpBalance.toExact()) / parseFloat(totalLpSupply.toExact())
  if (!Number.isFinite(share)) return undefined
  return tvl * share
}
