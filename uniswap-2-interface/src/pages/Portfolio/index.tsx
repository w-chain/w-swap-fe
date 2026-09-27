import React from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
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
import {
  PortfolioConnectHero,
  PortfolioMainColumn,
  PortfolioMainGrid,
  PortfolioPageHeader,
  PortfolioPageShell,
  PortfolioPageSubtitle,
  PortfolioPageTitle,
  PortfolioSectionHeading,
  PortfolioSectionTitle,
  PortfolioSideColumn,
  PortfolioStack,
  PortfolioTitleBlock
} from '../../components/Portfolio/PortfolioPageShell'
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
    <AppBody plain>
      <PortfolioPageShell>
        <PortfolioPageHeader>
          <PortfolioTitleBlock>
            <PortfolioPageTitle>Portfolio</PortfolioPageTitle>
            <PortfolioPageSubtitle>
              Liquidity, balances, and estimated P/L
              <br />
              across W-Swap — independent of the swap widget.
            </PortfolioPageSubtitle>
          </PortfolioTitleBlock>
          {account ? <PortfolioQuickActions /> : null}
        </PortfolioPageHeader>

        {!account ? (
          <PortfolioConnectHero>
            <Text fontSize={15} fontWeight={500} color="#5c6a78" maxWidth="420px" lineHeight="1.5">
              Connect your wallet to view LP positions (including Wave Farm stakes), token balances, and 24h P/L
              snapshots saved in this browser.
            </Text>
            <EcosystemPrimaryButton style={{ maxWidth: 280 }} onClick={toggleWalletModal}>
              Connect wallet
            </EcosystemPrimaryButton>
          </PortfolioConnectHero>
        ) : (
          <PortfolioStack>
            <PortfolioWalletSummary pairs={pairs} />
            {pairs.length > 0 && !isLoading ? <LiquidityOverview pairs={pairs} showPnl /> : null}

            <PortfolioMainGrid>
              <PortfolioMainColumn>
                <EcosystemSection>
                  <PortfolioSectionHeading>
                    <PortfolioSectionTitle>
                      Liquidity positions
                      {pairs.length > 0 ? (
                        <Text as="span" fontSize={14} fontWeight={600} color="#5c6a78" ml="8px">
                          ({pairs.length})
                        </Text>
                      ) : null}
                    </PortfolioSectionTitle>
                    <Question text="Pool tokens represent your share of each pair. Expand a row for oracle volume, fees, and add/remove actions." />
                  </PortfolioSectionHeading>

                  {isLoading ? (
                    <EcosystemMessageCard>
                      <Dots style={{ color: '#5c6a78', fontWeight: 500 }}>Loading</Dots>
                    </EcosystemMessageCard>
                  ) : pairs.length > 0 ? (
                    pairs.map(pair => <FullPositionCard key={pair.liquidityToken.address} pair={pair} showPnl />)
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
              </PortfolioMainColumn>

              <PortfolioSideColumn>
                <PortfolioMarketPrices />
                <PortfolioTokenBalances />
                <PortfolioActivity />
              </PortfolioSideColumn>
            </PortfolioMainGrid>
          </PortfolioStack>
        )}
      </PortfolioPageShell>
    </AppBody>
  )
}
