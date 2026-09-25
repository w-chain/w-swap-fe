import { Pair } from '@uniswap/sdk'
import React from 'react'
import { useLiquidityPositionAnalytics } from '../../hooks/useLiquidityPositionAnalytics'
import WSwapPoolStatsCard from './WSwapPoolStatsCard'

export default function AddLiquidityOracleStats({ pair }: { pair: Pair }) {
  const { poolShare } = useLiquidityPositionAnalytics(pair)

  return (
    <WSwapPoolStatsCard
      pairAddress={pair.liquidityToken.address}
      title="W Oracle pool stats"
      poolShare={poolShare}
    />
  )
}
