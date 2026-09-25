import { Currency, currencyEquals, JSBI, Price, WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { getUSDCForChain } from '../utils/getStablecoinForChain'
import { wrappedCurrency } from '../utils/wrappedCurrency'

/**
 * USD price of a token via on-chain stablecoin pairs (chain-aware USDC).
 */
export function useStableUsdPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const usdc = getUSDCForChain(chainId)
  const wrapped = wrappedCurrency(currency, chainId)

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
        chainId ? WETH[chainId] : undefined
      ],
      [wrapped?.equals(usdc) ? undefined : wrapped, usdc],
      [chainId ? WETH[chainId] : undefined, usdc]
    ],
    [chainId, currency, wrapped, usdc]
  )

  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !usdc) {
      return undefined
    }
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WETH[chainId])
        return new Price(currency, usdc, price.denominator, price.numerator)
      }
      return undefined
    }
    if (wrapped.equals(usdc)) {
      return new Price(usdc, usdc, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(usdc).greaterThan(ethPairETHUSDCValue)) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, usdc, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(usdc).greaterThan('0') && ethPair.reserveOf(WETH[chainId]).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(usdc)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, usdc, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdc, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}
