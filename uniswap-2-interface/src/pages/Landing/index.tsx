import { CurrencyAmount, Token } from '@uniswap/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonPrimaryDark } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import { useHistory } from 'react-router-dom'

import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { useCurrency } from '../../hooks/Tokens'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import FishIcon from '../../assets/svg/fish-icon.svg'
import ConnectWithUs from '../../components/connectWithUs/ConnectWithUs'
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

const REVIEWS = [
  {
    body:
      "W-SWAP DEX is more than a DEX - it's a gateway to financial empowerment with low-cost transactions and strong UX.",
    author: 'X @cryptoperrix'
  },
  {
    body:
      "W-SWAP DEX launched smoothly and feels solid on desktop and mobile. Intuitive, reliable, and user-friendly.",
    author: 'X @TheDavey92'
  }
]

export default function Landing() {
  const theme = useContext(ThemeContext)

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
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

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

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
        <br />
        <br />
        <AppBody>
          <SwapPoolTabs active={'swap'} landing={true} />
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
                <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontWeight={500} fontSize={14} color={theme.text2}>
                          Price
                        </Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          Slippage Tolerance
                        </ClickableText>
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          {allowedSlippage / 100}%
                        </ClickableText>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              <ButtonPrimaryDark onClick={handleNavigateToSwap}>Get Started</ButtonPrimaryDark>
            </BottomGrouping>
          </Wrapper>
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

        <ContentSection>
          <SectionTitle>Community Reviews</SectionTitle>
          <ReviewGrid>
            {REVIEWS.map(item => (
              <ReviewCard key={item.author}>
                <p>{item.body}</p>
                <strong>{item.author}</strong>
              </ReviewCard>
            ))}
          </ReviewGrid>
        </ContentSection>

        <CtaSection>
          <h3>Start trading on W-SWAP DEX</h3>
          <p>Join thousands of traders moving value at payment speed.</p>
          <CtaActions>
            <ButtonPrimaryDark onClick={handleNavigateToSwap}>Launch W-SWAP DEX</ButtonPrimaryDark>
            <DocsLink href="https://wchain.gitbook.io/wchain-hub/" target="_blank" rel="noopener noreferrer">
              Read the docs
            </DocsLink>
          </CtaActions>
        </CtaSection>

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

const ContentSection = styled.section`
  width: min(1100px, calc(100% - 32px));
  margin-top: 56px;
`

const SectionTitle = styled.h2`
  color: #043f84;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
`

const SectionSubTitle = styled.p`
  color: #4b5f7a;
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
  border: 1px solid #d9e9ff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(4, 63, 132, 0.08);

  h3 {
    margin: 0;
    color: #043f84;
    font-size: 2rem;
  }

  p {
    margin: 8px 0 0;
    color: #5c6f89;
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
  background: #f3f8ff;
  border: 1px solid #cde2ff;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  h4 {
    margin: 0 0 8px;
    color: #043f84;
    font-size: 1.15rem;
  }

  label {
    color: #5f7392;
    font-size: 0.84rem;
    font-weight: 600;
  }
`

const ValueText = styled.span`
  color: #1f2d3d;
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
  border: 1px solid #d8e9ff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(4, 63, 132, 0.07);

  h4 {
    margin: 0;
    color: #043f84;
  }

  p {
    margin: 10px 0 0;
    color: #455a77;
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
  background: #f3f8ff;
  border: 1px solid #d4e5ff;
  border-radius: 14px;
  padding: 18px;

  span {
    display: inline-flex;
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    align-items: center;
    justify-content: center;
    background: #043f84;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
  }

  h4 {
    margin: 10px 0 0;
    color: #043f84;
  }

  p {
    margin: 10px 0 0;
    color: #4f6380;
    line-height: 1.6;
  }
`

const ReviewGrid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ReviewCard = styled.blockquote`
  margin: 0;
  background: #ffffff;
  border: 1px solid #d8e9ff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(4, 63, 132, 0.07);

  p {
    margin: 0;
    color: #425875;
    line-height: 1.7;
  }

  strong {
    display: block;
    margin-top: 12px;
    color: #043f84;
    font-size: 0.95rem;
  }
`

const CtaSection = styled.section`
  width: min(980px, calc(100% - 32px));
  margin-top: 56px;
  background: linear-gradient(145deg, #0a4f95, #0a6fc8);
  border-radius: 20px;
  padding: 36px 24px;
  text-align: center;
  color: #ffffff;

  h3 {
    margin: 0;
    font-size: 2rem;
  }

  p {
    margin: 12px 0 0;
    opacity: 0.95;
  }
`

const CtaActions = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const DocsLink = styled.a`
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 10px 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
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
