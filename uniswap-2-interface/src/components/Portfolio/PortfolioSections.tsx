import { ChainId, Token, TokenAmount } from '@uniswap/sdk'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { fetchOracleTokenPrice } from '../../data/wSwapOracle'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { useLiquidityPortfolioAnalytics } from '../../hooks/useLiquidityPortfolioAnalytics'
import { useAllTokenBalances, useETHBalances } from '../../state/wallet/hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { getEtherscanLink, shortenAddress } from '../../utils'
import { formatUsd } from '../../utils/formatUsd'
import { getNativeTokenSymbol } from '../../utils/getNativeTokenSymbol'
import CurrencyLogo from '../CurrencyLogo'
import Transaction from '../AccountDetails/Transaction'
import Copy from '../AccountDetails/Copy'
import { RowBetween } from '../Row'
import {
  EcosystemMessageCard,
  EcosystemPrimaryButton,
  EcosystemSection
} from '../ecosystem/styled'
import { ExternalLink, StyledInternalLink } from '../../theme'
import { Pair } from '@uniswap/sdk'

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
`

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 12px 14px;
`

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e4ddd2;
  &:last-child {
    border-bottom: none;
  }
`

export function PortfolioWalletSummary({ pairs }: { pairs: Pair[] }) {
  const { account, chainId } = useActiveWeb3React()
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const analytics = useLiquidityPortfolioAnalytics(pairs)

  if (!account) {
    return <EcosystemMessageCard>Connect your wallet to view portfolio summary.</EcosystemMessageCard>
  }

  return (
    <EcosystemSection>
      <RowBetween padding="0 4px">
        <Text color="#1a2430" fontWeight={600} fontSize={14}>
          Wallet
        </Text>
        <ExternalLink href={getEtherscanLink(chainId ?? ChainId.WCHAIN, account, 'address')}>
          {shortenAddress(account)} ↗
        </ExternalLink>
      </RowBetween>
      <StatGrid>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            NATIVE BALANCE
          </Text>
          <Text fontSize={18} fontWeight={700} color="#1a2430" mt="4px">
            {ethBalance ? `${ethBalance.toSignificant(4)} ${getNativeTokenSymbol(chainId)}` : '—'}
          </Text>
        </StatCard>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            LP VALUE (EST.)
          </Text>
          <Text fontSize={18} fontWeight={700} color="#1a2430" mt="4px">
            {analytics.loading ? '…' : formatUsd(analytics.totalPositionValueUsd)}
          </Text>
        </StatCard>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            LP POSITIONS
          </Text>
          <Text fontSize={18} fontWeight={700} color="#1a2430" mt="4px">
            {analytics.positionCount}
          </Text>
        </StatCard>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            EST. 24H FEES
          </Text>
          <Text fontSize={18} fontWeight={700} color="#1a2430" mt="4px">
            {analytics.loading ? '…' : formatUsd(analytics.totalFeesUsd24h)}
          </Text>
        </StatCard>
      </StatGrid>
      <Copy toCopy={account}>Copy address</Copy>
    </EcosystemSection>
  )
}

export function PortfolioMarketPrices() {
  const { chainId } = useActiveWeb3React()
  const [wco, setWco] = useState<number | null | undefined>()
  const [wave, setWave] = useState<number | null | undefined>()

  useEffect(() => {
    if (chainId !== ChainId.WCHAIN) {
      setWco(undefined)
      setWave(undefined)
      return
    }
    let cancelled = false
    Promise.all([fetchOracleTokenPrice('wco'), fetchOracleTokenPrice('wave')])
      .then(([wcoRes, waveRes]) => {
        if (cancelled) return
        setWco(wcoRes.price)
        setWave(waveRes.price)
      })
      .catch(() => {
        if (!cancelled) {
          setWco(null)
          setWave(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [chainId])

  if (chainId !== ChainId.WCHAIN) return null

  return (
    <EcosystemSection>
      <Text color="#1a2430" fontWeight={600} fontSize={14} padding="0 4px">
        Market (W Oracle)
      </Text>
      <StatGrid>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            WCO / USD
          </Text>
          <Text fontSize={16} fontWeight={700} color="#1a2430" mt="4px">
            {wco === undefined ? '…' : wco == null ? '—' : `$${wco.toPrecision(4)}`}
          </Text>
        </StatCard>
        <StatCard>
          <Text fontSize={11} fontWeight={600} color="#5c6a78">
            WAVE / USD
          </Text>
          <Text fontSize={16} fontWeight={700} color="#1a2430" mt="4px">
            {wave === undefined ? '…' : wave == null ? '—' : `$${wave.toPrecision(4)}`}
          </Text>
        </StatCard>
      </StatGrid>
    </EcosystemSection>
  )
}

export function PortfolioTokenBalances() {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const balances = useAllTokenBalances()

  const rows = useMemo(() => {
    const list: { token: Token; amount: TokenAmount }[] = []
    Object.values(allTokens).forEach(token => {
      const bal = balances[token.address]
      if (bal && bal.greaterThan('0')) {
        list.push({ token, amount: bal })
      }
    })
    return list.sort((a, b) => parseFloat(b.amount.toExact()) - parseFloat(a.amount.toExact())).slice(0, 12)
  }, [allTokens, balances])

  if (!account) return null

  return (
    <EcosystemSection>
      <Text color="#1a2430" fontWeight={600} fontSize={14} padding="0 4px">
        Token balances
      </Text>
      {rows.length === 0 ? (
        <EcosystemMessageCard>No token balances in the default list.</EcosystemMessageCard>
      ) : (
        rows.map(({ token, amount }) => (
          <TokenRow key={token.address}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CurrencyLogo currency={token} size="24px" />
              <Text fontWeight={600} color="#1a2430">
                {token.symbol}
              </Text>
            </div>
            <Text fontWeight={600} color="#1a2430">
              {amount.toSignificant(6)}
            </Text>
          </TokenRow>
        ))
      )}
    </EcosystemSection>
  )
}

export function PortfolioActivity() {
  const { account } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const recent = useMemo(() => {
    return Object.keys(allTransactions)
      .filter(hash => allTransactions[hash]?.from?.toLowerCase() === account?.toLowerCase())
      .sort((a, b) => (allTransactions[b]?.addedTime ?? 0) - (allTransactions[a]?.addedTime ?? 0))
      .slice(0, 8)
  }, [allTransactions, account])

  if (!account) return null

  return (
    <EcosystemSection>
      <Text color="#1a2430" fontWeight={600} fontSize={14} padding="0 4px">
        Recent activity
      </Text>
      {recent.length === 0 ? (
        <EcosystemMessageCard>Swaps and liquidity txs from this session appear here.</EcosystemMessageCard>
      ) : (
        recent.map(hash => <Transaction key={hash} hash={hash} />)
      )}
    </EcosystemSection>
  )
}

export function PortfolioQuickActions() {
  return (
    <StatGrid style={{ marginBottom: 8 }}>
      <EcosystemPrimaryButton as={Link} to="/swap">
        Swap
      </EcosystemPrimaryButton>
      <EcosystemPrimaryButton as={Link} to="/add/ETH">
        Add liquidity
      </EcosystemPrimaryButton>
      <EcosystemPrimaryButton as={Link} to="/bridge">
        Bridge
      </EcosystemPrimaryButton>
      <EcosystemPrimaryButton as={Link} to="/find">
        Import pool
      </EcosystemPrimaryButton>
    </StatGrid>
  )
}

export function PortfolioImportHint() {
  return (
    <Text textAlign="center" fontSize={14} fontWeight={500} color="#5c6a78" style={{ padding: '.25rem 0' }}>
      Missing a position?{' '}
      <StyledInternalLink to="/find">Import a pool</StyledInternalLink> or{' '}
      <StyledInternalLink to="/pool">manage on Pool</StyledInternalLink>
    </Text>
  )
}
