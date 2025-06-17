import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { AppState, AppDispatch } from '../../../state'
import { clearCompletedTransactions, initializeTransactions, updateTransactionStatus } from '../stores/Transaction'
import { TransactionStatus, Networks } from '../shared/types/enums'
import { BridgeTransaction } from '../shared/types/transaction'
import { getTokenImage, getNetworkImage, getNetworkFromChainId, getExplorerTxUrl } from '../shared/utils'

const ModalCard = styled.div`
  padding: 0;
  position: relative;
  width: 100%;
  padding-top: 10px;
  max-width: 100%;
  overflow-x: hidden;
`

const Section = styled.div`
  margin-bottom: 20px;
`
const SectionTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  color: #043f84;
  margin-bottom: 12px;
  margin-top: 0;
`
const EmptyText = styled.div`
  text-align: center;
  color: #585858;
  padding: 16px 0;
  font-size: 13px;
  font-weight: 600;
`
const ClearButton = styled.button`
  border: 1px solid #1976d2;
  background: none;
  color: #1976d2;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: 12px;
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  height: 1px;
  background: #c7e0fa;
  margin: 16px 0;
`

const TxCard = styled.div`
  background: #c7e0fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(4, 63, 132, 0.08);
  padding: 16px;
  margin-bottom: 16px;
  transition: box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    box-shadow: 0 6px 24px rgba(4, 63, 132, 0.16);
  }
`

const TxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const StatusRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0px;
  
  @media (max-width: 480px) {
    justify-content: flex-start;
  }
`

const Arrow = styled.span`
  font-size: 16px;
  margin: 0 4px;
  color: #043f84;
  flex-shrink: 0;
`

const StatusText = styled.div<{ status: TransactionStatus }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ status }) =>
    status === TransactionStatus.SUCCESS
      ? '#1dbf73'
      : status === TransactionStatus.FAILED || status === TransactionStatus.REJECTED
      ? '#e74c3c'
      : '#888'};
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    margin-left: 0;
    font-size: 12px;
  }
`

const PollingIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1976d2;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const TxDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  font-size: 14px;
  
  @media (min-width: 481px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
`

const DetailCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

const TokenIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  margin-right: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
`

const AmountBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  background: #eaf4fb;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 700;
  font-size: 14px;
  margin-right: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`

const Ellipsis = styled.span`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: bottom;
  
  @media (max-width: 480px) {
    max-width: 80px;
  }
`

function ellipsis(str: string, start = 6, end = 4) {
  if (!str) return ''
  if (str.length <= start + end) return str
  return str.slice(0, start) + '...' + str.slice(-end)
}

// Proposal fetcher function
async function getProposal(fromChainId: number, toChainId: number, data: string, depositNonce: string, txHash: string) {
  if (!fromChainId || !toChainId || !data || !depositNonce || !txHash) return

  try {
    const queryParams = new URLSearchParams({
      toChainId: toChainId.toString(),
      fromChainId: fromChainId.toString(),
      depositNonce,
      data
    })

    const response = await fetch(`https://bridge.w-chain.com/api/validator/proposal?${queryParams}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const res = await response.json()
    const { status, yesVotes } = res

    return { status, yesVotes, txHash }
  } catch (error) {
    console.error('Failed to fetch proposal:', error)
    return null
  }
}

export default function BridgeHistory() {
  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector((state: AppState) => state.transaction.transactions)
  const initialized = useSelector((state: AppState) => state.transaction.initialized)
  const [clearLoading, setClearLoading] = useState(false)
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Initialize transactions from localStorage on component mount
  useEffect(() => {
    if (!initialized) {
      dispatch(initializeTransactions())
    }
  }, [dispatch, initialized])

  // Auto-save transactions when they change (backup mechanism)
  useEffect(() => {
    if (initialized && transactions.length > 0) {
      try {
        localStorage.setItem('bridge_transactions', JSON.stringify(transactions))
      } catch (error) {
        console.error('Failed to backup transactions to localStorage:', error)
      }
    }
  }, [transactions, initialized])

  // Polling function for a single transaction
  const pollTransaction = useCallback(async (tx: BridgeTransaction) => {
    try {
      const result = await getProposal(
        tx.fromChainId,
        tx.toChainId,
        tx.data,
        tx.depositNonce,
        tx.txHash
      )

      if (result && result.status === 3) {
        dispatch(updateTransactionStatus({ txHash: tx.txHash, status: TransactionStatus.SUCCESS }))
        // Clear the interval for this transaction
        const intervalId = intervalRefs.current.get(tx.txHash)
        if (intervalId) {
          clearInterval(intervalId)
          intervalRefs.current.delete(tx.txHash)
        }
      }
    } catch (error) {
      console.error(`Error polling transaction ${tx.txHash}:`, error)
    }
  }, [dispatch])

  // Set up polling for pending transactions
  useEffect(() => {
    if (!initialized) return

    const pendingTxs = transactions.filter(
      tx => tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING
    )

    // Clear existing intervals for transactions that are no longer pending
    intervalRefs.current.forEach((intervalId, txHash) => {
      const stillPending = pendingTxs.some(tx => tx.txHash === txHash)
      if (!stillPending) {
        clearInterval(intervalId)
        intervalRefs.current.delete(txHash)
      }
    })

    // Set up new intervals for pending transactions
    pendingTxs.forEach(tx => {
      if (!intervalRefs.current.has(tx.txHash)) {
        const intervalId = setInterval(() => {
          pollTransaction(tx)
        }, 10000) // Poll every 10 seconds
        
        intervalRefs.current.set(tx.txHash, intervalId)
        
        // Also poll immediately
        pollTransaction(tx)
      }
    })

    // Cleanup function
    return () => {
      intervalRefs.current.forEach(intervalId => clearInterval(intervalId))
      intervalRefs.current.clear()
    }
  }, [transactions, initialized, pollTransaction])

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(intervalId => clearInterval(intervalId))
      intervalRefs.current.clear()
    }
  }, [])

  const pendingTransactions = transactions
    .filter(tx => tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  const completedTransactions = transactions
    .filter(tx =>
      tx.status === TransactionStatus.SUCCESS ||
      tx.status === TransactionStatus.FAILED ||
      tx.status === TransactionStatus.REJECTED
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleClearCompleted = useCallback(async () => {
    setClearLoading(true)
    dispatch(clearCompletedTransactions())
    await new Promise(res => setTimeout(res, 200))
    setClearLoading(false)
  }, [dispatch])

  // Show loading state while initializing
  if (!initialized) {
    return (
      <ModalCard>
        <EmptyText>Loading transaction history...</EmptyText>
      </ModalCard>
    )
  }

  return (
    <ModalCard>
      <div>
        <Section>
          <SectionTitle>Pending Transactions</SectionTitle>
          {pendingTransactions.length === 0 ? (
            <EmptyText>No pending transaction</EmptyText>
          ) : (
            pendingTransactions.map(tx => (
              <TxCard key={tx.txHash}>
                <StatusRow>
                  <StatusText status={tx.status}>
                    {tx.status === TransactionStatus.SUCCESS ? 'Success' : tx.status}
                    {(tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING) && (
                      <PollingIndicator title="Checking for updates..." />
                    )}
                  </StatusText>
                </StatusRow>
                <TxRow>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <TokenIcon src={getNetworkImage(getNetworkFromChainId(tx.fromChainId))} alt={tx.tokenSymbol} /> 
                    <span style={{ fontWeight: 600, color: '#043f84', fontSize: '13px', marginRight: '4px' }}>From: {getNetworkFromChainId(tx.fromChainId)}</span>
                    <Arrow>→</Arrow>
                    <TokenIcon src={getNetworkImage(getNetworkFromChainId(tx.toChainId))} alt={tx.tokenSymbol} /> 
                    <span style={{ fontWeight: 600, color: '#043f84', fontSize: '13px' }}>To: {getNetworkFromChainId(tx.toChainId)}</span>
                  </div>
                </TxRow>
                <TxDetails>
                  <DetailCol>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      <AmountBox>
                        <TokenIcon src={getTokenImage(tx.tokenSymbol as any)} alt={tx.tokenSymbol} />
                        {tx.amount} 
                        {tx.tokenSymbol}
                      </AmountBox>
                    </div>
                    <div style={{ fontSize: 13, color: '#222', marginTop: 4 }}>
                      Tx Hash: <Ellipsis>{ellipsis(tx.txHash)}</Ellipsis>
                    </div>
                  </DetailCol>
                  <DetailCol>
                    <div style={{ fontSize: 13, color: '#222' }}>
                      To: <Ellipsis>{ellipsis(tx.recipient)}</Ellipsis>
                    </div>
                    <div style={{ fontSize: 13, color: '#222', marginTop: 4 }}>
                      Time: <Ellipsis>{new Date(tx.timestamp).toLocaleString()}</Ellipsis>
                    </div>
                  </DetailCol>
                </TxDetails>
              </TxCard>
            ))
          )}
        </Section>
        <Divider />
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <SectionTitle>Completed Transactions</SectionTitle>
            {completedTransactions.length > 0 && (
              <ClearButton onClick={handleClearCompleted} disabled={clearLoading}>
                {clearLoading ? 'Clearing...' : 'Clear Completed'}
              </ClearButton>
            )}
          </div>
          <div style={{ maxHeight: 350, overflowY: 'auto' }}>
            {completedTransactions.length === 0 ? (
              <EmptyText>No completed transactions</EmptyText>
            ) : (
              completedTransactions.map(tx => (
                <TxCard key={tx.txHash}>
                  <StatusRow>
                    <StatusText status={tx.status}>
                      {tx.status === TransactionStatus.SUCCESS ? 'Success' : tx.status}
                      {(tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING) && (
                        <PollingIndicator title="Checking for updates..." />
                      )}
                    </StatusText>
                  </StatusRow>
                  <TxRow>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                      <TokenIcon src={getNetworkImage(getNetworkFromChainId(tx.fromChainId))} alt={tx.tokenSymbol} /> 
                      <span style={{ fontWeight: 600, color: '#043f84', fontSize: '13px', marginRight: '4px' }}>From: {getNetworkFromChainId(tx.fromChainId)}</span>
                      <Arrow>→</Arrow>
                      <TokenIcon src={getNetworkImage(getNetworkFromChainId(tx.toChainId))} alt={tx.tokenSymbol} /> 
                      <span style={{ fontWeight: 600, color: '#043f84', fontSize: '13px' }}>To: {getNetworkFromChainId(tx.toChainId)}</span>
                    </div>
                  </TxRow>
                  <TxDetails>
                    <DetailCol>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        <AmountBox>
                          <TokenIcon src={getTokenImage(tx.tokenSymbol as any)} alt={tx.tokenSymbol} />
                          {tx.amount} {' '}
                          {tx.tokenSymbol}
                        </AmountBox>
                      </div>
                      <div style={{ fontSize: 13, color: '#222', marginTop: 4 }}>
                        Tx Hash: {' '}
                        <a href={getExplorerTxUrl(tx.fromChainId)}><Ellipsis>{ellipsis(tx.txHash)}</Ellipsis></a>
                      </div>
                    </DetailCol>
                    <DetailCol>
                      <div style={{ fontSize: 13, color: '#222' }}>
                        To: <Ellipsis>{ellipsis(tx.recipient)}</Ellipsis>
                      </div>
                      <div style={{ fontSize: 13, color: '#222', marginTop: 4 }}>
                        Time: <Ellipsis>{new Date(tx.timestamp).toLocaleString()}</Ellipsis>
                      </div>
                    </DetailCol>
                  </TxDetails>
                </TxCard>
              ))
            )}
          </div>
        </Section>
      </div>
    </ModalCard>
  )
}
