import { Pair } from '@uniswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { EcosystemSection } from '../ecosystem/styled'
import { useLiquidityPortfolioAnalytics } from '../../hooks/useLiquidityPortfolioAnalytics'
import { formatUsd } from '../../utils/formatUsd'
import Question from '../QuestionHelper'

const StatGrid = styled.div`
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
  font-size: 12px;
  font-weight: 600;
  color: #5c6a78;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1a2430;
  line-height: 1.2;
`

const Note = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #5c6a78;
`

interface LiquidityOverviewProps {
  pairs: Pair[]
}

export default function LiquidityOverview({ pairs }: LiquidityOverviewProps) {
  const {
    positionCount,
    totalPositionValueUsd,
    totalPoolTvlUsd,
    totalVol24h,
    totalFeesUsd24h,
    oracleSupported,
    oraclePositionCount,
    loading
  } = useLiquidityPortfolioAnalytics(pairs)

  if (positionCount === 0) {
    return null
  }

  return (
    <EcosystemSection>
      <RowBetween padding="0 4px">
        <Text color="#1a2430" fontWeight={600} fontSize={14}>
          Liquidity analytics
        </Text>
        <Question text="On W Chain mainnet, USD values and 24h volume come from the W Oracle (oracle.w-chain.com). Fee estimates assume 0.30% of 24h volume × your pool share. Fees stay in the pool until you remove liquidity." />
      </RowBetween>

      <StatGrid>
        <StatCard>
          <StatLabel>Your positions (est.)</StatLabel>
          <StatValue>{loading ? '…' : formatUsd(totalPositionValueUsd)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Active pools</StatLabel>
          <StatValue>{positionCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Combined pool TVL (est.)</StatLabel>
          <StatValue>{loading ? '…' : formatUsd(totalPoolTvlUsd)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>24h volume (indexed pools)</StatLabel>
          <StatValue>{loading ? '…' : oracleSupported ? formatUsd(totalVol24h) : '—'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Est. your 24h fees</StatLabel>
          <StatValue>{loading ? '…' : oracleSupported ? formatUsd(totalFeesUsd24h) : '—'}</StatValue>
        </StatCard>
      </StatGrid>

      <Note>
        {oracleSupported ? (
          <>
            Pricing & volume from{' '}
            <a href="https://docs.w-chain.com/advanced-features/w-swap-lp-price-api" target="_blank" rel="noopener noreferrer">
              W Oracle
            </a>{' '}
            for {oraclePositionCount} of {positionCount} pool(s). Other pairs use on-chain estimates.
          </>
        ) : (
          <>Connect on W Chain mainnet to use W Oracle analytics for supported pairs (USDT/WCO, USDC/WCO, etc.).</>
        )}
      </Note>
    </EcosystemSection>
  )
}
