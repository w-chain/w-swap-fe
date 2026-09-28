const STORAGE_PREFIX = 'wswap-pnl-v1'
const MAX_SNAPSHOTS = 72
export const PNl_COMPARE_MS = 24 * 60 * 60 * 1000
const MIN_WRITE_INTERVAL_MS = 60 * 60 * 1000

export interface ValueSnapshot {
  t: number
  valueUsd: number
}

function storageKey(suffix: string): string {
  return `${STORAGE_PREFIX}:${suffix}`
}

export function readSnapshots(suffix: string): ValueSnapshot[] {
  try {
    const raw = localStorage.getItem(storageKey(suffix))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ValueSnapshot[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(s => typeof s.t === 'number' && typeof s.valueUsd === 'number' && s.valueUsd > 0)
  } catch {
    return []
  }
}

export function writeSnapshot(suffix: string, valueUsd: number): void {
  if (!Number.isFinite(valueUsd) || valueUsd <= 0) return

  const now = Date.now()
  const existing = readSnapshots(suffix)
  const last = existing[existing.length - 1]
  if (last && now - last.t < MIN_WRITE_INTERVAL_MS) {
    existing[existing.length - 1] = { t: now, valueUsd }
  } else {
    existing.push({ t: now, valueUsd })
  }

  const trimmed = existing.slice(-MAX_SNAPSHOTS)
  try {
    localStorage.setItem(storageKey(suffix), JSON.stringify(trimmed))
  } catch {
    // ignore quota errors
  }
}

/** Snapshot closest to (now - windowMs), preferring at least ~1h of history. */
export function baselineSnapshot(snapshots: ValueSnapshot[], windowMs = PNl_COMPARE_MS): ValueSnapshot | undefined {
  if (snapshots.length === 0) return undefined

  const now = Date.now()
  const target = now - windowMs
  const minAge = 60 * 60 * 1000

  let best: ValueSnapshot | undefined
  for (const snap of snapshots) {
    if (snap.t > now - minAge) continue
    if (snap.t <= target) {
      if (!best || snap.t > best.t) best = snap
    }
  }

  if (best) return best

  const oldest = snapshots[0]
  if (oldest && now - oldest.t >= minAge) return oldest

  return undefined
}

export function percentChange(current?: number, baseline?: number): number | undefined {
  if (current === undefined || baseline === undefined || !Number.isFinite(current) || !Number.isFinite(baseline)) {
    return undefined
  }
  if (baseline <= 0) return undefined
  return ((current - baseline) / baseline) * 100
}
