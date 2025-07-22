import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ButtonPrimaryDark } from '../../components/Button'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow } from '../../components/Row'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { JSBI } from '@uniswap/sdk'
import { parseUnits } from '@ethersproject/units'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import AppBody from '../AppBody'
import FishIcon from '../../assets/svg/fish-icon.svg'
import NetworkInputPanel from './components/NetworkInputPanel'
import { useSelector } from 'react-redux'
import { AppState } from '../../state'
import { BridgeState, useBridgeStates, useBridgeContract } from './stores'
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

const Link = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
  &:hover {
    color: #e6f3ff;
  }
`

export default function Bridge() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [ wrongNetwork, setWrongNetwork ] = useState(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [bridgeErrorMessage, setBridgeErrorMessage] = useState<string | undefined>(undefined)
  const [inputValue, setInputValue] = useState<string>('')

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { setFromToken, swapNetworks, setFromAmount } = useBridgeStates()
  const bridgeState = useSelector<AppState, BridgeState>(state => state.bridgeStates)

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

  const [openHistory, setOpenHistory] = useState(false)
  const toggleHistory = useCallback(() => {
    setOpenHistory(!openHistory)
  }, [openHistory])

  return (
    <div style={{ position: 'relative' }}>
      <AppBody>
        <SwapPoolTabs active={'bridge'} />

        {openHistory ? (
          <BridgeHistory />
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

            <AutoRow
              gap={'sm'}
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px'
              }}
            >
              <NetworkInputPanel
                label="From"
                id="from-chain"
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
                  onClick={() => swapNetworks()}
                />
              </ArrowWrapper>
              <NetworkInputPanel
                label="To"
                id="to-chain"
                direction="to"
              />

            </AutoRow>

            <br />

            <BridgeTokenInputPanel
              value={inputValue}
              onUserInput={handleTypeInput}
              onTokenSelect={handleFromTokenSelect}
              availableTokens={availableFromTokens}
              selectedToken={bridgeState.fromToken}
              id="bridge-token-input"
              balance={selectedTokenBalance}
            />

            {/* Bridge Fee Display */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Bridge Fee:
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                {feeLoading ? 'Loading...' : feeInEth ? `${feeInEth} ${currentNetworkETHName}` : 'N/A'}
              </span>
            </div>

            <BottomGrouping>
              {!account ? (
                <ButtonPrimaryDark onClick={toggleWalletModal}>Connect Wallet</ButtonPrimaryDark>
              ) : (
                <ButtonPrimaryDark
                  disabled={disabled}
                  onClick={handleBridge}
                >
                  {buttonLabel()}
                </ButtonPrimaryDark>
              )}
            </BottomGrouping>

            <BottomGrouping style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                href="https://bridge.w-chain.com"
                target="_blank"
              >
                Powered by W Bridge
              </Link>
            </BottomGrouping>
          </Wrapper>
        )}
      </AppBody>

      <StyledBridgeHistoryLink onClick={toggleHistory}>
        {!openHistory ? 
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32.8125 17.5C32.8125 21.5611 31.1992 25.4559 28.3276 28.3276C25.4559 31.1992 21.5611 32.8125 17.5 32.8125C13.4389 32.8125 9.54408 31.1992 6.67243 28.3276C3.80078 25.4559 2.1875 21.5611 2.1875 17.5C2.1875 17.2099 2.30273 16.9317 2.50785 16.7266C2.71297 16.5215 2.99117 16.4063 3.28125 16.4063C3.57133 16.4063 3.84953 16.5215 4.05465 16.7266C4.25977 16.9317 4.375 17.2099 4.375 17.5C4.37062 20.4291 5.34472 23.2758 7.14269 25.5882C8.94066 27.9006 11.4595 29.5462 14.2993 30.2638C17.1392 30.9814 20.1374 30.7299 22.818 29.5492C25.4987 28.3686 27.7081 26.3263 29.0958 23.7468C30.4834 21.1672 30.9697 18.198 30.4774 15.3105C29.9851 12.4231 28.5425 9.78276 26.3785 7.80867C24.2146 5.83459 21.4532 4.63984 18.5328 4.41408C15.6124 4.18832 12.7002 4.94446 10.2586 6.56251H10.9375C11.2276 6.56251 11.5058 6.67774 11.7109 6.88286C11.916 7.08798 12.0312 7.36618 12.0312 7.65626C12.0312 7.94634 11.916 8.22454 11.7109 8.42966C11.5058 8.63477 11.2276 8.75001 10.9375 8.75001H7.65625C7.51259 8.75009 7.37033 8.72186 7.23759 8.66692C7.10486 8.61198 6.98425 8.53142 6.88267 8.42984C6.78109 8.32826 6.70053 8.20765 6.64559 8.07492C6.59065 7.94218 6.56242 7.79991 6.5625 7.65626V4.37501C6.5625 4.08493 6.67773 3.80673 6.88285 3.60161C7.08797 3.39649 7.36617 3.28126 7.65625 3.28126C7.94633 3.28126 8.22453 3.39649 8.42965 3.60161C8.63477 3.80673 8.75 4.08493 8.75 4.37501V4.93711C11.0455 3.33715 13.7357 2.39693 16.5281 2.21862C19.3205 2.04031 22.1084 2.63074 24.5888 3.92574C27.0692 5.22074 29.1472 7.17078 30.5971 9.56396C32.0469 11.9571 32.8132 14.7019 32.8125 17.5ZM27.3438 17.5C27.3438 19.4469 26.7664 21.3501 25.6848 22.9689C24.6031 24.5877 23.0658 25.8494 21.267 26.5944C19.4683 27.3395 17.4891 27.5344 15.5796 27.1546C13.6701 26.7748 11.9161 25.8373 10.5394 24.4606C9.16274 23.0839 8.22522 21.3299 7.8454 19.4204C7.46557 17.5109 7.66051 15.5317 8.40556 13.733C9.15061 11.9343 10.4123 10.3969 12.0311 9.31523C13.6499 8.23358 15.5531 7.65626 17.5 7.65626C20.1098 7.65911 22.612 8.69713 24.4574 10.5426C26.3029 12.388 27.3409 14.8902 27.3438 17.5ZM21.3879 18.7775L18.5938 16.9147V12.0313C18.5938 11.7412 18.4785 11.463 18.2734 11.2579C18.0683 11.0527 17.7901 10.9375 17.5 10.9375C17.2099 10.9375 16.9317 11.0527 16.7266 11.2579C16.5215 11.463 16.4062 11.7412 16.4062 12.0313V17.5C16.4063 17.6801 16.4508 17.8573 16.5357 18.0161C16.6207 18.1748 16.7435 18.3101 16.8933 18.41L20.1746 20.5975C20.4159 20.7551 20.7097 20.8109 20.9921 20.7531C21.2744 20.6952 21.5225 20.5281 21.6824 20.2883C21.8423 20.0485 21.9011 19.7553 21.8459 19.4723C21.7908 19.1894 21.6262 18.9397 21.3879 18.7775Z"
              fill="#043F83"
            />
          </svg>
        : 
          <svg fill="none" height="35" width="35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 550" >
            <g>
              <path d="M487.1,14.065c0-0.1,0-0.2,0-0.4c0-0.3-0.1-0.5-0.1-0.8c0-0.2,0-0.4-0.1-0.6c0-0.2-0.1-0.4-0.1-0.5
                c-0.1-0.2-0.1-0.5-0.2-0.7c0-0.1-0.1-0.2-0.1-0.4c-0.1-0.3-0.2-0.6-0.3-0.9c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.3-0.7-0.5-1
                c0-0.1-0.1-0.2-0.1-0.2c-0.2-0.3-0.3-0.6-0.5-0.9c-0.7-1-1.5-1.9-2.4-2.7c-3.7-4.2-9.8-5.9-15.3-3.6L8.4,190.765
                c-0.1,0.1-0.3,0.1-0.4,0.2c-0.3,0.1-0.5,0.2-0.8,0.4c-0.2,0.1-0.4,0.2-0.6,0.3s-0.4,0.2-0.6,0.4c-0.2,0.1-0.4,0.3-0.6,0.4
                c-0.2,0.1-0.3,0.2-0.5,0.4c-0.2,0.1-0.3,0.3-0.5,0.5c-0.2,0.1-0.3,0.3-0.5,0.4c-0.2,0.2-0.3,0.3-0.5,0.5c-0.1,0.2-0.3,0.3-0.4,0.5
                c-0.1,0.2-0.3,0.4-0.4,0.5c-0.1,0.2-0.3,0.3-0.4,0.5c-0.1,0.2-0.3,0.4-0.4,0.6c-0.1,0.2-0.2,0.3-0.3,0.5c-0.2,0.3-0.3,0.6-0.4,0.9
                c0,0.1-0.1,0.2-0.2,0.3l0,0c-0.2,0.4-0.3,0.8-0.4,1.2c0,0,0,0,0,0.1c-0.1,0.4-0.2,0.8-0.3,1.3c0,0.2-0.1,0.4-0.1,0.6
                c0,0.2-0.1,0.5-0.1,0.7s0,0.4,0,0.6c0,0.2,0,0.5,0,0.7s0,0.4,0,0.6c0,0.2,0,0.5,0,0.7s0.1,0.4,0.1,0.5c0,0.3,0.1,0.5,0.1,0.8
                c0.1,0.3,0.1,0.6,0.2,0.9c0.1,0.2,0.1,0.4,0.2,0.6c0.1,0.3,0.2,0.7,0.4,1l0,0c0.1,0.4,0.3,0.7,0.5,1c0,0.1,0.1,0.2,0.1,0.2
                c0.1,0.3,0.3,0.5,0.5,0.8c0.1,0.1,0.1,0.2,0.2,0.3c0.2,0.3,0.3,0.5,0.5,0.7c0.1,0.1,0.1,0.2,0.2,0.2c0.3,0.3,0.5,0.6,0.8,0.9l0,0
                c0.3,0.3,0.6,0.5,0.9,0.8c0.1,0.1,0.2,0.2,0.3,0.2c0.2,0.2,0.5,0.4,0.7,0.5c0.1,0.1,0.2,0.1,0.3,0.2c0.3,0.2,0.7,0.4,1,0.6
                c0.1,0,0.1,0.1,0.2,0.1c0.3,0.2,0.6,0.3,1,0.5c0.1,0,0.1,0.1,0.2,0.1l185,78.4l78.4,185c0.1,0.4,0.3,0.7,0.5,1
                c0,0.1,0.1,0.2,0.1,0.2c0.2,0.3,0.3,0.5,0.5,0.8c0.1,0.1,0.1,0.2,0.2,0.3c0.2,0.3,0.4,0.5,0.5,0.7c0.1,0.1,0.1,0.2,0.2,0.2
                c0.3,0.3,0.5,0.6,0.8,0.9l0.1,0.1c0.3,0.2,0.5,0.5,0.8,0.7c0.1,0.1,0.2,0.2,0.3,0.2c0.2,0.2,0.5,0.4,0.7,0.5
                c0.1,0.1,0.2,0.1,0.3,0.2c0.3,0.2,0.7,0.4,1,0.6c0.1,0,0.2,0.1,0.2,0.1c0.3,0.2,0.6,0.3,0.9,0.4c0.1,0,0.1,0.1,0.2,0.1
                c0,0,0.1,0,0.1,0.1c0.3,0.1,0.7,0.3,1,0.4h0.1c0.4,0.1,0.7,0.2,1.1,0.3c0.1,0,0.3,0,0.4,0.1c0.3,0,0.5,0.1,0.8,0.1
                c0.1,0,0.3,0,0.4,0c0.4,0,0.7,0.1,1.1,0.1l0,0l0,0l0,0l0,0c0.4,0,0.8,0,1.1-0.1c0.1,0,0.3,0,0.4,0c0.3,0,0.6-0.1,0.8-0.1
                c0.1,0,0.3,0,0.4-0.1c0.4-0.1,0.8-0.2,1.1-0.3c0.1,0,0.1,0,0.2-0.1c0.3-0.1,0.7-0.2,1-0.4c0.1,0,0.1,0,0.2-0.1
                c0.1,0,0.1-0.1,0.2-0.1c0.3-0.1,0.6-0.3,0.9-0.5c0.1,0,0.1-0.1,0.2-0.1c0.3-0.2,0.7-0.4,1-0.6c0.1-0.1,0.2-0.1,0.3-0.2
                c0.2-0.2,0.5-0.3,0.7-0.5c0.1-0.1,0.2-0.2,0.3-0.2c0.3-0.3,0.6-0.5,0.8-0.8l0,0c0.3-0.3,0.5-0.6,0.8-0.9c0.1-0.1,0.1-0.2,0.2-0.3
                c0.2-0.2,0.4-0.5,0.5-0.7c0.1-0.1,0.1-0.2,0.2-0.3c0.2-0.3,0.3-0.5,0.5-0.8c0-0.1,0.1-0.2,0.1-0.2c0.2-0.3,0.3-0.7,0.5-1
                l189.6-458.4c0.3-0.8,0.6-1.7,0.8-2.6c0.1-0.3,0.1-0.7,0.1-1c0-0.1,0-0.2,0-0.3c0-0.4,0-0.7,0.1-1.1c0-0.1,0-0.2,0-0.2
                C487.1,14.665,487.1,14.365,487.1,14.065z M48.6,203.365l370.6-153l-217.8,217.7L48.6,203.365z M284,438.765l-64-151.1l215.3-215.2
                L284,438.765z"
                fill="#043F83"
              />
            </g>
          </svg>
        }
        
      </StyledBridgeHistoryLink>
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
