import { Percent, Token } from '@uniswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { getWSwapTradePairId } from '../../constants/wSwapOracle'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { estimateLpFeesUsd24h, useWSwapPairOracle } from '../../hooks/useWSwapPairOracle'
import { formatUsd } from '../../utils/formatUsd'
import { RowBetween } from '../Row'
import { EcosystemSection } from '../ecosystem/styled'
import Question from '../QuestionHelper'

const StatGrid = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
`

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #5c6a78;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a2430;
  line-height: 1.2;
`

const Muted = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: #5c6a78;
`

export interface WSwapPoolStatsCardProps {
  pairAddress?: string
  title?: string
  /** When set, shows estimated LP fee share for 24h volume. */
  poolShare?: Percent
  className?: string
}

export default function WSwapPoolStatsCard({
  pairAddress,
  title = 'Pool analytics',
  poolShare,
  className
}: WSwapPoolStatsCardProps) {
  const { chainId } = useActiveWeb3React()
  const tradePairId = getWSwapTradePairId(pairAddress, chainId)
  const oracle = useWSwapPairOracle(pairAddress)

  const lpToken = tradePairId && chainId && pairAddress ? new Token(chainId, pairAddress, 18, 'WLP', 'WLP') : undefined
  const totalSupply = useTotalSupply(lpToken)

  if (!tradePairId) {
    return null
  }

  const loading = oracle?.loading
  const poolTvlUsd =
    oracle && !oracle.loading && !oracle.error && totalSupply && oracle.lpPriceInUsd > 0
      ? parseFloat(totalSupply.toExact()) * oracle.lpPriceInUsd
      : undefined

  const feesUsd24h =
    oracle && !oracle.loading && !oracle.error ? estimateLpFeesUsd24h(oracle.vol24h, poolShare) : undefined

  return (
    <EcosystemSection className={className}>
      <RowBetween padding="0 4px">
        <Text color="#1a2430" fontWeight={600} fontSize={14}>
          {title}
        </Text>
        <Question text="Data from W Oracle (24h swap volume and LP USD price). Fee estimate uses 0.30% of 24h volume × your pool share when connected as an LP." />
      </RowBetween>

      <StatGrid>
        <StatCard>
          <StatLabel>Pair</StatLabel>
          <StatValue>{loading ? '…' : oracle?.pairName || `#${tradePairId}`}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>24h volume</StatLabel>
          <StatValue>{loading ? '…' : formatUsd(oracle?.vol24h)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Pool TVL (oracle)</StatLabel>
          <StatValue>{loading ? '…' : formatUsd(poolTvlUsd)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>LP token price</StatLabel>
          <StatValue>{loading ? '…' : formatUsd(oracle?.lpPriceInUsd)}</StatValue>
        </StatCard>
        {poolShare ? (
          <StatCard style={{ gridColumn: '1 / -1' }}>
            <StatLabel>Est. your 24h fees</StatLabel>
            <StatValue>{loading ? '…' : formatUsd(feesUsd24h)}</StatValue>
          </StatCard>
        ) : null}
      </StatGrid>

      {oracle?.error ? <Muted>Oracle unavailable: {oracle.error}</Muted> : null}

      {!loading && oracle && !oracle.error ? (
        <Muted>
          Latest oracle rate:{' '}
          {oracle.latestPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })} · Updates ~every 60s
        </Muted>
      ) : null}
    </EcosystemSection>
  )
}
