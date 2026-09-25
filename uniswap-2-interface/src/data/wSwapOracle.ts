import { W_SWAP_ORACLE_BASE } from '../constants/wSwapOracle'

const CACHE_TTL_MS = 60_000

type CacheEntry<T> = { expiresAt: number; value: T }

const cache = new Map<string, CacheEntry<unknown>>()

async function cachedJson<T>(cacheKey: string, url: string): Promise<T> {
  const now = Date.now()
  const hit = cache.get(cacheKey) as CacheEntry<T> | undefined
  if (hit && hit.expiresAt > now) {
    return hit.value
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Oracle request failed (${response.status})`)
  }
  const value = (await response.json()) as T
  cache.set(cacheKey, { expiresAt: now + CACHE_TTL_MS, value })
  return value
}

export interface WSwapVolumeResponse {
  vol24h: number
  pair: string
}

export interface WSwapLpValueResponse {
  latestPrice: number
  lpPriceInUsd: number
  pair: string
}

export interface OracleTokenPriceResponse {
  price: number | null
  asset: string
  base_currency: string
}

export async function fetchWSwapPairVolume(tradePairId: number): Promise<WSwapVolumeResponse> {
  return cachedJson<WSwapVolumeResponse>(`volume:${tradePairId}`, `${W_SWAP_ORACLE_BASE}/w-swap/volume/${tradePairId}`)
}

export async function fetchWSwapPairLpValue(tradePairId: number): Promise<WSwapLpValueResponse> {
  return cachedJson<WSwapLpValueResponse>(
    `lp-value:${tradePairId}`,
    `${W_SWAP_ORACLE_BASE}/w-swap/lp-value/${tradePairId}`
  )
}

export async function fetchOracleTokenPrice(symbol: 'wco' | 'wave'): Promise<OracleTokenPriceResponse> {
  return cachedJson<OracleTokenPriceResponse>(`price:${symbol}`, `${W_SWAP_ORACLE_BASE}/price/${symbol}`)
}

export interface WSwapPairOracleStats {
  tradePairId: number
  pairName: string
  vol24h: number
  latestPrice: number
  lpPriceInUsd: number
}

/** Volume + LP value for one indexed pair (matches server ~60s cache). */
export async function fetchWSwapPairOracleStats(tradePairId: number): Promise<WSwapPairOracleStats> {
  const [volume, lpValue] = await Promise.all([
    fetchWSwapPairVolume(tradePairId),
    fetchWSwapPairLpValue(tradePairId)
  ])

  return {
    tradePairId,
    pairName: lpValue.pair || volume.pair,
    vol24h: volume.vol24h,
    latestPrice: lpValue.latestPrice,
    lpPriceInUsd: lpValue.lpPriceInUsd
  }
}
