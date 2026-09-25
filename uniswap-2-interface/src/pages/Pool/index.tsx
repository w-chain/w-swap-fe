import React, { useMemo } from 'react'
import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { Text } from 'rebass'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { EcosystemPrimaryButton, EcosystemSection, EcosystemMessageCard } from '../../components/ecosystem/styled'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import LiquidityOverview from '../../components/LiquidityAnalytics/LiquidityOverview'

export default function Pool() {
  const { account } = useActiveWeb3React()

  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <AppBody card>
        <SwapPoolTabs active={'pool'} />
        <AutoColumn gap="lg" justify="center">
          <EcosystemPrimaryButton id="join-pool-button" as={Link} to="/add/ETH">
            Add Liquidity
          </EcosystemPrimaryButton>

          {account && allV2PairsWithLiquidity.length > 0 && !v2IsLoading ? (
            <LiquidityOverview pairs={allV2PairsWithLiquidity} />
          ) : null}

          <EcosystemSection>
            <RowBetween padding={'0 4px'}>
              <Text color="#1a2430" fontWeight={600} fontSize={14}>
                Your Liquidity
              </Text>
              <Question text="When you add liquidity, you are given pool tokens that represent your share. If you don't see a pool you joined in this list, try importing a pool below." />
            </RowBetween>

            {!account ? (
              <EcosystemMessageCard>Connect to a wallet to view your liquidity.</EcosystemMessageCard>
            ) : v2IsLoading ? (
              <EcosystemMessageCard>
                <Dots style={{ color: '#5c6a78', fontWeight: 500 }}>Loading</Dots>
              </EcosystemMessageCard>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
              <EcosystemMessageCard>No liquidity found.</EcosystemMessageCard>
            )}

            <Text textAlign="center" fontSize={14} fontWeight={500} color="#5c6a78" style={{ padding: '.25rem 0' }}>
              {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
              <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                {hasV1Liquidity ? 'Migrate now.' : 'Import it.'}
              </StyledInternalLink>
            </Text>
          </EcosystemSection>
        </AutoColumn>
      </AppBody>
    </>
  )
}
