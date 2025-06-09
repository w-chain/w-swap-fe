import { CurrencyAmount, JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonPrimaryDark } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'

import { BETTER_TRADE_LINK_THRESHOLD, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { getTradeVersion, isTradeBetter } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
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
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import FishIcon from '../../assets/svg/fish-icon.svg'
import NetworkInputPanel from './components/NetworkInputPanel'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { BridgeState, setFromToken } from './stores'
import { Networks, TokenSymbols } from './shared/types'
import BridgeTokenInputPanel from './components/BridgeTokenSelect'
import { useLocation } from 'react-router-dom'
import BridgeHistory from './components/BridgeHistory'

// Utility to get available tokens based on network selection
function getAvailableFromTokens(from: Networks, to: Networks): TokenSymbols[] {
  if (from === Networks.WCHAIN && to === Networks.BSC) {
    return [TokenSymbols.bUSDT, TokenSymbols.bUSDC]
  }
  return [TokenSymbols.USDT, TokenSymbols.USDC]
}

export default function Bridge() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
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
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const trade = showWrap
    ? undefined
    : {
        [Version.v1]: v1Trade,
        [Version.v2]: v2Trade
      }[toggledVersion]

  const betterTradeLinkVersion: Version | undefined =
    toggledVersion === Version.v2 && isTradeBetter(v2Trade, v1Trade, BETTER_TRADE_LINK_THRESHOLD)
      ? Version.v1
      : toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade)
      ? Version.v2
      : undefined

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
  const isValid = !swapInputError
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

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

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

  console.log('wrapType', wrapType)

  const bridgeState = useSelector<AppState, BridgeState>(state => state.bridgeStates)

  const dispatch = useDispatch<AppDispatch>()

  const availableFromTokens = useMemo(() => getAvailableFromTokens(bridgeState.from, bridgeState.to), [
    bridgeState.from,
    bridgeState.to
  ])

  const handleFromTokenSelect = (token: TokenSymbols | undefined) => {
    dispatch(setFromToken(token))
    // Optionally close modal here
  }

  console.log('availableFromTokens', availableFromTokens)

  // Function to log selected networks and token
  function logBridgeState() {
    console.log('From Network:', bridgeState.from)
    console.log('To Network:', bridgeState.to)
    console.log('From Token:', bridgeState.fromToken)
    console.log('To Token:', bridgeState.toToken)
  }

  // Stub for bridge contract call
  function handleBridge() {
    // Here you would call the contract with the selected state
    logBridgeState()
    // TODO: implement contract call
  }

  const location = useLocation()
  const active = location.pathname.startsWith('/bridge')
    ? 'bridge'
    : location.pathname.startsWith('/pool')
    ? 'pool'
    : 'swap'

  const [openHistory, setOpenHistory] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <AppBody>
        <SwapPoolTabs active={'bridge'} />

        {openHistory ? (
          <BridgeHistory />
        ) : (
          <>
            <Wrapper id="swap-page">
              <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
              />

              <AutoRow
                gap={'sm'}
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <NetworkInputPanel
                  label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                  direction="from"
                />
                <ArrowWrapper
                  clickable
                  style={{
                    margin: 'auto auto 12px auto'
                  }}
                >
                  <img
                    src={FishIcon}
                    alt="fish"
                    onClick={() => {
                      setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                    }}
                  />
                </ArrowWrapper>
                <NetworkInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To'}
                  showMaxButton={false}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                  direction="to"
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
              </AutoRow>

              <br />

              <BridgeTokenInputPanel
                value={formattedAmounts[Field.INPUT]}
                onUserInput={handleTypeInput}
                label={''}
                showMaxButton={!atMaxAmountInput}
                onTokenSelect={handleFromTokenSelect}
                availableTokens={availableFromTokens}
                selectedToken={bridgeState.fromToken}
                id="swap-currency-input"
                hideInput={false}
                hideBalance={false}
              />

              <BottomGrouping>
                {!account ? (
                  <ButtonPrimaryDark onClick={toggleWalletModal}>Connect Wallet</ButtonPrimaryDark>
                ) : (
                  <ButtonPrimaryDark disabled={Boolean(wrapInputError)} onClick={handleBridge}>
                    Move Funds to W Chain
                  </ButtonPrimaryDark>
                )}
              </BottomGrouping>
            </Wrapper>
          </>
        )}
      </AppBody>

      {active === 'bridge' && (
        <StyledBridgeHistoryLink onClick={() => setOpenHistory(!openHistory)}>
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32.8125 17.5C32.8125 21.5611 31.1992 25.4559 28.3276 28.3276C25.4559 31.1992 21.5611 32.8125 17.5 32.8125C13.4389 32.8125 9.54408 31.1992 6.67243 28.3276C3.80078 25.4559 2.1875 21.5611 2.1875 17.5C2.1875 17.2099 2.30273 16.9317 2.50785 16.7266C2.71297 16.5215 2.99117 16.4063 3.28125 16.4063C3.57133 16.4063 3.84953 16.5215 4.05465 16.7266C4.25977 16.9317 4.375 17.2099 4.375 17.5C4.37062 20.4291 5.34472 23.2758 7.14269 25.5882C8.94066 27.9006 11.4595 29.5462 14.2993 30.2638C17.1392 30.9814 20.1374 30.7299 22.818 29.5492C25.4987 28.3686 27.7081 26.3263 29.0958 23.7468C30.4834 21.1672 30.9697 18.198 30.4774 15.3105C29.9851 12.4231 28.5425 9.78276 26.3785 7.80867C24.2146 5.83459 21.4532 4.63984 18.5328 4.41408C15.6124 4.18832 12.7002 4.94446 10.2586 6.56251H10.9375C11.2276 6.56251 11.5058 6.67774 11.7109 6.88286C11.916 7.08798 12.0312 7.36618 12.0312 7.65626C12.0312 7.94634 11.916 8.22454 11.7109 8.42966C11.5058 8.63477 11.2276 8.75001 10.9375 8.75001H7.65625C7.51259 8.75009 7.37033 8.72186 7.23759 8.66692C7.10486 8.61198 6.98425 8.53142 6.88267 8.42984C6.78109 8.32826 6.70053 8.20765 6.64559 8.07492C6.59065 7.94218 6.56242 7.79991 6.5625 7.65626V4.37501C6.5625 4.08493 6.67773 3.80673 6.88285 3.60161C7.08797 3.39649 7.36617 3.28126 7.65625 3.28126C7.94633 3.28126 8.22453 3.39649 8.42965 3.60161C8.63477 3.80673 8.75 4.08493 8.75 4.37501V4.93711C11.0455 3.33715 13.7357 2.39693 16.5281 2.21862C19.3205 2.04031 22.1084 2.63074 24.5888 3.92574C27.0692 5.22074 29.1472 7.17078 30.5971 9.56396C32.0469 11.9571 32.8132 14.7019 32.8125 17.5ZM27.3438 17.5C27.3438 19.4469 26.7664 21.3501 25.6848 22.9689C24.6031 24.5877 23.0658 25.8494 21.267 26.5944C19.4683 27.3395 17.4891 27.5344 15.5796 27.1546C13.6701 26.7748 11.9161 25.8373 10.5394 24.4606C9.16274 23.0839 8.22522 21.3299 7.8454 19.4204C7.46557 17.5109 7.66051 15.5317 8.40556 13.733C9.15061 11.9343 10.4123 10.3969 12.0311 9.31523C13.6499 8.23358 15.5531 7.65626 17.5 7.65626C20.1098 7.65911 22.612 8.69713 24.4574 10.5426C26.3029 12.388 27.3409 14.8902 27.3438 17.5ZM21.3879 18.7775L18.5938 16.9147V12.0313C18.5938 11.7412 18.4785 11.463 18.2734 11.2579C18.0683 11.0527 17.7901 10.9375 17.5 10.9375C17.2099 10.9375 16.9317 11.0527 16.7266 11.2579C16.5215 11.463 16.4062 11.7412 16.4062 12.0313V17.5C16.4063 17.6801 16.4508 17.8573 16.5357 18.0161C16.6207 18.1748 16.7435 18.3101 16.8933 18.41L20.1746 20.5975C20.4159 20.7551 20.7097 20.8109 20.9921 20.7531C21.2744 20.6952 21.5225 20.5281 21.6824 20.2883C21.8423 20.0485 21.9011 19.7553 21.8459 19.4723C21.7908 19.1894 21.6262 18.9397 21.3879 18.7775Z"
              fill="#043F83"
            />
          </svg>
        </StyledBridgeHistoryLink>
      )}
    </div>
  )
}

const StyledBridgeHistoryLink = styled.div`
  background: #d9ebff;
  box-shadow: 4px 4px 4px rgba(4, 63, 132, 0.25);
  border-radius: 15px;
  width: 90px;
  height: 57px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 15px;
  position: absolute;
  top: 60px;
  right: -65px;
`
