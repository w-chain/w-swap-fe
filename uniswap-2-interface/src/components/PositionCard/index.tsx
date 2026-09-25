import { JSBI, Pair, Percent } from '@uniswap/sdk'
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
import { formatUsd } from '../../utils/formatUsd'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 13px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 8px 24px -20px rgba(26, 36, 48, 0.15);
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
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

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
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

  const poolTokenPercentage = poolShare

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            <Text fontWeight={600} fontSize={16} color={'#1a2430'}>
              {!currency0 || !currency1 ? (
                <Dots style={{ color: '#5c6a78', fontWeight: 500 }}>Loading</Dots>
              ) : (
                `${getCurrencySymbol(currency0, chainId)}/${getCurrencySymbol(currency1, chainId)}`
              )}
            </Text>
          </RowFixed>
          <RowFixed>
            <AutoColumn gap="2px" style={{ alignItems: 'flex-end' }}>
              <Text fontWeight={700} fontSize={14} color="#1a2430">
                {formatUsd(positionValueUsd)}
              </Text>
              <Text fontWeight={500} fontSize={12} color="#5c6a78">
                {poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}% pool` : '—'}
              </Text>
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
              <Text fontSize={14} fontWeight={600} color="#5c6a78">
                Est. position value
              </Text>
              <Text fontSize={14} fontWeight={700} color="#1a2430">
                {formatUsd(positionValueUsd)}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={600} color="#5c6a78">
                Pool TVL {valueSource === 'oracle' ? '(oracle)' : '(est.)'}
              </Text>
              <Text fontSize={14} fontWeight={600} color="#1a2430">
                {formatUsd(poolTvlUsd)}
              </Text>
            </FixedHeightRow>
            {oracle && !oracle.loading && !oracle.error ? (
              <>
                <FixedHeightRow>
                  <Text fontSize={14} fontWeight={600} color="#5c6a78">
                    24h volume
                  </Text>
                  <Text fontSize={14} fontWeight={600} color="#1a2430">
                    {formatUsd(vol24h)}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={14} fontWeight={600} color="#5c6a78">
                    Est. your 24h fees
                  </Text>
                  <Text fontSize={14} fontWeight={600} color="#1a2430">
                    {formatUsd(feesUsd24h)}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={14} fontWeight={600} color="#5c6a78">
                    LP token price
                  </Text>
                  <Text fontSize={14} fontWeight={600} color="#1a2430">
                    {lpPriceInUsd ? formatUsd(lpPriceInUsd) : '—'}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={14} fontWeight={600} color="#5c6a78">
                    Oracle rate ({oraclePairName})
                  </Text>
                  <Text fontSize={14} fontWeight={600} color="#1a2430">
                    {latestOraclePrice ? latestOraclePrice.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}
                  </Text>
                </FixedHeightRow>
              </>
            ) : null}
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={600} color="#5c6a78">
                Rate (on-chain)
              </Text>
              <Text fontSize={14} fontWeight={600} color="#1a2430">
                {price
                  ? `1 ${getCurrencySymbol(currency0, chainId)} = ${price.toSignificant(4)} ${getCurrencySymbol(
                      currency1,
                      chainId
                    )}`
                  : '—'}
              </Text>
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
            <RowBetween marginTop="10px">
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
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
