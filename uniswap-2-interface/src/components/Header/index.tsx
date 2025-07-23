import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../Logo'
import WChainLogo from '../../assets/svg/wadz-chain-logo.png'
import Wordmark from '../../assets/svg/wordmark.svg'
import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { getNativeTokenSymbol } from '../../utils/getNativeTokenSymbol'


const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: sticky;
  z-index: 10;
  padding-bottom: 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-right: 10px;
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.primary2)};
  box-shadow: inset -2px -2px 4px rgba(4, 63, 132, 0.2);

  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 600;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};

  @media (max-width: 768px) {
    img {
      width: 3.5rem;
    }
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
  color: ${({ theme }) => theme.primaryText1};
`

const NETWORK_IMAGE: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: '/images/networks/eth.webp',
  [ChainId.WCHAIN]: '/images/networks/w-chain.webp',
  [ChainId.WCHAIN_TESTNET]: '/images/networks/w-chain.webp',
  [ChainId.BNB]: '/images/networks/bsc.webp'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <UniIcon>
              <img src={WChainLogo} alt="logo" />
            </UniIcon>
            <TitleText>
              <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
            </TitleText>
          </Title>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_IMAGE[chainId] && (
                <StyledLogo srcs={[NETWORK_IMAGE[chainId] ?? '']} size="32px" />
              )}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={600}>
                  {userEthBalance?.toSignificant(4)} {getNativeTokenSymbol(chainId)}
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
            <Settings />
          </HeaderElement>
          {/* <HeaderElementWrap>
            <VersionSwitch />
            <Settings />
            <Menu />
          </HeaderElementWrap> */}
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
