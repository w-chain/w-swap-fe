export function formatUsd(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return '—'
  }
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (abs >= 10_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  if (abs > 0 && abs < 0.01) {
    return '<$0.01'
  }
  return `$${value.toFixed(2)}`
}
