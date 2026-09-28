import { Currency, Pair, Trade } from '@uniswap/sdk'
import { useMemo } from 'react'
import { getWSwapTradePairId } from '../constants/wSwapOracle'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

/** Resolves a W-Swap indexed pair contract address for oracle stats (direct pool or first indexed hop). */
export function useIndexedPairAddress(
  currencyA?: Currency,
  currencyB?: Currency,
  trade?: Trade | null
): string | undefined {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return undefined

    const tokenA = wrappedCurrency(currencyA, chainId)
    const tokenB = wrappedCurrency(currencyB, chainId)
    if (tokenA && tokenB && !tokenA.equals(tokenB)) {
      const direct = Pair.getAddress(tokenA, tokenB)
      if (getWSwapTradePairId(direct, chainId)) return direct
    }

    if (trade) {
      for (const pair of trade.route.pairs) {
        const addr = pair.liquidityToken.address
        if (getWSwapTradePairId(addr, chainId)) return addr
      }
    }

    return undefined
  }, [chainId, currencyA, currencyB, trade])
}
