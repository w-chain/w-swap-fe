import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { usesEcosystemTheme } from '../../utils/ecosystemTheme'
import { HeaderAccountShell, HeaderBalanceText } from '../ecosystem/styled'

import styled from 'styled-components'

import { W_CHAIN_SITE_URL } from '../../constants/ecosystemLinks'
import { useActiveWeb3React } from '../../hooks'
import { usePreferredChain } from '../../hooks/usePreferredChain'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import NetworkSelector from '../NetworkSelector'

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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  min-height: 80px;
  padding: 0 24px;

  @media (min-width: 768px) {
    padding: 0 100px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-height: 0;
    padding-top: 12px;
    padding-bottom: 10px;
  `};
`

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
  margin-right: 8px;

  @media (min-width: 768px) {
    margin-right: 0;
  }
`

const NavArea = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  padding-left: 32px;

  @media (min-width: 768px) {
    padding-left: 48px;
  }

  @media (min-width: 1024px) {
    padding-left: 56px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 1 1 100%;
    order: 3;
    padding-left: 0;
    border-top: 1px solid rgba(228, 221, 210, 0.5);
    padding-top: 10px;
    overflow: visible;
  `};
`

const ControlsArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  flex-shrink: 0;
`

const LogoLink = styled.a`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 0;
  pointer-events: auto;

  &:hover {
    opacity: 0.92;
  }
`

const LogoImg = styled.img`
  width: 62px;
  height: auto;
  display: block;
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
  usePreferredChain()
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
          <LogoLink
            href={W_CHAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="W Chain home"
          >
            <LogoImg
              src={`${W_CHAIN_SITE_URL}/images/logo-w-chain.png`}
              alt="W Chain"
              width={62}
              height={34}
            />
          </LogoLink>
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
