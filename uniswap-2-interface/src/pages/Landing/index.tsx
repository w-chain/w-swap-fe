import { CurrencyAmount, Token } from '@uniswap/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonPrimaryDark } from '../../components/Button'
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
import FishIcon from '../../assets/svg/fish-icon.svg'
import ConnectWithUs from '../../components/connectWithUs/ConnectWithUs'
import { Footer } from '../../components/Footer'
import ReviewCards from '../../components/ReviewCards/ReviewCards'

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
    body: 'Aggregated pools across the W Chain ecosystem deliver the best price on every swap.'
  },
  {
    title: 'Sub-Second Routing',
    body: 'Smart routing finds optimal paths in milliseconds for fast trade settlement.'
  },
  {
    title: 'Multi-Validator Bridge',
    body: 'Move assets from Ethereum, BNB Chain, Polygon and beyond into W-SWAP DEX.'
  },
  {
    title: 'Audited & Non-Custodial',
    body: 'Independently audited contracts. Your keys, your tokens, always.'
  }
]

const STEPS = [
  { title: 'Connect Wallet', body: 'MetaMask, WalletConnect, Trust Wallet - one click.' },
  { title: 'Choose Tokens', body: 'Pick input and output tokens to route your trade.' },
  { title: 'Confirm & Trade', body: 'Review quote and confirm. Most swaps settle in about 75 seconds.' }
]

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
        <SeamlessWrapper>
          <p>Seamless Swaps. Unified Liquidity.</p>
          <p>Built for Utility​​ ​Tokens.​​​</p>
        </SeamlessWrapper>
        <AppBody>
          <TradingCard>
            <LandingTabs>
              <TabPill active>SWAP</TabPill>
              <TabPill>POOL</TabPill>
              <TabPill>BRIDGE</TabPill>
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
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '4px 1rem 0 1rem' }}>
                  <ArrowWrapper clickable>
                    <img
                      src={FishIcon}
                      alt="fish"
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }}
                    />
                  </ArrowWrapper>
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
                  <Text fontWeight={500} fontSize={14} color="#172539">
                    Price
                  </Text>
                  <TradePrice price={trade?.executionPrice} showInverted={false} setShowInverted={() => undefined} />
                </PriceRow>
              )}
              </AutoColumn>
              <BottomGrouping>
                <LaunchButton onClick={handleNavigateToSwap}>Get Started</LaunchButton>
              </BottomGrouping>
            </Wrapper>
          </TradingCard>
        </AppBody>

        <MetricsSection>
          {STATS.map(item => (
            <MetricCard key={item.label}>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </MetricCard>
          ))}
        </MetricsSection>

        <ContentSection>
          <SectionTitle>What a swap actually costs</SectionTitle>
          <SectionSubTitle>
            Compare gas, pool fee, and confirmation time so traders can evaluate execution quality clearly.
          </SectionSubTitle>
          <ComparisonGrid>
            {COST_COMPARISON.map(item => (
              <ComparisonCard key={item.title}>
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

        <ContentSection>
          <SectionTitle>A DEX engineered for payments-grade performance</SectionTitle>
          <FeatureGrid>
            {FEATURES.map(item => (
              <FeatureCard key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ContentSection>

        <ContentSection>
          <SectionTitle>Swap in three steps</SectionTitle>
          <StepGrid>
            {STEPS.map((item, index) => (
              <StepCard key={item.title}>
                <span>{index + 1}</span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </StepCard>
            ))}
          </StepGrid>
        </ContentSection>

        <ReviewCards />

        <Marginer />
      </BodyWrapper>

      <ConnectWithUs />
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

const Marginer = styled.div`
  margin-top: 5rem;
`

const TradingCard = styled.div`
  width: min(860px, calc(100vw - 40px));
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e6e2d8;
  border-radius: 22px;
  padding: 26px 24px 28px;
  box-shadow: 0 14px 44px rgba(26, 36, 48, 0.08);
`

const LandingTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 22px;
`

const TabPill = styled.button<{ active?: boolean }>`
  border-radius: 9999px;
  border: 1px solid ${({ active }) => (active ? '#43baa8' : '#d9d7d0')};
  color: ${({ active }) => (active ? '#2ba491' : '#6f747a')};
  background: #fff;
  padding: 8px 28px;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: default;
`

const PriceRow = styled(RowBetween)`
  margin-top: 14px;
  padding: 0 8px;
`

const LaunchButton = styled(ButtonPrimaryDark)`
  width: 100%;
  min-height: 54px;
  border-radius: 10px;
  border: none;
  color: #101b2d;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #18b3a8 0%, #4485e9 100%);

  &:hover {
    opacity: 0.95;
  }
`

const ContentSection = styled.section`
  width: min(1100px, calc(100% - 32px));
  margin-top: 56px;
`

const SectionTitle = styled.h2`
  color: #12365f;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
`

const SectionSubTitle = styled.p`
  color: #4f627a;
  text-align: center;
  margin: 16px auto 0;
  max-width: 760px;
  line-height: 1.6;
`

const MetricsSection = styled.section`
  width: min(1100px, calc(100% - 32px));
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const MetricCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2ebf7;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(18, 54, 95, 0.06);

  h3 {
    margin: 0;
    color: #12365f;
    font-size: 2rem;
  }

  p {
    margin: 8px 0 0;
    color: #5f6f84;
    font-weight: 600;
  }
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

const ComparisonCard = styled.div`
  background: #ffffff;
  border: 1px solid #e3ecf8;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  h4 {
    margin: 0 0 8px;
    color: #12365f;
    font-size: 1.15rem;
  }

  label {
    color: #60748f;
    font-size: 0.84rem;
    font-weight: 600;
  }
`

const ValueText = styled.span`
  color: #213247;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 6px;
`

const FeatureGrid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e3ecf8;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(18, 54, 95, 0.06);

  h4 {
    margin: 0;
    color: #12365f;
  }

  p {
    margin: 10px 0 0;
    color: #4e6079;
    line-height: 1.6;
  }
`

const StepGrid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const StepCard = styled.div`
  background: #ffffff;
  border: 1px solid #e3ecf8;
  border-radius: 14px;
  padding: 18px;

  span {
    display: inline-flex;
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    align-items: center;
    justify-content: center;
    background: #12365f;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
  }

  h4 {
    margin: 10px 0 0;
    color: #12365f;
  }

  p {
    margin: 10px 0 0;
    color: #52667f;
    line-height: 1.6;
  }
`

const SeamlessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  height: fit-content;
  z-index: 100;
  margin-top: -5px;

  p {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 2.5rem;
    margin: 0;
    line-height: 1.2;
    color: #fff;
  }

  @media (max-width: 1024px) {
    p {
      font-size: 2rem;
      text-align: center;
    }
  }

  @media (max-width: 768px) {
    p {
      font-size: 1.8rem;
      text-align: center;
    }
  }
`
