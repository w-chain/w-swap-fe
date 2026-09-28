import { Pair, TokenAmount, WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../constants/abis/erc20'
import { useActiveWeb3React } from '../hooks'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
import { estimatePairTvlUsd, estimatePositionValueUsd } from '../utils/estimateLiquidityUsd'
import { useStableUsdPrice } from './useStableUsdPrice'

export function useLiquidityPortfolioMetrics(pairs: Pair[]) {
  const { account, chainId } = useActiveWeb3React()

  const wethUsdQuote = useStableUsdPrice(chainId ? WETH[chainId] : undefined)
  const wethUsd = wethUsdQuote ? parseFloat(wethUsdQuote.toSignificant(8)) : undefined

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

    pairs.forEach((pair, i) => {
      const tvl = estimatePairTvlUsd(pair, chainId, wethUsd)
      if (tvl !== undefined) {
        totalPoolTvlUsd += tvl
        hasTvl = true
      }

      const userBal = balances[pair.liquidityToken.address]
      const supplyRaw = supplyResults[i]?.result?.[0]
      if (userBal && supplyRaw) {
        const totalSupply = new TokenAmount(pair.liquidityToken, supplyRaw.toString())
        const posUsd = estimatePositionValueUsd(pair, userBal, totalSupply, chainId, wethUsd)
        if (posUsd !== undefined) {
          totalPositionValueUsd += posUsd
          hasValue = true
        }
      }
    })

    return {
      positionCount: pairs.length,
      totalPositionValueUsd: hasValue ? totalPositionValueUsd : undefined,
      totalPoolTvlUsd: hasTvl ? totalPoolTvlUsd : undefined,
      loading: balancesLoading || suppliesLoading
    }
  }, [pairs, balances, supplyResults, chainId, wethUsd, balancesLoading, suppliesLoading])
}
