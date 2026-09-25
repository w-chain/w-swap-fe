import { JSBI, Pair, Percent, TokenAmount, WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../constants/abis/erc20'
import { getWSwapTradePairId } from '../constants/wSwapOracle'
import { useActiveWeb3React } from '../hooks'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
import { estimatePairTvlUsd, estimatePositionValueUsd } from '../utils/estimateLiquidityUsd'
import { useOracleNativeUsdPrice } from './useOracleNativeUsdPrice'
import { useStableUsdPrice } from './useStableUsdPrice'
import { estimateLpFeesUsd24h, useWSwapPairsOracle } from './useWSwapPairOracle'

export function useLiquidityPortfolioAnalytics(pairs: Pair[]) {
  const { account, chainId } = useActiveWeb3React()
  const { byPairAddress, loading: oracleLoading, supported: oracleSupported } = useWSwapPairsOracle(pairs)

  const wethUsdQuote = useStableUsdPrice(chainId ? WETH[chainId] : undefined)
  const oracleNativeUsd = useOracleNativeUsdPrice()
  const wethUsd = wethUsdQuote ? parseFloat(wethUsdQuote.toSignificant(8)) : oracleNativeUsd

  const liquidityTokens = useMemo(() => pairs.map(p => p.liquidityToken), [pairs])
  const [balances, balancesLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  const lpAddresses = useMemo(() => pairs.map(p => p.liquidityToken.address), [pairs])
  const supplyResults = useMultipleContractSingleData(lpAddresses, ERC20_INTERFACE, 'totalSupply')
  const suppliesLoading = useMemo(() => supplyResults.some(r => r.loading), [supplyResults])

  return useMemo(() => {
    let totalPositionValueUsd = 0
    let hasValue = false
    let totalPoolTvlUsd = 0
    let hasTvl = false
    let totalVol24h = 0
    let hasVol = false
    let totalFeesUsd24h = 0
    let hasFees = false
    let oraclePositionCount = 0

    pairs.forEach((pair, i) => {
      const oracle = byPairAddress[pair.liquidityToken.address.toLowerCase()]
      const userBal = balances[pair.liquidityToken.address]
      const supplyRaw = supplyResults[i]?.result?.[0]
      const totalSupply = supplyRaw ? new TokenAmount(pair.liquidityToken, supplyRaw.toString()) : undefined

      let posUsd: number | undefined
      let tvlUsd: number | undefined

      if (oracle && !oracle.loading && !oracle.error && oracle.lpPriceInUsd > 0) {
        oraclePositionCount += 1
        if (userBal) {
          posUsd = parseFloat(userBal.toExact()) * oracle.lpPriceInUsd
        }
        if (totalSupply && JSBI.greaterThan(totalSupply.raw, JSBI.BigInt(0))) {
          tvlUsd = parseFloat(totalSupply.toExact()) * oracle.lpPriceInUsd
        }
        if (oracle.vol24h >= 0) {
          totalVol24h += oracle.vol24h
          hasVol = true
        }
        if (userBal && totalSupply && JSBI.greaterThan(totalSupply.raw, JSBI.BigInt(0))) {
          const poolShare = new Percent(userBal.raw, totalSupply.raw)
          const fees = estimateLpFeesUsd24h(oracle.vol24h, poolShare)
          if (fees !== undefined) {
            totalFeesUsd24h += fees
            hasFees = true
          }
        }
      }

      if (posUsd === undefined) {
        if (userBal && totalSupply) {
          posUsd = estimatePositionValueUsd(pair, userBal, totalSupply, chainId, wethUsd)
        }
      }
      if (tvlUsd === undefined) {
        tvlUsd = estimatePairTvlUsd(pair, chainId, wethUsd)
      }

      if (posUsd !== undefined) {
        totalPositionValueUsd += posUsd
        hasValue = true
      }
      if (tvlUsd !== undefined) {
        totalPoolTvlUsd += tvlUsd
        hasTvl = true
      }
    })

    const indexedPairs = pairs.filter(p => getWSwapTradePairId(p.liquidityToken.address, chainId) !== undefined).length

    return {
      positionCount: pairs.length,
      indexedPairs,
      oraclePositionCount,
      totalPositionValueUsd: hasValue ? totalPositionValueUsd : undefined,
      totalPoolTvlUsd: hasTvl ? totalPoolTvlUsd : undefined,
      totalVol24h: hasVol ? totalVol24h : undefined,
      totalFeesUsd24h: hasFees ? totalFeesUsd24h : undefined,
      loading: balancesLoading || suppliesLoading || oracleLoading,
      oracleSupported
    }
  }, [
    pairs,
    balances,
    supplyResults,
    chainId,
    wethUsd,
    balancesLoading,
    suppliesLoading,
    byPairAddress,
    oracleLoading,
    oracleSupported
  ])
}
