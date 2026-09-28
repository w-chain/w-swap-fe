import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  getLandingWidgetTab,
  LandingWidgetTab,
  landingSearchForTab,
  resolveLandingWidgetTab
} from '../../utils/landingWidgetTab'
import { WAVE_FARM_URL } from '../../constants/ecosystemLinks'
import { Footer } from '../../components/Footer'
import AppBody from '../AppBody'
import Swap from '../Swap'
import Pool from '../Pool'
import Bridge from '../Bridge'

const STATS = [
  { value: '240K+', label: 'Completed Txns' },
  { value: '5K+', label: 'Active Wallets' },
  { value: '<2s', label: 'Finality' }
]

const COST_COMPARISON = [
  { title: 'W-SWAP DEX', gas: '~$0.0002', lpFee: '0.3% to liquidity providers', confirmation: '<2 sec' },
  { title: 'Ethereum DEXes', gas: '~$5-$20', lpFee: '0.05%-1% by pool', confirmation: '~6 min' },
  { title: 'Solana DEXes', gas: '~$0.001', lpFee: '~0.25%', confirmation: 'Seconds' },
  { title: 'Polygon DEXes', gas: '~$0.02-$0.15', lpFee: '0.3% typical', confirmation: '~1-2 min' }
]

const FEATURES = [
  {
    title: 'Unified Liquidity',
    body:
      'Aggregated pools across the W Chain ecosystem deliver the best price on every swap, with zero fragmentation.'
  },
  {
    title: 'Sub-Second Routing',
    body: 'Smart routing engine finds optimal paths in milliseconds — settle your trade in under 75 seconds.'
  },
  {
    title: 'Multi-Validator Bridge',
    body:
      'Move assets natively from Ethereum, BNB Chain, Polygon and beyond into W-SWAP DEX with audited security.'
  },
  {
    title: 'Audited & Non-Custodial',
    body:
      'Independently audited smart contracts. Your keys, your tokens — always. No custodian, no intermediaries.'
  }
]

const STEPS = [
  { title: 'Connect Wallet', body: 'MetaMask, WalletConnect, Trust Wallet - one click.' },
  { title: 'Confirm & Trade', body: 'Smart router finds best price across pools.' },
  { title: 'Choose Tokens', body: 'Settles in ~75 sec with near-zero fees.' }
]

const COMPARISON_INTRO =
  'W-SWAP DEX is an AMM DEX: you trade against liquidity pools, LPs earn 0.3% on every swap, and the trade settles on W Chain. Compare the numbers a trader feels — gas to execute the swap, the pool fee, and how fast the trade confirms.'

export default function Landing() {
  const history = useHistory()
  const { search } = useLocation()
  const [widgetTab, setWidgetTab] = useState<LandingWidgetTab>(() => resolveLandingWidgetTab(search))

  useEffect(() => {
    setWidgetTab(resolveLandingWidgetTab(search))
  }, [search])

  useEffect(() => {
    const tab = getLandingWidgetTab(search)
    if (tab === 'swap' || tab === 'bridge') {
      document.getElementById('swap-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [search])

  const selectWidgetTab = useCallback(
    (tab: LandingWidgetTab) => {
      setWidgetTab(tab)
      history.replace({ pathname: '/', search: landingSearchForTab(tab, search) })
    },
    [history, search]
  )

  const scrollToSwapWidget = useCallback(() => {
    selectWidgetTab('swap')
    window.requestAnimationFrame(() => {
      document.getElementById('swap-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [selectWidgetTab])

  return (
    <>
      <BodyWrapper>
        <HeroSection>
          <HeroInner>
            <HeroCopy>
              <PillBadge>
                <BadgeDot />
                W-SWAP DEX
              </PillBadge>
              <HeroTitle>
                <span>Seamless Swaps,</span>
                <span>Unified Liquidity</span>
              </HeroTitle>
              <HeroStats>
                {STATS.map(item => (
                  <HeroStat key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </HeroStat>
                ))}
              </HeroStats>
            </HeroCopy>

            <WidgetColumn id="swap-widget" $wide={widgetTab === 'bridge' || widgetTab === 'pool'}>
              <AppBody plain>
                <TradingCard $compact={widgetTab !== 'pool'}>
                  <LandingTabs>
                    <TabPill active={widgetTab === 'swap'} type="button" onClick={() => selectWidgetTab('swap')}>
                      swap
                    </TabPill>
                    <TabPill active={widgetTab === 'pool'} type="button" onClick={() => selectWidgetTab('pool')}>
                      pool
                    </TabPill>
                    <TabPill active={widgetTab === 'bridge'} type="button" onClick={() => selectWidgetTab('bridge')}>
                      bridge
                    </TabPill>
                  </LandingTabs>
                  <LandingWidgetScroll $tall={widgetTab === 'pool'}>
                    {widgetTab === 'swap' && <Swap embedded />}
                    {widgetTab === 'pool' && <Pool embedded />}
                    {widgetTab === 'bridge' && <Bridge embedded />}
                  </LandingWidgetScroll>
                </TradingCard>
              </AppBody>
            </WidgetColumn>
          </HeroInner>
        </HeroSection>

        <SurfaceBand>
          <ContentSection>
            <SectionTitle>What a swap actually costs</SectionTitle>
            <SectionSubTitle>{COMPARISON_INTRO}</SectionSubTitle>
          <ComparisonGrid>
            {COST_COMPARISON.map(item => (
              <ComparisonCard key={item.title} $highlight={item.title === 'W-SWAP DEX'}>
                <h4>{item.title}</h4>
                <label>Typical swap gas</label>
                <ValueText>{item.gas}</ValueText>
                <label>LP trading fee</label>
                <ValueText>{item.lpFee}</ValueText>
                <label>Trade confirmation</label>
                <ValueText>{item.confirmation}</ValueText>
              </ComparisonCard>
            ))}
          </ComparisonGrid>
          </ContentSection>
        </SurfaceBand>

        <ContentSection style={{ marginTop: '56px', marginBottom: '56px' }}>
          <SectionTitle>
            A DEX engineered for
            <br />
            payments-grade performance
          </SectionTitle>
          <FeatureGrid>
            {FEATURES.map(item => (
              <FeatureCard key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ContentSection>

        <StepsBand>
          <ContentSection>
            <SectionTitle>Swap in three steps</SectionTitle>
            <StepGrid>
              {STEPS.map(item => (
                <StepCard key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </StepCard>
              ))}
            </StepGrid>
          </ContentSection>
        </StepsBand>

        <CtaSection>
          <CtaCard>
            <SectionTitle>Start trading on W-SWAP DEX</SectionTitle>
            <SectionSubTitle>
              Join thousands of traders moving value at the speed of payments - not the speed of blocks.
            </SectionSubTitle>
            <CtaActions>
              <CtaPrimary type="button" onClick={scrollToSwapWidget}>
                Start swapping →
              </CtaPrimary>
              <CtaOutline href={WAVE_FARM_URL} target="_blank" rel="noopener noreferrer">
                Farm →
              </CtaOutline>
            </CtaActions>
          </CtaCard>
        </CtaSection>
      </BodyWrapper>

      <Footer />
    </>
  )
}

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 12px 16px;
  `};

  z-index: 1;
`

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 4px 0 28px;

  @media (min-width: 768px) {
    padding: 16px 12px 40px;
  }

  @media (min-width: 1024px) {
    padding: 24px 20px 48px;
  }
`

const HeroInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: min(1240px, 100%);
  margin: 0 auto;

  @media (min-width: 768px) {
    gap: 36px;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
    padding: 0 24px;
  }
`

const HeroCopy = styled.div`
  width: 100%;
  max-width: 599px;

  @media (min-width: 1024px) {
    margin-top: 40px;
  }
`

const PillBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 9999px;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5c6a78;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    gap: 8px;
    height: 28px;
    padding: 0 14px;
    font-size: 12px;
    letter-spacing: 0.12em;
    margin-bottom: 24px;
  }
`

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(90deg, #12b39c, #3b82f6);
  flex-shrink: 0;
`

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.65rem, 7.5vw, 2.15rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #1a2430;

  span {
    display: block;
  }

  @media (min-width: 768px) {
    font-size: clamp(2rem, 5vw, 3.25rem);
  }

  @media (min-width: 1024px) {
    font-size: clamp(2.25rem, 5vw, 4.5rem);
  }
`

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 0;
  margin-top: 16px;
  width: 100%;
  padding: 10px 4px;
  border-radius: 12px;
  border: 1px solid #e4ddd2;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.8) inset;

  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 32px 48px;
    margin-top: 48px;
    width: auto;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  @media (min-width: 1024px) {
    margin-top: 100px;
  }
`

const HeroStat = styled.div`
  text-align: center;
  padding: 0 4px;
  min-width: 0;

  &:not(:last-child) {
    border-right: 1px solid #e8e2d8;
  }

  strong {
    display: block;
    font-size: clamp(1rem, 4.2vw, 1.25rem);
    font-weight: 700;
    color: #1a2430;
    line-height: 1.2;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 9px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0.02em;
    color: #5c6a78;
  }

  @media (min-width: 768px) {
    text-align: left;
    padding: 0;

    &:not(:last-child) {
      border-right: none;
    }

    strong {
      font-size: 28px;
      white-space: normal;
    }

    span {
      margin-top: 4px;
      font-size: 14px;
    }
  }
`

const WidgetColumn = styled.div<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? 'min(640px, 100%)' : 'min(500px, 100%)')};
  flex-shrink: 0;
  scroll-margin-top: 120px;

  @media (min-width: 1024px) {
    margin-left: auto;
    scroll-margin-top: 96px;
  }
`

const TradingCard = styled.div<{ $compact?: boolean }>`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  padding: ${({ $compact }) => ($compact ? '20px 16px 28px' : '20px 16px 36px')};
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.18);

  @media (min-width: 768px) {
    padding: ${({ $compact }) => ($compact ? '28px 28px 36px' : '35px 35px 50px')};
  }
`

const LandingWidgetScroll = styled.div<{ $tall?: boolean }>`
  max-height: ${({ $tall }) => ($tall ? 'min(70vh, 720px)' : 'none')};
  overflow-y: ${({ $tall }) => ($tall ? 'auto' : 'visible')};
  overflow-x: hidden;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $tall }) => ($tall ? '0 2px 8px 0' : '0')};
`

const LandingTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-bottom: 24px;
  }
`

const TabPill = styled.button<{ active?: boolean }>`
  min-width: 88px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  touch-action: manipulation;
  ${({ active }) =>
    active
      ? `
    border: 1px solid transparent;
    background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #12b39c, #2f6fed);
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #0e9a86;
  `
      : `
    border: 1px solid #e4ddd2;
    background: #fff;
    color: #5c6a78;
  `}
`

const SurfaceBand = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 40px 0 48px;

  @media (min-width: 768px) {
    padding: 56px 0 72px;
  }
`

const StepsBand = styled.div`
  width: 100%;
  background: #f6f3ec;
  padding: 40px 0 48px;

  @media (min-width: 768px) {
    padding: 56px 0 72px;
  }
`

const ContentSection = styled.section`
  width: min(1100px, calc(100% - 32px));
  margin: 0 auto;
`

const SectionTitle = styled.h2`
  color: #1a2430;
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin: 0;
  line-height: 1.15;
`

const SectionSubTitle = styled.p`
  color: #85919a;
  text-align: center;
  margin: 16px auto 0;
  max-width: 760px;
  line-height: 1.6;
  font-size: 14px;
`

const ComparisonGrid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ComparisonCard = styled.div<{ $highlight?: boolean }>`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;

  @media (min-width: 768px) {
    padding: 24px;
    min-height: 320px;
  }
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.12);
  ${({ $highlight }) => $highlight && 'box-shadow: 0 0 0 1px rgba(14, 154, 134, 0.3);'}

  h4 {
    margin: 0 0 8px;
    color: #1a2430;
    font-size: 1.125rem;
    font-weight: 600;
  }

  label {
    color: #1a2430;
    font-size: 0.875rem;
    font-weight: 500;
  }
`

const ValueText = styled.span`
  color: #85919a;
  font-size: 0.875rem;
  font-weight: 400;
  margin-bottom: 8px;
`

const FeatureGrid = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 40px;
  max-width: 808px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  padding: 28px;
  min-height: 192px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.12);

  h4 {
    margin: 0;
    color: #1a2430;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 8px 0 0;
    color: #5c6a78;
    line-height: 1.6;
    font-size: 0.875rem;
  }
`

const StepGrid = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  text-align: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const StepCard = styled.div`
  h4 {
    margin: 0;
    color: #1a2430;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 14px auto 0;
    max-width: 200px;
    color: #9ca3af;
    line-height: 1.5;
    font-size: 0.875rem;
  }
`

const CtaSection = styled.section`
  width: 100%;
  padding: 56px 20px 80px;
`

const CtaCard = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 64px 24px;
  border-radius: 16px;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
`

const ctaButtonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 176px;
  height: 40px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  touch-action: manipulation;
`

const CtaPrimary = styled.button`
  ${ctaButtonBase}
  color: #fff;
  background: linear-gradient(90deg, #2f6fed, #1e4fd8);
  border: none;

  &:hover {
    opacity: 0.92;
  }
`

const CtaOutline = styled.a`
  ${ctaButtonBase}
  color: #1a2430;
  border: 1px solid #cfc6b8;
  background: transparent;

  &:hover {
    transform: translateY(-2px);
    border-color: #0e9a86;
  }
`

