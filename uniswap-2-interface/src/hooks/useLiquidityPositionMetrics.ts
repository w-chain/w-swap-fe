import { CurrencyAmount, JSBI, Pair, Percent, Price, TokenAmount, WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useTotalSupply } from '../data/TotalSupply'
import { useActiveWeb3React } from '../hooks'
import { useOracleNativeUsdPrice } from './useOracleNativeUsdPrice'
import { useStableUsdPrice } from './useStableUsdPrice'
import { useTokenBalance } from '../state/wallet/hooks'
import { estimatePairTvlUsd, estimatePositionValueUsd } from '../utils/estimateLiquidityUsd'
import { unwrappedToken } from '../utils/wrappedCurrency'

function amountUsd(amount: TokenAmount | undefined, price: Price | undefined): number | undefined {
  if (!amount || !price || amount.equalTo('0')) return undefined
  try {
    return parseFloat(price.quote(amount).toSignificant(6))
  } catch {
    return undefined
  }
}

function currencyAmountUsd(amount: CurrencyAmount | undefined, price: Price | undefined): number | undefined {
  if (!amount || !price || amount.equalTo('0')) return undefined
  try {
    return parseFloat(price.quote(amount).toSignificant(6))
  } catch {
    return undefined
  }
}

export interface LiquidityPositionMetrics {
  poolShare?: Percent
  poolTvlUsd?: number
  positionValueUsd?: number
  token0Deposited?: TokenAmount
  token1Deposited?: TokenAmount
  price?: Price
  loadingShare: boolean
}

export function useLiquidityPositionMetrics(pair: Pair): LiquidityPositionMetrics {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const price0 = useStableUsdPrice(currency0)
  const price1 = useStableUsdPrice(currency1)
  const wethUsdQuote = useStableUsdPrice(chainId ? WETH[chainId] : undefined)
  const oracleNativeUsd = useOracleNativeUsdPrice()
  const wethUsd = wethUsdQuote
    ? parseFloat(wethUsdQuote.toSignificant(8))
    : oracleNativeUsd

  return useMemo(() => {
    const loadingShare = !totalPoolTokens || !userPoolBalance

    const poolShare =
      !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
        : undefined

    const [token0Deposited, token1Deposited] =
      !!totalPoolTokens &&
      !!userPoolBalance &&
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? [
            pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
            pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
          ]
        : [undefined, undefined]

    const reserve0Usd = currencyAmountUsd(pair.reserve0, price0)
    const reserve1Usd = currencyAmountUsd(pair.reserve1, price1)
    let poolTvlUsd: number | undefined
    if (reserve0Usd !== undefined && reserve1Usd !== undefined) {
      poolTvlUsd = reserve0Usd + reserve1Usd
    } else if (reserve0Usd !== undefined) {
      poolTvlUsd = reserve0Usd * 2
    } else if (reserve1Usd !== undefined) {
      poolTvlUsd = reserve1Usd * 2
    }

    const pos0 = amountUsd(token0Deposited, price0)
    const pos1 = amountUsd(token1Deposited, price1)
    let positionValueUsd: number | undefined
    if (pos0 !== undefined && pos1 !== undefined) {
      positionValueUsd = pos0 + pos1
    } else if (poolTvlUsd !== undefined && poolShare) {
      positionValueUsd = parseFloat(poolShare.toSignificant(8)) * 0.01 * poolTvlUsd
    } else if (pos0 !== undefined) {
      positionValueUsd = pos0 * 2
    } else if (pos1 !== undefined) {
      positionValueUsd = pos1 * 2
    }

    if (poolTvlUsd === undefined) {
      poolTvlUsd = estimatePairTvlUsd(pair, chainId, wethUsd)
    }
    if (
      positionValueUsd === undefined &&
      userPoolBalance &&
      totalPoolTokens &&
      JSBI.greaterThan(totalPoolTokens.raw, JSBI.BigInt(0))
    ) {
      positionValueUsd = estimatePositionValueUsd(pair, userPoolBalance, totalPoolTokens, chainId, wethUsd)
    }

    let price: Price | undefined
    try {
      price = pair.priceOf(pair.token1)
    } catch {
      price = undefined
    }

    return {
      poolShare,
      poolTvlUsd,
      positionValueUsd,
      token0Deposited,
      token1Deposited,
      price,
      loadingShare
    }
  }, [chainId, pair, price0, price1, totalPoolTokens, userPoolBalance, wethUsd])
}
