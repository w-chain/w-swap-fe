import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { WAVE_FARM_URL, WCO_ECOSYSTEM_URL } from '../../constants/ecosystemLinks'

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
  flex-wrap: nowrap;
  overflow-x: auto;
  max-width: min(720px, 55vw);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 8px;
    max-width: calc(100vw - 180px);
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: calc(100vw - 120px);
  `};
`

const navPillCss = `
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  color: #5c6a78;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover,
  &:focus {
    color: #0e9a86;
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

const NAV_LINKS: (InternalLink | ExternalLink)[] = [
  { kind: 'internal', to: '/', key: 'home', label: 'Home', exact: true, match: p => p === '/' },
  { kind: 'internal', to: '/swap', key: 'swap', label: 'Swap', match: p => p.startsWith('/swap') },
  {
    kind: 'internal',
    to: '/pool',
    key: 'pool',
    label: 'Pool',
    match: p => p === '/pool' || p.startsWith('/add') || p.startsWith('/remove') || p === '/find'
  },
  { kind: 'internal', to: '/portfolio', key: 'portfolio', label: 'Portfolio', match: p => p === '/portfolio' },
  { kind: 'internal', to: '/bridge', key: 'bridge', label: 'Bridge', match: p => p === '/bridge' },
  { kind: 'external', href: WCO_ECOSYSTEM_URL, key: 'wco', label: 'WCO' },
  { kind: 'external', href: WAVE_FARM_URL, key: 'waveFarm', label: 'Wave Farm' }
]

export default function AppNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const labelFor = (item: InternalLink | ExternalLink) => {
    if (item.key === 'home') return 'Home'
    if (item.key === 'portfolio') return t('portfolio')
    if (item.key === 'swap' || item.key === 'pool' || item.key === 'bridge') return t(item.key)
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
