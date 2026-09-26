import { Pair } from '@uniswap/sdk'
import { useMemo } from 'react'
import { usePairs } from '../data/Reserves'
import { useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../state/user/hooks'
import { useActiveWeb3React } from './index'

export function useUserLiquidityPairs() {
  const { account } = useActiveWeb3React()

  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const isLoading =
    fetchingV2PairBalances ||
    v2Pairs.length < liquidityTokensWithBalances.length ||
    v2Pairs.some(([, pair]) => pair === null)

  const pairs = useMemo(
    () => v2Pairs.map(([, pair]) => pair).filter((p): p is Pair => Boolean(p)),
    [v2Pairs]
  )

  return { pairs, isLoading, account }
}
