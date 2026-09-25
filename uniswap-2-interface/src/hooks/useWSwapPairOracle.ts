import { ChainId, Pair, Percent } from '@uniswap/sdk'
import { useEffect, useMemo, useState } from 'react'
import { fetchWSwapPairOracleStats, WSwapPairOracleStats } from '../data/wSwapOracle'
import { useActiveWeb3React } from '../hooks'
import { getWSwapTradePairId, W_SWAP_LP_FEE_BPS } from '../constants/wSwapOracle'

export interface WSwapPairOracleView extends WSwapPairOracleStats {
  loading: boolean
  error?: string
}

const emptyOracle: WSwapPairOracleView = {
  tradePairId: 0,
  pairName: '',
  vol24h: 0,
  latestPrice: 0,
  lpPriceInUsd: 0,
  loading: false
}

export function useWSwapPairOracle(pairAddress?: string): WSwapPairOracleView | undefined {
  const { chainId } = useActiveWeb3React()
  const tradePairId = getWSwapTradePairId(pairAddress, chainId)

  const [state, setState] = useState<WSwapPairOracleView | undefined>(() =>
    tradePairId ? { ...emptyOracle, tradePairId, loading: true } : undefined
  )

  useEffect(() => {
    if (!tradePairId || chainId !== ChainId.WCHAIN) {
      setState(undefined)
      return
    }

    let cancelled = false
    setState({ ...emptyOracle, tradePairId, loading: true })

    fetchWSwapPairOracleStats(tradePairId)
      .then(stats => {
        if (cancelled) return
        setState({ ...stats, loading: false })
      })
      .catch(err => {
        if (cancelled) return
        setState({
          ...emptyOracle,
          tradePairId,
          loading: false,
          error: err instanceof Error ? err.message : 'Oracle unavailable'
        })
      })

    return () => {
      cancelled = true
    }
  }, [tradePairId, chainId])

  return tradePairId ? state : undefined
}

export function useWSwapPairsOracle(pairs: Pair[]) {
  const { chainId } = useActiveWeb3React()

  const pairIds = useMemo(() => {
    if (chainId !== ChainId.WCHAIN) return [] as number[]
    const ids = pairs
      .map(p => getWSwapTradePairId(p.liquidityToken.address, chainId))
      .filter((id): id is number => id !== undefined)
    return Array.from(new Set(ids)).sort((a, b) => a - b)
  }, [pairs, chainId])

  const [byId, setById] = useState<Record<number, WSwapPairOracleView>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pairIds.length === 0) {
      setById({})
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all(
      pairIds.map(async id => {
        try {
          const stats = await fetchWSwapPairOracleStats(id)
          return [id, { ...stats, loading: false }] as const
        } catch (err) {
          return [
            id,
            {
              ...emptyOracle,
              tradePairId: id,
              loading: false,
              error: err instanceof Error ? err.message : 'Oracle unavailable'
            }
          ] as const
        }
      })
    ).then(entries => {
      if (cancelled) return
      setById(Object.fromEntries(entries))
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [pairIds])

  const byPairAddress = useMemo(() => {
    const map: Record<string, WSwapPairOracleView> = {}
    pairs.forEach(pair => {
      const id = getWSwapTradePairId(pair.liquidityToken.address, chainId)
      if (id && byId[id]) {
        map[pair.liquidityToken.address.toLowerCase()] = byId[id]
      }
    })
    return map
  }, [pairs, byId, chainId])

  return { byPairAddress, byId, loading, supported: chainId === ChainId.WCHAIN }
}

/** LP provider's estimated share of 24h swap fees (0.30% × volume × pool share). */
export function estimateLpFeesUsd24h(vol24h: number, poolShare?: Percent): number | undefined {
  if (!poolShare || vol24h <= 0) return vol24h === 0 ? 0 : undefined
  const share = parseFloat(poolShare.toFixed(6)) / 100
  if (!Number.isFinite(share)) return undefined
  return vol24h * (W_SWAP_LP_FEE_BPS / 10_000) * share
}
