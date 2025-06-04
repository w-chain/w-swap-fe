import React from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { BridgeTransaction } from '../../state/bridge/types'
import { NETWORK_LABELS } from '../../constants/bridge/network'

const HistoryContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.bg2};

  &:last-child {
    border-bottom: none;
  }
`

const StatusBadge = styled.div<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'PENDING':
        return theme.yellow1
      case 'AWAITING':
        return theme.yellow2
      case 'COMPLETED':
        return theme.green1
      case 'FAILED':
        return theme.red1
      default:
        return theme.bg2
    }
  }};
  color: ${({ theme }) => theme.text1};
`

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`
  return `${Math.floor(seconds / 31536000)} years ago`
}

interface TransactionHistoryProps {
  transactions: BridgeTransaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <HistoryContainer>
      <AutoColumn gap="20px">
        <TYPE.largeHeader>Transaction History</TYPE.largeHeader>
        {transactions.length === 0 ? (
          <TYPE.body>No transactions yet</TYPE.body>
        ) : (
          transactions.map(tx => (
            <TransactionRow key={tx.txHash}>
              <AutoColumn gap="4px">
                <TYPE.body>
                  {tx.amount} {tx.tokenSymbol}
                </TYPE.body>
                <TYPE.body>
                  From {NETWORK_LABELS[tx.fromChainId as keyof typeof NETWORK_LABELS]} to{' '}
                  {NETWORK_LABELS[tx.toChainId as keyof typeof NETWORK_LABELS]}
                </TYPE.body>
                <TYPE.body>{formatTimeAgo(tx.timestamp)}</TYPE.body>
              </AutoColumn>
              <StatusBadge status={tx.status}>{tx.status}</StatusBadge>
            </TransactionRow>
          ))
        )}
      </AutoColumn>
    </HistoryContainer>
  )
}
