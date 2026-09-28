import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { WAVE_FARM_URL } from '../../constants/ecosystemLinks'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonSecondary } from '../Button'

import Card, { GreyCard, PurpleCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'
import { getCurrencySymbol } from '../../utils/getNativeTokenSymbol'
import { getPoolLink } from '../../utils'
import { useLiquidityPositionAnalytics } from '../../hooks/useLiquidityPositionAnalytics'
import { usePositionPnlPercent } from '../../hooks/usePortfolioTotalPnl'
import { formatUsd } from '../../utils/formatUsd'
import PnlPercentBadge from '../Portfolio/PnlPercentBadge'
import Question from '../QuestionHelper'
import { useUserTotalLpBalance } from '../../hooks/useWaveFarmStakedLp'

export const FixedHeightRow = styled(RowBetween)`
  min-height: 28px;
  height: auto;
  width: 100%;
  min-width: 0;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px 10px;
  row-gap: 8px;

  & > * {
    min-width: 0;
  }
`

const MetricLabel = styled(Text)`
  flex: 1 1 140px;
  min-width: 0;
  padding-right: 8px;
  line-height: 1.35;
`

const MetricValue = styled(Text)`
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  text-align: right;
  line-height: 1.35;
  overflow-wrap: anywhere;
`

export const HoverCard = styled(Card)`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 14px 12px;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 8px 24px -20px rgba(26, 36, 48, 0.15);

  @media (min-width: 480px) {
    padding: 14px;
  }
`

const PairTitleBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 1 160px;
  min-width: 0;
`

const FarmStakedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #043f84;
  background: rgba(14, 154, 134, 0.12);
  border: 1px solid rgba(14, 154, 134, 0.35);
  vertical-align: middle;
`

const FARM_UNSTAKE_HINT =
  'Part or all of this LP is staked on Wave Farm. Unstake on Wave Farm first, then return here to remove liquidity.'

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  /** Show ~24h P/L % (portfolio page; uses local value history). */
  showPnl?: boolean
  /** Embedded pool tab: open in-widget add liquidity instead of /add route. */
  onAddToPool?: (currencyIdA: string, currencyIdB: string) => void
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <PurpleCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={600} fontSize={14} color={'#043F84'}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={30} />
                <Text fontWeight={600} fontSize={16} color={'#043F84'}>
                  {getCurrencySymbol(currency0, chainId)}/{getCurrencySymbol(currency1, chainId)}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={600} fontSize={16} color={'#043F84'}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#585858" fontSize={14} fontWeight={600}>
                  {getCurrencySymbol(currency0, chainId)}
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text color="#585858" fontSize={14} fontWeight={600} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#585858" fontSize={14} fontWeight={600}>
                  {getCurrencySymbol(currency1, chainId)}
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text color="#585858" fontSize={14} fontWeight={600} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </PurpleCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border, showPnl, onAddToPool }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const walletPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const { total: userPoolBalance, farmStaked, wallet: walletOnlyBalance } = useUserTotalLpBalance(
    pair.liquidityToken,
    walletPoolBalance
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const farmStakedActive = farmStaked !== undefined && JSBI.greaterThan(farmStaked.raw, JSBI.BigInt(0))
  const walletLpAvailable =
    walletOnlyBalance !== undefined && JSBI.greaterThan(walletOnlyBalance.raw, JSBI.BigInt(0))
  const {
    poolShare,
    poolTvlUsd,
    positionValueUsd,
    token0Deposited,
    token1Deposited,
    price,
    valueSource,
    vol24h,
    feesUsd24h,
    lpPriceInUsd,
    oraclePairName,
    latestOraclePrice,
    oracle
  } = useLiquidityPositionAnalytics(pair)
  const { percent: pnlPercent } = usePositionPnlPercent(pair, showPnl ? positionValueUsd : undefined)

  const poolTokenPercentage = poolShare

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer', alignItems: 'center' }}>
          <PairTitleBlock>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            <Text fontWeight={600} fontSize={15} color={'#1a2430'} style={{ lineHeight: 1.35, overflowWrap: 'anywhere' }}>
              {!currency0 || !currency1 ? (
                <Dots style={{ color: '#5c6a78', fontWeight: 500 }}>Loading</Dots>
              ) : (
                <>
                  {`${getCurrencySymbol(currency0, chainId)}/${getCurrencySymbol(currency1, chainId)}`}
                  {farmStakedActive ? (
                    <FarmStakedTag>
                      Staked on Farm
                      <Question text={FARM_UNSTAKE_HINT} />
                    </FarmStakedTag>
                  ) : null}
                </>
              )}
            </Text>
          </PairTitleBlock>
          <RowFixed style={{ flexShrink: 0, marginLeft: 'auto' }}>
            <AutoColumn gap="2px" style={{ alignItems: 'flex-end' }}>
              <Text fontWeight={700} fontSize={14} color="#1a2430">
                {formatUsd(positionValueUsd)}
              </Text>
              <Text fontWeight={500} fontSize={12} color="#5c6a78">
                {poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}% pool` : '—'}
              </Text>
              {showPnl ? <PnlPercentBadge percent={pnlPercent} suffix=" (24h)" /> : null}
            </AutoColumn>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} strokeWidth={2} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} strokeWidth={2} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                Est. position value
              </MetricLabel>
              <MetricValue as="span" fontSize={14} fontWeight={700} color="#1a2430">
                {formatUsd(positionValueUsd)}
              </MetricValue>
            </FixedHeightRow>
            {showPnl ? (
              <FixedHeightRow>
                <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                  P/L (24h est.)
                </MetricLabel>
                <PnlPercentBadge percent={pnlPercent} suffix="" />
              </FixedHeightRow>
            ) : null}
            <FixedHeightRow>
              <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                Pool TVL {valueSource === 'oracle' ? '(oracle)' : '(est.)'}
              </MetricLabel>
              <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                {formatUsd(poolTvlUsd)}
              </MetricValue>
            </FixedHeightRow>
            {oracle && !oracle.loading && !oracle.error ? (
              <>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    24h volume
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {formatUsd(vol24h)}
                  </MetricValue>
                </FixedHeightRow>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    Est. your 24h fees
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {formatUsd(feesUsd24h)}
                  </MetricValue>
                </FixedHeightRow>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    LP token price
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {lpPriceInUsd ? formatUsd(lpPriceInUsd) : '—'}
                  </MetricValue>
                </FixedHeightRow>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    Oracle rate ({oraclePairName})
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {latestOraclePrice ? latestOraclePrice.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}
                  </MetricValue>
                </FixedHeightRow>
              </>
            ) : null}
            <FixedHeightRow>
              <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                Rate (on-chain)
              </MetricLabel>
              <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                {price
                  ? `1 ${getCurrencySymbol(currency0, chainId)} = ${price.toSignificant(4)} ${getCurrencySymbol(
                      currency1,
                      chainId
                    )}`
                  : '—'}
              </MetricValue>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {getCurrencySymbol(currency0, chainId)}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {getCurrencySymbol(currency1, chainId)}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            {farmStakedActive ? (
              <>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    Staked on Wave Farm
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {farmStaked?.toSignificant(4) ?? '—'} LP
                  </MetricValue>
                </FixedHeightRow>
                <FixedHeightRow>
                  <MetricLabel as="span" fontSize={14} fontWeight={600} color="#5c6a78">
                    In wallet
                  </MetricLabel>
                  <MetricValue as="span" fontSize={14} fontWeight={600} color="#1a2430">
                    {walletOnlyBalance ? walletOnlyBalance.toSignificant(4) : '0'} LP
                  </MetricValue>
                </FixedHeightRow>
              </>
            ) : null}
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your pool tokens:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>
            <AutoRow justify="center" marginTop={'10px'}>
              <ExternalLink href={getPoolLink(chainId, pair.liquidityToken.address)}>
                View pool information ↗
              </ExternalLink>
            </AutoRow>
            {farmStakedActive ? (
              <AutoColumn gap="8px" marginTop="10px">
                <Text fontSize={13} color="#5c6a78" lineHeight="1.45">
                  {walletLpAvailable
                    ? 'LP staked on Wave Farm must be unstaked there before you can remove that portion here.'
                    : 'All of this LP is on Wave Farm. Unstake on '}
                  {!walletLpAvailable ? (
                    <>
                      <ExternalLink href={WAVE_FARM_URL}>Wave Farm</ExternalLink> before removing liquidity here.
                    </>
                  ) : (
                    <>
                      {' '}
                      <ExternalLink href={WAVE_FARM_URL}>Open Wave Farm</ExternalLink>
                    </>
                  )}
                </Text>
              </AutoColumn>
            ) : null}
            <RowBetween marginTop="10px">
              {onAddToPool ? (
                <ButtonSecondary
                  type="button"
                  onClick={() => onAddToPool(currencyId(currency0), currencyId(currency1))}
                  width="48%"
                  style={{
                    background: 'rgba(4, 63, 132, 0.2)'
                  }}
                >
                  Add
                </ButtonSecondary>
              ) : (
                <ButtonSecondary
                  as={Link}
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                  width="48%"
                  style={{
                    background: 'rgba(4, 63, 132, 0.2)'
                  }}
                >
                  Add
                </ButtonSecondary>
              )}
              {farmStakedActive && !walletLpAvailable ? (
                <ButtonSecondary
                  as="a"
                  href={WAVE_FARM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  width="48%"
                  style={{
                    background: 'rgba(4, 63, 132, 0.2)'
                  }}
                >
                  Unstake on Farm
                </ButtonSecondary>
              ) : (
                <ButtonSecondary
                  as={Link}
                  width="48%"
                  to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                  style={{
                    background: 'rgba(4, 63, 132, 0.2)'
                  }}
                >
                  Remove
                </ButtonSecondary>
              )}
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
