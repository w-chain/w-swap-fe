import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoColumn } from '../../components/Column'
import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { EcosystemPrimaryButton, EcosystemFeeRow, EcosystemSection, FlipButton } from '../../components/ecosystem/styled'
import { JSBI } from '@uniswap/sdk'
import { parseUnits } from '@ethersproject/units'

import { useActiveWeb3React, useSwitchChain, SwitchChainError, SwitchChainErrorType } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import { ChainId as SDKChainId } from '@uniswap/sdk'
import NetworkInputPanel from './components/NetworkInputPanel'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { BridgeState, useBridgeStates, useBridgeContract } from './stores'
import { initializeTransactions } from './stores/Transaction'
import { TokenSymbols } from './shared/types'
import BridgeTokenInputPanel from './components/BridgeTokenSelect'
import BridgeHistory from './components/BridgeHistory'
import { getAvailableFromTokens } from './shared/utils/token'
import { useTokenBalance, useETHBalances } from '../../state/wallet/hooks'
import { useToken } from '../../hooks/Tokens'
import { getTokenBySymbol } from './shared/registry/tokens'
import { useBridgeApproveCallback } from './stores/hooks/useBridgeApproveCallback'
import { ApprovalState } from '../../hooks/useApproveCallback'
import ConfirmBridgeModal from './components/ConfirmBridgeModal'

export default function Bridge({ embedded = false }: { embedded?: boolean }) {
  const dispatch = useDispatch<AppDispatch>()
  const { account, chainId } = useActiveWeb3React()

  useEffect(() => {
    dispatch(initializeTransactions())
  }, [dispatch])
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [ wrongNetwork, setWrongNetwork ] = useState(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [bridgeErrorMessage, setBridgeErrorMessage] = useState<string | undefined>(undefined)
  const [inputValue, setInputValue] = useState<string>('')

  const toggleWalletModal = useWalletModalToggle()
  const { switchChain } = useSwitchChain()
  const bridgeState = useSelector<AppState, BridgeState>(state => state.bridgeStates)

  const { setFromToken, swapNetworks, setFromAmount } = useBridgeStates()

  const [openHistory, setOpenHistory] = useState(false)

  useEffect(() => {
    if (!account || !bridgeState.fromChainId || openHistory) return

    const fromChainId = Number(bridgeState.fromChainId) as SDKChainId
    if (fromChainId === chainId) return

    const timer = window.setTimeout(() => {
      switchChain(fromChainId).catch((error) => {
        if (error instanceof SwitchChainError && error.type !== SwitchChainErrorType.USER_REJECTED) {
          console.error('Failed to auto-switch chain:', error.message)
        }
      })
    }, 400)

    return () => window.clearTimeout(timer)
  }, [bridgeState.fromChainId, chainId, account, switchChain, openHistory])

  const availableFromTokens = useMemo(() => getAvailableFromTokens(bridgeState.from, bridgeState.to), [
    bridgeState.from,
    bridgeState.to
  ])

  const handleFromTokenSelect = (token: TokenSymbols | undefined) => {
    setFromToken(token)
  }

  const selectedToken = useToken(bridgeState.selectedTokenAddress)
  const selectedTokenBalance = useTokenBalance(account ?? undefined, selectedToken ?? undefined)
  const currentNetworkETHName = useMemo(() => {
    switch (chainId) {
      case 1:
        return 'ETH'
      case 56:
        return 'BNB'
      case 171717:
      default:
        return 'WCO'
    }
  }, [chainId])

  const validateAmount = (value: string) => {
    // Allow empty string, just a dot, or leading zeros with decimals
    if (value === '' || value === '.' || /^0+\.?\d*$/.test(value) || /^\d*\.?\d*$/.test(value)) {
      // Only convert to number if it's a complete valid number (not just a dot or incomplete)
      if (value !== '' && value !== '.' && !isNaN(Number(value))) {
        return Number(value);
      }
      return undefined;
    }
    return undefined;
  };

  const handleTypeInput = useCallback(
    (value: string) => {
      // Always update the input value to preserve user typing
      setInputValue(value)
      
      // Validate and update bridge state only if we have a valid number
      const validatedNumber = validateAmount(value)
      if (validatedNumber !== undefined) {
        setFromAmount(validatedNumber)
      } else if (value === '' || value === '.') {
        // Clear the amount if input is empty or just a dot
        setFromAmount(undefined)
      }
    },
    [setFromAmount]
  )

  useEffect(() => {
    if (bridgeState.fromChainId && Number(bridgeState.fromChainId) !== Number(chainId)) {
      setWrongNetwork(true)
    } else {
      setWrongNetwork(false)
    }
  }, [bridgeState, bridgeState.fromChainId, chainId])

  // Sync inputValue with bridgeState.fromAmount when it changes from external sources
  useEffect(() => {
    if (bridgeState.fromAmount !== undefined && inputValue === '') {
      setInputValue(bridgeState.fromAmount.toString())
    } else if (bridgeState.fromAmount === undefined && inputValue !== '') {
      // Only clear if the bridge state was explicitly cleared
      const currentValidated = validateAmount(inputValue)
      if (currentValidated === undefined) {
        setInputValue('')
      }
    }
  }, [bridgeState.fromAmount, inputValue])

  // Clear input when token or network changes
  useEffect(() => {
    setInputValue('')
  }, [bridgeState.fromToken, bridgeState.fromChainId, bridgeState.toChainId])

  const [ approval, approveCallback ] = useBridgeApproveCallback(bridgeState.fromToken, bridgeState.fromChainId, bridgeState.fromAmount)
  const { deposit, fee, feeLoading, feeInEth } = useBridgeContract()

  // Check if user has enough ETH to pay the bridge fee
  const hasInsufficientETHForFee = useMemo(() => {
    if (!userEthBalance || !fee || feeLoading) return false
    // Convert ethers BigNumber to JSBI for comparison with CurrencyAmount
    const feeAsJSBI = JSBI.BigInt(fee.toString())
    return JSBI.lessThan(userEthBalance.raw, feeAsJSBI)
  }, [userEthBalance, fee, feeLoading])

  const hasInsufficientTokenBalance = useMemo(() => {
    if (!selectedTokenBalance || !bridgeState.fromAmount) return false
    // Convert ethers BigNumber to JSBI for comparison with CurrencyAmount
    const fromAmountAsJSBI = JSBI.BigInt(parseUnits(bridgeState.fromAmount.toString(), selectedToken?.decimals))
    return JSBI.lessThan(selectedTokenBalance.raw, fromAmountAsJSBI)
  }, [selectedTokenBalance, bridgeState.fromAmount])

  const disabled = wrongNetwork || !bridgeState.fromToken || !bridgeState.fromAmount || approval === ApprovalState.PENDING || hasInsufficientETHForFee || hasInsufficientTokenBalance

  const buttonLabel = () => {
    if (wrongNetwork) return 'Wrong Network'
    if (hasInsufficientETHForFee) return `Not enough ${currentNetworkETHName} to pay fee`
    if (hasInsufficientTokenBalance) return `Not enough ${bridgeState.fromToken} to bridge`

    if (approval === ApprovalState.PENDING) return 'Approving...'
    if (approval === ApprovalState.NOT_APPROVED) return 'Approve'
    return `Move Funds to ${bridgeState.to}`
  }
  const handleConfirmDismiss = useCallback(() => {
    setShowConfirm(false)
    setTxHash(undefined)
    setBridgeErrorMessage(undefined)
  }, [])

  const handleBridge = useCallback(() => {
    if (disabled) return;
    if (approval === ApprovalState.NOT_APPROVED) {
      approveCallback()
      return
    }
    setShowConfirm(true)
  }, [disabled, approval, approveCallback])

  const handleConfirmBridge = useCallback(async () => {
    if (!bridgeState.fromAmount || !bridgeState.fromToken || bridgeState.fromChainId === undefined || bridgeState.toChainId === undefined) {
      return
    }

    setAttemptingTxn(true)
    setBridgeErrorMessage(undefined)

    try {
      const token = getTokenBySymbol(bridgeState.fromChainId, bridgeState.fromToken);
      if (!token) {
        throw new Error('Token not found')
      }
      const result = await deposit(bridgeState.fromAmount, token, bridgeState.toChainId)
      setTxHash(result?.hash)
      setOpenHistory(true)
    } catch (error) {
       setBridgeErrorMessage((error as any)?.message || 'Bridge transaction failed')
    } finally {
      setAttemptingTxn(false)
    }
  }, [bridgeState.fromAmount, bridgeState.fromToken, bridgeState.fromChainId, bridgeState.toChainId, deposit])

  const toggleHistory = useCallback(() => {
    setOpenHistory(prev => !prev)
  }, [])

  const bridgeBody = (
    <>
      {!embedded && <SwapPoolTabs active={'bridge'} />}
      <HistoryToggleRow type="button" onClick={toggleHistory}>
        {openHistory ? '← Back to bridge' : 'View bridge history'}
      </HistoryToggleRow>
      {openHistory ? (
        <BridgeHistoryPanel>
          <BridgeHistory />
        </BridgeHistoryPanel>
      ) : (
        <Wrapper id="bridge-page">
            <ConfirmBridgeModal
              isOpen={showConfirm}
              amount={bridgeState.fromAmount}
              tokenSymbol={bridgeState.fromToken}
              fromNetwork={bridgeState.from}
              toNetwork={bridgeState.to}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              onConfirm={handleConfirmBridge}
              bridgeErrorMessage={bridgeErrorMessage}
              onDismiss={handleConfirmDismiss}
            />

            <AutoColumn gap="md">
              <EcosystemSection style={{ gap: 14, padding: '16px' }}>
                <BridgeNetworkRow style={{ marginBottom: 0 }}>
                  <NetworkInputPanel label="From" id="from-chain" direction="from" />
                  <FlipButton type="button" aria-label="Swap networks" onClick={() => swapNetworks()}>
                    ⇄
                  </FlipButton>
                  <NetworkInputPanel label="To" id="to-chain" direction="to" />
                </BridgeNetworkRow>

                <BridgeTokenInputPanel
                  value={inputValue}
                  onUserInput={handleTypeInput}
                  onTokenSelect={handleFromTokenSelect}
                  availableTokens={availableFromTokens}
                  selectedToken={bridgeState.fromToken}
                  id="bridge-token-input"
                  balance={selectedTokenBalance}
                />

                <EcosystemFeeRow style={{ marginTop: 0 }}>
                  <span style={{ fontWeight: 500 }}>Bridge Fee:</span>
                  <span style={{ fontWeight: 600, color: '#5c6a78' }}>
                    {feeLoading ? 'Loading...' : feeInEth ? `${feeInEth} ${currentNetworkETHName}` : 'N/A'}
                  </span>
                </EcosystemFeeRow>
              </EcosystemSection>

              <BottomGrouping style={{ marginTop: 0 }}>
              {!account ? (
                <EcosystemPrimaryButton onClick={toggleWalletModal}>Connect Wallet</EcosystemPrimaryButton>
              ) : (
                <EcosystemPrimaryButton disabled={disabled} onClick={handleBridge}>
                  {buttonLabel()}
                </EcosystemPrimaryButton>
              )}
              </BottomGrouping>
            </AutoColumn>
        </Wrapper>
      )}
    </>
  )

  return (
    <div style={{ position: 'relative' }}>
      {embedded ? bridgeBody : <AppBody card wideCard>{bridgeBody}</AppBody>}
    </div>
  )
}

const BridgeHistoryPanel = styled.div`
  width: 100%;
  max-height: min(70vh, 640px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-right: 4px;
`

const HistoryToggleRow = styled.button`
  display: block;
  width: 100%;
  margin: 0 0 12px;
  padding: 0;
  border: none;
  background: none;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #0e9a86;
  cursor: pointer;
  touch-action: manipulation;

  &:hover {
    text-decoration: underline;
  }
`

const BridgeNetworkRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 14px;
  align-items: end;
  width: 100%;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 1fr;
    gap: 12px;
    justify-items: center;

    & > button[aria-label='Swap networks'] {
      margin-bottom: 0 !important;
      transform: rotate(90deg);
    }
  `};
`

