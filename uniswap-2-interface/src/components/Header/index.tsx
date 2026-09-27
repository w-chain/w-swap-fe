import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { usesEcosystemTheme } from '../../utils/ecosystemTheme'
import { HeaderAccountShell, HeaderBalanceText } from '../ecosystem/styled'

import styled from 'styled-components'

import WChainLogo from '../../assets/svg/wadz-chain-logo.png'
import Wordmark from '../../assets/svg/wordmark.svg'
import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import NetworkSelector from '../NetworkSelector'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { getNativeTokenSymbol } from '../../utils/getNativeTokenSymbol'
import AppNav from './AppNav'


const HeaderFrame = styled.div<{ $landing?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: sticky;
  z-index: 10;
  padding-bottom: 0.5rem;
  padding-top: env(safe-area-inset-top, 0);
  background: ${({ $landing }) => ($landing ? 'rgba(246, 243, 236, 0.92)' : 'rgba(255, 255, 255, 0.92)')};
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-bottom: 1px solid rgba(228, 221, 210, 0.65);
`

const HeaderInner = styled.div`
  display: grid;
  width: 100%;
  align-items: center;
  column-gap: 12px;
  row-gap: 0;
  padding: 0.65rem 12px 10px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas: 'logo nav controls';

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'logo controls'
      'nav nav';
    row-gap: 10px;
    padding-top: 0.65rem;
    border-bottom: none;
  `};

  @media (min-width: 961px) {
    padding: 0.75rem 1rem 10px;
  }
`

const LogoArea = styled.div`
  grid-area: logo;
  display: flex;
  align-items: center;
  min-width: 0;
`

const NavArea = styled.div`
  grid-area: nav;
  min-width: 0;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-top: 1px solid rgba(228, 221, 210, 0.5);
    padding-top: 10px;
    overflow: visible;
  `};
`

const ControlsArea = styled.div`
  grid-area: controls;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BalanceText = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
  color: ${({ theme }) => theme.primaryText1};
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
`

const NETWORK_IMAGE: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: '/images/networks/eth.webp',
  [ChainId.WCHAIN]: '/images/networks/w-chain.webp',
  [ChainId.WCHAIN_TESTNET]: '/images/networks/w-chain.webp',
  [ChainId.BNB]: '/images/networks/bsc.webp'
}

const NetworkSelectorWrapper = styled.div`
  margin-right: 10px;
  pointer-events: auto;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 0;
    margin-left: 0;
  `};
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { pathname } = useLocation()
  const ecosystemTheme = usesEcosystemTheme(pathname)
  const isLanding = ecosystemTheme && pathname === '/'

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame $landing={isLanding}>
      <HeaderInner>
        <LogoArea>
          <Title href=".">
            <UniIcon>
              <img src={WChainLogo} alt="logo" />
            </UniIcon>
            <TitleText>
              <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
            </TitleText>
          </Title>
        </LogoArea>
        <NavArea>
          <AppNav />
        </NavArea>
        <ControlsArea>
          <NetworkSelectorWrapper>
            <NetworkSelector compactOnMobile />
          </NetworkSelectorWrapper>
          <RightSection>
            {ecosystemTheme ? (
              <HeaderAccountShell style={{ pointerEvents: 'auto' }}>
                {account && userEthBalance ? (
                  <HeaderBalanceText>
                    {userEthBalance?.toSignificant(4)} {getNativeTokenSymbol(chainId)}
                  </HeaderBalanceText>
                ) : null}
                <Web3Status ecosystem />
              </HeaderAccountShell>
            ) : (
              <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && userEthBalance ? (
                  <BalanceText>
                    {userEthBalance?.toSignificant(4)} {getNativeTokenSymbol(chainId)}
                  </BalanceText>
                ) : null}
                <Web3Status />
              </AccountElement>
            )}
            <Settings ecosystem={ecosystemTheme} />
          </RightSection>
        </ControlsArea>
      </HeaderInner>
    </HeaderFrame>
  )
}
