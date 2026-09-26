import React from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import FullPositionCard from '../../components/PositionCard'
import Question from '../../components/QuestionHelper'
import LiquidityOverview from '../../components/LiquidityAnalytics/LiquidityOverview'
import {
  PortfolioActivity,
  PortfolioImportHint,
  PortfolioMarketPrices,
  PortfolioQuickActions,
  PortfolioTokenBalances,
  PortfolioWalletSummary
} from '../../components/Portfolio/PortfolioSections'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween } from '../../components/Row'
import { EcosystemMessageCard, EcosystemSection } from '../../components/ecosystem/styled'
import { useUserLiquidityPairs } from '../../hooks/useUserLiquidityPairs'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { EcosystemPrimaryButton } from '../../components/ecosystem/styled'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'

export default function Portfolio() {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { pairs, isLoading } = useUserLiquidityPairs()

  return (
    <AppBody card>
      <SwapPoolTabs active="portfolio" />
      <AutoColumn gap="lg">
        <RowBetween padding="0 4px">
          <Text color="#1a2430" fontWeight={700} fontSize={20}>
            Portfolio
          </Text>
          <Question text="Your W-Swap portfolio: wallet balances, liquidity positions, oracle analytics, and recent transactions from this browser." />
        </RowBetween>

        <PortfolioQuickActions />

        {!account ? (
          <EcosystemPrimaryButton onClick={toggleWalletModal}>Connect Wallet</EcosystemPrimaryButton>
        ) : (
          <>
            <PortfolioWalletSummary pairs={pairs} />
            <PortfolioMarketPrices />
            {pairs.length > 0 && !isLoading ? <LiquidityOverview pairs={pairs} /> : null}
            <PortfolioTokenBalances />
          </>
        )}

        <EcosystemSection>
          <RowBetween padding="0 4px">
            <Text color="#1a2430" fontWeight={600} fontSize={14}>
              Liquidity positions
            </Text>
            <Question text="Pool tokens represent your share of each pair. Expand a row for oracle volume, fees, and add/remove actions." />
          </RowBetween>

          {!account ? (
            <EcosystemMessageCard>Connect to view liquidity positions.</EcosystemMessageCard>
          ) : isLoading ? (
            <EcosystemMessageCard>
              <Dots style={{ color: '#5c6a78', fontWeight: 500 }}>Loading</Dots>
            </EcosystemMessageCard>
          ) : pairs.length > 0 ? (
            pairs.map(pair => <FullPositionCard key={pair.liquidityToken.address} pair={pair} />)
          ) : (
            <EcosystemMessageCard>
              No liquidity positions yet.{' '}
              <Link to="/add/ETH" style={{ color: '#0e9a86', fontWeight: 600 }}>
                Add liquidity
              </Link>
            </EcosystemMessageCard>
          )}

          <PortfolioImportHint />
        </EcosystemSection>

        {account ? <PortfolioActivity /> : null}
      </AutoColumn>
    </AppBody>
  )
}
