import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { AppState, AppDispatch } from '../../../state'
import { clearCompletedTransactions } from '../stores/Transaction'
import { TransactionStatus, Networks } from '../shared/types/enums'
import { getTokenImage } from '../shared/utils'

const ModalCard = styled.div`
  padding: 0;
  position: relative;
  width: 100%;
  padding-top: 10px;
  min-width: 480px;
`

const Section = styled.div`
  margin-bottom: 32px;
`
const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #043f84;
  margin-bottom: 18px;
`
const EmptyText = styled.div`
  text-align: center;
  color: #585858;
  padding: 24px 0;
  font-size: 14px;
  font-weight: 600;
`
const ClearButton = styled.button`
  border: 1px solid #b4dafe;
  background: #fff;
  color: #1976d2;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 12px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  height: 1px;
  background: #c7e0fa;
  margin: 24px 0 24px 0;
`

const TxCard = styled.div`
  background: #c7e0fa;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(4, 63, 132, 0.08);
  padding: 20px 24px 16px 24px;
  margin-bottom: 24px;
  transition: box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:hover {
    box-shadow: 0 6px 24px rgba(4, 63, 132, 0.16);
  }
`

const TxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const ChainIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  margin-right: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`

const Arrow = styled.span`
  font-size: 22px;
  margin: 0 8px;
  color: #043f84;
`

const StatusText = styled.div<{ status: TransactionStatus }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ status }) =>
    status === TransactionStatus.SUCCESS
      ? '#1dbf73'
      : status === TransactionStatus.FAILED || status === TransactionStatus.REJECTED
      ? '#e74c3c'
      : '#888'};
  margin-left: auto;
`

const TxDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 8px;
  font-size: 16px;
`

const DetailCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
`

const TokenIcon = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  margin-right: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`

const AmountBox = styled.div`
  display: flex;
  align-items: center;
  background: #eaf4fb;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 700;
  font-size: 18px;
  margin-right: 8px;
`

const AddTokenButton = styled.button`
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-left: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`

const Ellipsis = styled.span`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: bottom;
`

const Pagination = styled.div`
  text-align: center;
  color: #043f84;
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
  letter-spacing: 2px;
`

function getNetworkIcon(chainId: number) {
  // Replace with your getNetworkImage utility if available
  if (chainId === 1) return '🟦' // ETH placeholder
  if (chainId === 56) return '🟨' // BSC placeholder
  if (chainId === 171717) return '🟦' // W Chain placeholder
  return '🌐'
}

function getNetworkName(chainId: number) {
  // Map chainId to Networks enum value, fallback to chainId
  const entry = Object.entries(Networks).find(([, value]) => Number(value) === chainId)
  return entry ? entry[0] : chainId
}

function ellipsis(str: string, start = 6, end = 4) {
  if (!str) return ''
  if (str.length <= start + end) return str
  return str.slice(0, start) + '...' + str.slice(-end)
}

export default function BridgeHistory() {
  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector((state: AppState) => state.transaction.transactions)
  const [clearLoading, setClearLoading] = useState(false)

  const pendingTransactions = transactions.filter(
    tx => tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING
  )
  const completedTransactions = transactions.filter(
    tx =>
      tx.status === TransactionStatus.SUCCESS ||
      tx.status === TransactionStatus.FAILED ||
      tx.status === TransactionStatus.REJECTED
  )

  const handleClearCompleted = useCallback(async () => {
    setClearLoading(true)
    dispatch(clearCompletedTransactions())
    await new Promise(res => setTimeout(res, 200))
    setClearLoading(false)
  }, [dispatch])

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
                <TxRow>
                  <ChainIcon>{getNetworkIcon(tx.fromChainId)}</ChainIcon>
                  <span style={{ fontWeight: 600, color: '#043f84' }}>From: {getNetworkName(tx.fromChainId)}</span>
                  <Arrow>→</Arrow>
                  <ChainIcon>{getNetworkIcon(tx.toChainId)}</ChainIcon>
                  <span style={{ fontWeight: 600, color: '#043f84' }}>To: {getNetworkName(tx.toChainId)}</span>
                  <StatusText status={tx.status}>
                    {tx.status === TransactionStatus.SUCCESS ? 'Transaction Successful' : tx.status}
                  </StatusText>
                </TxRow>
                <TxDetails>
                  <DetailCol>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <AmountBox>
                        {tx.amount} <TokenIcon src={getTokenImage(tx.tokenSymbol as any)} alt={tx.tokenSymbol} />{' '}
                        {tx.tokenSymbol}
                      </AmountBox>
                      <AddTokenButton>
                        Add token{' '}
                        <span role="img" aria-label="add">
                          ➕
                        </span>
                      </AddTokenButton>
                    </div>
                    <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>
                      Deposit Tx Hash <Ellipsis>{ellipsis(tx.txHash)}</Ellipsis>
                    </div>
                  </DetailCol>
                  <DetailCol>
                    <div style={{ fontSize: 15, color: '#222' }}>
                      Recipient <Ellipsis>{ellipsis(tx.recipient)}</Ellipsis>
                    </div>
                    <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>
                      Deposit Time <Ellipsis>{new Date(tx.timestamp).toLocaleString()}</Ellipsis>
                    </div>
                  </DetailCol>
                </TxDetails>
              </TxCard>
            ))
          )}
        </Section>
        <Divider />
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle>Completed Transactions</SectionTitle>
            {/* <ClearButton onClick={handleClearCompleted} disabled={clearLoading}>
              {clearLoading ? 'Clearing...' : 'Clear Completed Txs'}
            </ClearButton> */}
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {completedTransactions.length === 0 ? (
              <EmptyText>No completed transactions</EmptyText>
            ) : (
              completedTransactions.map(tx => (
                <TxCard key={tx.txHash}>
                  <TxRow>
                    <ChainIcon>{getNetworkIcon(tx.fromChainId)}</ChainIcon>
                    <span style={{ fontWeight: 600, color: '#043f84' }}>From: {getNetworkName(tx.fromChainId)}</span>
                    <Arrow>→</Arrow>
                    <ChainIcon>{getNetworkIcon(tx.toChainId)}</ChainIcon>
                    <span style={{ fontWeight: 600, color: '#043f84' }}>To: {getNetworkName(tx.toChainId)}</span>
                    <StatusText status={tx.status}>
                      {tx.status === TransactionStatus.SUCCESS ? 'Transaction Successful' : tx.status}
                    </StatusText>
                  </TxRow>
                  <TxDetails>
                    <DetailCol>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AmountBox>
                          {tx.amount} <TokenIcon src={getTokenImage(tx.tokenSymbol as any)} alt={tx.tokenSymbol} />{' '}
                          {tx.tokenSymbol}
                        </AmountBox>
                        <AddTokenButton>
                          Add token{' '}
                          <span role="img" aria-label="add">
                            ➕
                          </span>
                        </AddTokenButton>
                      </div>
                      <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>
                        Deposit Tx Hash <Ellipsis>{ellipsis(tx.txHash)}</Ellipsis>
                      </div>
                    </DetailCol>
                    <DetailCol>
                      <div style={{ fontSize: 15, color: '#222' }}>
                        Recipient <Ellipsis>{ellipsis(tx.recipient)}</Ellipsis>
                      </div>
                      <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>
                        Deposit Time <Ellipsis>{new Date(tx.timestamp).toLocaleString()}</Ellipsis>
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
