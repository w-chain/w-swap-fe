import { Pair } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useLiquidityPortfolioAnalytics } from './useLiquidityPortfolioAnalytics'
import { useValuePnlPercent } from './useValuePnlPercent'

export function usePortfolioTotalPnl(pairs: Pair[]) {
  const analytics = useLiquidityPortfolioAnalytics(pairs)
  const { percent, ready } = useValuePnlPercent(analytics.totalPositionValueUsd, 'lp-total')

  return useMemo(
    () => ({
      percent,
      ready,
      loading: analytics.loading,
      totalValueUsd: analytics.totalPositionValueUsd
    }),
    [percent, ready, analytics.loading, analytics.totalPositionValueUsd]
  )
}

export function usePositionPnlPercent(pair: Pair, positionValueUsd?: number) {
  const scope = `pair:${pair.liquidityToken.address.toLowerCase()}`
  return useValuePnlPercent(positionValueUsd, scope)
}
