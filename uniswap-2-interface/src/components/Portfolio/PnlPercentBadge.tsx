import React from 'react'
import styled from 'styled-components'

const Badge = styled.span<{ $positive: boolean; $neutral?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $neutral, $positive }) => ($neutral ? '#5c6a78' : $positive ? '#16a34a' : '#dc2626')};
`

export default function PnlPercentBadge({
  percent,
  loading,
  suffix = ''
}: {
  percent?: number
  loading?: boolean
  suffix?: string
}) {
  if (loading) {
    return <Badge $positive $neutral>…</Badge>
  }

  if (percent === undefined || !Number.isFinite(percent)) {
    return (
      <Badge $positive $neutral title="P/L appears after ~1 hour of tracked history in this browser">
        —
      </Badge>
    )
  }

  if (Math.abs(percent) < 0.005) {
    return (
      <Badge $positive $neutral>
        → 0.00%{suffix}
      </Badge>
    )
  }

  const positive = percent >= 0
  const arrow = positive ? '▲' : '▼'

  return (
    <Badge $positive={positive}>
      {arrow} {Math.abs(percent).toFixed(2)}%{suffix}
    </Badge>
  )
}
