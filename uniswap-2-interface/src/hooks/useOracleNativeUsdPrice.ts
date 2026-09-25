import { ChainId } from '@uniswap/sdk'
import { useEffect, useState } from 'react'
import { fetchOracleTokenPrice } from '../data/wSwapOracle'
import { useActiveWeb3React } from '../hooks'

/** WCO USD from [Public Price API](https://docs.w-chain.com/advanced-features/public-price-api) on W Chain mainnet. */
export function useOracleNativeUsdPrice(): number | undefined {
  const { chainId } = useActiveWeb3React()
  const [price, setPrice] = useState<number | undefined>()

  useEffect(() => {
    if (chainId !== ChainId.WCHAIN) {
      setPrice(undefined)
      return
    }

    let cancelled = false
    fetchOracleTokenPrice('wco')
      .then(res => {
        if (!cancelled) setPrice(res.price ?? undefined)
      })
      .catch(() => {
        if (!cancelled) setPrice(undefined)
      })

    return () => {
      cancelled = true
    }
  }, [chainId])

  return price
}
