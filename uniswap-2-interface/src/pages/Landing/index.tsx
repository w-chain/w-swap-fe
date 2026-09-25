import { CurrencyAmount, Token } from '@uniswap/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonPrimaryGradient } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Row'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import { useHistory } from 'react-router-dom'

import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager } from '../../state/user/hooks'
import { LinkStyledButton } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody from '../AppBody'
import { Footer } from '../../components/Footer'
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
  const theme = useContext(ThemeContext)

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies
  } = useDerivedSwapInfo()
  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const toggledVersion = useToggledVersion()
  const trade = showWrap
    ? undefined
    : {
        [Version.v1]: v1Trade,
        [Version.v2]: v2Trade
      }[toggledVersion]

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const history = useHistory()

  const handleNavigateToSwap = useCallback(() => {
    history.push('/swap')
  }, [history])

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

            <WidgetColumn id="swap-widget">
              <AppBody plain>
                <TradingCard>
                  <LandingTabs>
                    <TabPill active type="button">
                      swap
                    </TabPill>
                    <TabPill type="button" onClick={() => history.push('/pool')}>
                      pool
                    </TabPill>
                    <TabPill type="button" onClick={() => history.push('/bridge')}>
                      bridge
                    </TabPill>
                  </LandingTabs>
                  <Wrapper id="swap-page">
                    <AutoColumn gap={'sm'}>
                      <CurrencyInputPanel
                label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                variant="light"
              />
                      <AutoColumn justify="space-between">
                        <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '4px 0' }}>
                          <FlipButton
                            type="button"
                            aria-label="Flip tokens"
                            onClick={() => {
                              setApprovalSubmitted(false)
                              onSwitchTokens()
                            }}
                          >
                            ⇄
                          </FlipButton>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To'}
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
                variant="light"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.text2} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

                      {showWrap ? null : (
                        <PriceRow>
                          <Text fontWeight={400} fontSize={14} color="#1a2430">
                            Price
                          </Text>
                          <TradePrice
                            price={trade?.executionPrice}
                            showInverted={false}
                            setShowInverted={() => undefined}
                          />
                        </PriceRow>
                      )}
                    </AutoColumn>
                    <BottomGrouping>
                      <LaunchButton onClick={handleNavigateToSwap}>
                        Get Started <span aria-hidden>→</span>
                      </LaunchButton>
                    </BottomGrouping>
                  </Wrapper>
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
              <CtaPrimary href="#swap-widget">Launch W-SWAP DEX →</CtaPrimary>
              <CtaOutline href="https://docs.w-chain.com/" target="_blank" rel="noopener noreferrer">
                Read the docs →
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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 24px 20px 48px;
`

const HeroInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: min(1240px, 100%);
  margin: 0 auto;

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
  gap: 8px;
  height: 28px;
  padding: 0 14px;
  border-radius: 9999px;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5c6a78;
  margin-bottom: 24px;
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
  font-size: clamp(2.25rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #1a2430;

  span {
    display: block;
  }
`

const HeroStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px 48px;
  margin-top: 48px;

  @media (min-width: 1024px) {
    margin-top: 100px;
  }
`

const HeroStat = styled.div`
  strong {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #1a2430;
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 14px;
    color: #5c6a78;
  }
`

const WidgetColumn = styled.div`
  width: 100%;
  max-width: 500px;
  flex-shrink: 0;
  scroll-margin-top: 96px;

  @media (min-width: 1024px) {
    margin-left: auto;
  }
`

const TradingCard = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  padding: 35px 35px 50px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.18);
`

const LandingTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`

const TabPill = styled.button<{ active?: boolean }>`
  width: 80px;
  height: 24px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;
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

const FlipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: #22d3ee;
    color: #1a2430;
  }
`

const PriceRow = styled(RowBetween)`
  margin-top: 28px;
  padding: 0 4px;
`

const LaunchButton = styled(ButtonPrimaryGradient)`
  width: 100%;
  min-height: 42px;
  border-radius: 5px;
  font-size: 14px;
`

const SurfaceBand = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 56px 0 72px;
`

const StepsBand = styled.div`
  width: 100%;
  background: #f6f3ec;
  padding: 56px 0 72px;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 320px;
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
`

const CtaPrimary = styled.a`
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
