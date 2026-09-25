import { JSBI, Pair, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useTotalSupply } from '../data/TotalSupply'
import { useActiveWeb3React } from '../hooks'
import { useTokenBalance } from '../state/wallet/hooks'
import { useLiquidityPositionMetrics } from './useLiquidityPositionMetrics'
import { estimateLpFeesUsd24h, useWSwapPairOracle } from './useWSwapPairOracle'

export function useLiquidityPositionAnalytics(pair: Pair) {
  const { account } = useActiveWeb3React()
  const onChain = useLiquidityPositionMetrics(pair)
  const oracle = useWSwapPairOracle(pair.liquidityToken.address)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  return useMemo(() => {
    let positionValueUsd = onChain.positionValueUsd
    let poolTvlUsd = onChain.poolTvlUsd
    let valueSource: 'oracle' | 'on-chain' | 'mixed' = 'on-chain'

    if (oracle && !oracle.loading && !oracle.error && oracle.lpPriceInUsd > 0) {
      if (userPoolBalance) {
        positionValueUsd = parseFloat(userPoolBalance.toExact()) * oracle.lpPriceInUsd
        valueSource = 'oracle'
      }
      if (totalPoolTokens && JSBI.greaterThan(totalPoolTokens.raw, JSBI.BigInt(0))) {
        poolTvlUsd = parseFloat(totalPoolTokens.toExact()) * oracle.lpPriceInUsd
        valueSource = 'oracle'
      }
    }

    const feesUsd24h = oracle && !oracle.loading ? estimateLpFeesUsd24h(oracle.vol24h, onChain.poolShare) : undefined

    return {
      ...onChain,
      positionValueUsd,
      poolTvlUsd,
      valueSource,
      oracle,
      vol24h: oracle?.vol24h,
      latestOraclePrice: oracle?.latestPrice,
      oraclePairName: oracle?.pairName,
      lpPriceInUsd: oracle?.lpPriceInUsd,
      feesUsd24h
    }
  }, [onChain, oracle, userPoolBalance, totalPoolTokens])
}
