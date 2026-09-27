import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { injected, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'

import Identicon from '../Identicon'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)<{ $ecosystem?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  width: ${({ $ecosystem }) => ($ecosystem ? 'auto' : '100%')};
  align-items: center;
  padding: ${({ $ecosystem }) => ($ecosystem ? '0.35rem 0.55rem' : '0.5rem')};
  border-radius: ${({ $ecosystem }) => ($ecosystem ? '8px' : '12px')};
  cursor: pointer;
  user-select: none;
  border: ${({ $ecosystem }) => ($ecosystem ? 'none' : undefined)};
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

// background: #B4DAFE;
// box-shadow: inset -2px -2px 4px rgba(4, 63, 132, 0.2);
// border-radius: 7px;

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean; $ecosystem?: boolean }>`
  background-color: ${({ theme, $ecosystem }) => ($ecosystem ? 'transparent' : theme.primary1)};
  background-image: ${({ $ecosystem }) =>
    $ecosystem ? 'linear-gradient(90deg, #12b39c 0%, #3b82f6 100%)' : 'none'};
  border: none;
  color: ${({ theme, $ecosystem }) => ($ecosystem ? '#060a0d' : theme.primaryText1)};
  font-weight: ${({ $ecosystem }) => ($ecosystem ? 600 : 500)};
  box-shadow: ${({ $ecosystem }) => ($ecosystem ? 'none' : 'inset -2px -2px 4px rgba(4, 63, 132, 0.2)')};

  :hover,
  :focus {
    border: ${({ $ecosystem, theme }) => ($ecosystem ? 'none' : `1px solid ${darken(0.05, theme.primary1)}`)};
    color: ${({ theme, $ecosystem }) => ($ecosystem ? '#060a0d' : theme.primaryText1)};
    filter: ${({ $ecosystem }) => ($ecosystem ? 'brightness(0.97)' : 'none')};
  }

  ${({ faded, $ecosystem }) =>
    faded &&
    !$ecosystem &&
    css`
      background-color: ${({ theme }) => theme.primary2};
      border: 1px solid ${({ theme }) => theme.primary2};
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary1)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean; $ecosystem?: boolean }>`
  color: ${({ $ecosystem }) => ($ecosystem ? '#060a0d' : 'white')};
  background-color: ${({ $ecosystem }) => ($ecosystem ? 'transparent' : 'rgba(4, 63, 132, 0.2)')};
  background-image: ${({ $ecosystem }) =>
    $ecosystem ? 'linear-gradient(90deg, #12b39c 0%, #3b82f6 100%)' : 'none'};
  box-shadow: ${({ $ecosystem }) => ($ecosystem ? 'none' : 'inset -2px -2px 4px rgba(4, 63, 132, 0.2)')};
  border-radius: ${({ $ecosystem }) => ($ecosystem ? '8px' : '7px')};

  font-weight: ${({ $ecosystem }) => ($ecosystem ? 600 : 500)};
  :hover,
  :focus {
    background-color: ${({ $ecosystem }) => ($ecosystem ? 'transparent' : 'rgba(4, 63, 132, 0.4)')};
    background-image: ${({ $ecosystem }) =>
      $ecosystem ? 'linear-gradient(90deg, #12b39c 0%, #3b82f6 100%)' : 'none'};
    box-shadow: ${({ $ecosystem }) => ($ecosystem ? 'none' : 'inset -2px -2px 4px rgba(4, 63, 132, 0.4)')};
    filter: ${({ $ecosystem }) => ($ecosystem ? 'brightness(0.97)' : 'none')};
  }

  ${({ $ecosystem }) =>
    $ecosystem &&
    css`
      &:hover,
      &:focus {
        color: #060a0d;
      }
    `}
`

const Text = styled.p<{ $ecosystem?: boolean }>`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.35rem 0 0.15rem;
  font-size: ${({ $ecosystem }) => ($ecosystem ? '14px' : '1rem')};
  width: fit-content;
  font-weight: 600;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner({ ecosystem }: { ecosystem?: boolean }) {
  const { t } = useTranslation()
  const { account, connector, error } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
        $ecosystem={ecosystem}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text $ecosystem={ecosystem}>{pending?.length} Pending</Text>{' '}
            <Loader stroke={ecosystem ? '#060a0d' : 'white'} />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            <Text $ecosystem={ecosystem}>{ENSName || shortenAddress(account)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account} $ecosystem={ecosystem}>
        <Text $ecosystem={ecosystem}>{t('Connect Wallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status({ ecosystem }: { ecosystem?: boolean }) {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner ecosystem={ecosystem} />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
