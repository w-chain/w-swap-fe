import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { BridgeState } from '../../state/bridge/reducer'
import { useBridgeContract } from '../../hooks/bridge/useBridgeContract'
import { AutoColumn } from '../../components/Column'
import { ButtonPrimary } from '../../components/Button'
import { TYPE } from '../../theme'
import TokenInput from '../../components/TokenInput'
import { ChainSelect } from '../../components/ChainSelect'
import PreflightChecksModal from '../../components/Modal/PreflightChecksModal'
import { TransactionHistory } from '../../components/TransactionHistory'
import { useActiveWeb3React } from '../../hooks'
import { useBridgeState } from '../../state/bridge/hooks'
import { TransactionStatus } from '../../state/bridge/types'
import { addTransaction, updateTransactionStatus, updateDepositNonce } from '../../state/bridge/actions'
import { useDispatch } from 'react-redux'
import { Log } from '@ethersproject/abstract-provider'

const BridgeContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  z-index: 1;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red1};
  font-size: 14px;
  margin-top: 8px;
`

export function BridgeWrapper() {
  const { account, chainId } = useActiveWeb3React()
  const bridgeContract = useBridgeContract()
  const bridgeState = useBridgeState()
  const dispatch = useDispatch()

  const [isPending, setIsPending] = useState(false)
  const [showPreflight, setShowPreflight] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeposit = useCallback(async () => {
    if (!account || !chainId || !bridgeState.fromToken || !bridgeState.toChain) {
      setError('Please connect your wallet and select tokens')
      return
    }
    setError(null)
    setShowPreflight(true)
  }, [account, chainId, bridgeState])

  const handlePreflightResult = async (didAgree: boolean) => {
    setShowPreflight(false)
    if (!didAgree) return
    setAgreed(true)
    setIsPending(true)
    setError(null)

    try {
      if (!bridgeState.fromToken || !bridgeState.toChain || !account) {
        throw new Error('Missing required fields')
      }

      const tx = await bridgeContract.deposit(bridgeState.amount, account, bridgeState.fromToken, bridgeState.toChain)

      // Add transaction to history
      dispatch(
        addTransaction({
          fromChainId: chainId!,
          toChainId: bridgeState.toChain,
          originDomainId: chainId!,
          destinationDomainId: bridgeState.toChain,
          resourceId: bridgeState.fromToken,
          depositNonce: '0',
          amount: parseFloat(bridgeState.amount),
          tokenAddress: bridgeState.fromToken,
          tokenSymbol: bridgeState.fromToken,
          sender: account,
          recipient: account,
          txHash: tx.hash,
          data: '',
          status: TransactionStatus.PENDING,
          timestamp: Date.now()
        })
      )

      const receipt = await tx.wait()

      if (receipt.status === 1) {
        // Update transaction status
        dispatch(
          updateTransactionStatus({
            txHash: tx.hash,
            status: TransactionStatus.AWAITING
          })
        )

        // Get deposit nonce from event logs
        const depositEvent = receipt.logs.find((log: Log) => {
          try {
            const parsed = bridgeContract.contract?.interface.parseLog(log)
            return parsed?.name === 'Deposit'
          } catch {
            return false
          }
        })

        if (depositEvent) {
          const parsedLog = bridgeContract.contract?.interface.parseLog(depositEvent)
          if (parsedLog?.args) {
            dispatch(
              updateDepositNonce({
                txHash: tx.hash,
                depositNonce: parsedLog.args.depositNonce.toString()
              })
            )
          }
        }
      } else {
        dispatch(
          updateTransactionStatus({
            txHash: tx.hash,
            status: TransactionStatus.FAILED
          })
        )
        throw new Error('Transaction failed')
      }
    } catch (error) {
      console.error('Bridge deposit error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process bridge transaction')
      if (error instanceof Error && error.message.includes('user rejected')) {
        setError('Transaction was rejected')
      }
    } finally {
      setIsPending(false)
      setAgreed(false)
    }
  }

  return (
    <BridgeContainer>
      <AutoColumn gap="20px">
        <TYPE.largeHeader>Bridge Tokens</TYPE.largeHeader>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
          <AutoColumn gap="12px">
            <TYPE.body>From Chain</TYPE.body>
            <ChainSelect selectedChain={bridgeState.fromChain} onChainSelect={bridgeState.updateFromChain} />
          </AutoColumn>

          <AutoColumn gap="12px">
            <TYPE.body>To Chain</TYPE.body>
            <ChainSelect selectedChain={bridgeState.toChain} onChainSelect={bridgeState.updateToChain} />
          </AutoColumn>
        </div>

        <AutoColumn gap="12px">
          <TYPE.body>Amount</TYPE.body>
          <TokenInput
            value={bridgeState.amount}
            onUserInput={bridgeState.updateAmount}
            token={bridgeState.fromToken}
            onTokenSelect={bridgeState.updateFromToken}
          />
        </AutoColumn>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonPrimary
          disabled={!account || isPending || !bridgeState.amount || !bridgeState.fromToken || !bridgeState.toChain}
          onClick={handleDeposit}
        >
          {isPending ? 'Processing...' : 'Bridge Tokens'}
        </ButtonPrimary>

        <PreflightChecksModal isOpen={showPreflight} onResult={handlePreflightResult} />

        <TransactionHistory transactions={bridgeState.transactions} />
      </AutoColumn>
    </BridgeContainer>
  )
}
