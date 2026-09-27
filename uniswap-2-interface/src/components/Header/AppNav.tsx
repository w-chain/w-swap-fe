import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { WAVE_FARM_URL, WCO_ECOSYSTEM_URL } from '../../constants/ecosystemLinks'

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-padding: 12px;
  padding: 2px 4px 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 10px;
    padding-bottom: 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    mask-image: linear-gradient(to right, transparent, #000 12px, #000 calc(100% - 12px), transparent);
  `};
`

const navPillCss = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  color: #5c6a78;
  white-space: nowrap;
  flex-shrink: 0;
  touch-action: manipulation;

  &:hover,
  &:focus {
    color: #0e9a86;
  }

  @media (pointer: coarse) {
    min-height: 44px;
    padding: 10px 16px;
  }
`

const activeClassName = 'APP_NAV_ACTIVE'

const NavItem = styled(NavLink).attrs({ activeClassName })`
  ${navPillCss}

  &.${activeClassName} {
    border-color: transparent;
    background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #12b39c, #2f6fed);
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #0e9a86;
  }
`

const ExternalNavItem = styled.a`
  ${navPillCss}
`

type InternalLink = {
  kind: 'internal'
  to: string
  key: string
  label: string
  match?: (path: string) => boolean
  exact?: boolean
}

type ExternalLink = {
  kind: 'external'
  href: string
  key: string
  label: string
}

const W_CHAIN_HOME_URL = 'https://w-chain.com'

const NAV_LINKS: (InternalLink | ExternalLink)[] = [
  { kind: 'external', href: W_CHAIN_HOME_URL, key: 'wChainHome', label: 'W Chain home' },
  { kind: 'internal', to: '/portfolio', key: 'portfolio', label: 'Portfolio', match: p => p === '/portfolio' },
  { kind: 'external', href: WCO_ECOSYSTEM_URL, key: 'wco', label: 'WCO' },
  { kind: 'external', href: WAVE_FARM_URL, key: 'waveFarm', label: 'Wave Farm' }
]

export default function AppNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const labelFor = (item: InternalLink | ExternalLink) => {
    if (item.key === 'portfolio') return t('portfolio')
    return item.label
  }

  return (
    <Nav aria-label="Main">
      {NAV_LINKS.map(item => {
        if (item.kind === 'external') {
          return (
            <ExternalNavItem
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${item.label} (W Chain)`}
            >
              {labelFor(item)}
            </ExternalNavItem>
          )
        }

        return (
          <NavItem
            key={item.key}
            to={item.to}
            isActive={() => (item.match ? item.match(pathname) : pathname === item.to)}
            exact={item.exact}
          >
            {labelFor(item)}
          </NavItem>
        )
      })}
    </Nav>
  )
}
