import { useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import {
  baselineSnapshot,
  percentChange,
  readSnapshots,
  writeSnapshot
} from '../utils/portfolioPnlStorage'

/**
 * Tracks USD value in localStorage and returns ~24h P/L % for this browser session history.
 */
export function useValuePnlPercent(valueUsd: number | undefined, scope: string): { percent?: number; ready: boolean } {
  const { account, chainId } = useActiveWeb3React()
  const [tick, setTick] = useState(0)

  const storageSuffix = account && chainId ? `${chainId}:${account.toLowerCase()}:${scope}` : undefined

  useEffect(() => {
    if (!storageSuffix || valueUsd === undefined || valueUsd <= 0) return
    writeSnapshot(storageSuffix, valueUsd)
    setTick(t => t + 1)
  }, [storageSuffix, valueUsd])

  return useMemo(() => {
    if (!storageSuffix || valueUsd === undefined) {
      return { percent: undefined, ready: false }
    }

    const snaps = readSnapshots(storageSuffix)
    const baseline = baselineSnapshot(snaps)
    const percent = percentChange(valueUsd, baseline?.valueUsd)

    return {
      percent,
      ready: Boolean(baseline)
    }
  }, [storageSuffix, valueUsd, tick])
}
