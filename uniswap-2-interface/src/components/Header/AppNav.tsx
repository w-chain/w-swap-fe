import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { WAVE_FARM_URL } from '../../constants/ecosystemLinks'
import { getLandingWidgetTab } from '../../utils/landingWidgetTab'

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 36px;
  margin-left: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-padding: 12px;
  padding: 2px 0 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 24px;
    padding-bottom: 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    mask-image: linear-gradient(to right, transparent, #000 12px, #000 calc(100% - 12px), transparent);
  `};
`

const navLinkCss = `
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
  text-decoration: none;
  color: #5c6a78;
  white-space: nowrap;
  flex-shrink: 0;
  touch-action: manipulation;
  transition: color 0.15s ease;

  &:hover,
  &:focus {
    color: #1a2430;
  }
`

const activeClassName = 'APP_NAV_ACTIVE'

const NavItem = styled(NavLink).attrs({ activeClassName })`
  ${navLinkCss}

  &.${activeClassName} {
    color: #1a2430;
    font-weight: 600;
  }
`

const ExternalNavItem = styled.a`
  ${navLinkCss}
`

type InternalLink = {
  kind: 'internal'
  to: string | { pathname: string; search?: string; hash?: string }
  key: string
  label: string
  isActive?: (pathname: string, search: string) => boolean
}

type ExternalLink = {
  kind: 'external'
  href: string
  key: string
  label: string
}

const NAV_LINKS: (InternalLink | ExternalLink)[] = [
  {
    kind: 'internal',
    to: { pathname: '/', search: '' },
    key: 'home',
    label: 'Home',
    isActive: (pathname, search) => pathname === '/' && getLandingWidgetTab(search) === null
  },
  {
    kind: 'internal',
    to: '/portfolio',
    key: 'portfolio',
    label: 'Portfolio',
    isActive: pathname => pathname === '/portfolio'
  },
  {
    kind: 'internal',
    to: { pathname: '/', search: '?tab=swap' },
    key: 'swap',
    label: 'SWAP',
    isActive: (pathname, search) => pathname === '/' && getLandingWidgetTab(search) === 'swap'
  },
  {
    kind: 'internal',
    to: { pathname: '/', search: '?tab=bridge' },
    key: 'bridge',
    label: 'Bridge',
    isActive: (pathname, search) => pathname === '/' && getLandingWidgetTab(search) === 'bridge'
  },
  { kind: 'external', href: WAVE_FARM_URL, key: 'waveFarm', label: 'Wave Farm' }
]

export default function AppNav() {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()

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
              title={`Open ${item.label}`}
            >
              {labelFor(item)}
            </ExternalNavItem>
          )
        }

        return (
          <NavItem
            key={item.key}
            to={item.to}
            isActive={() => (item.isActive ? item.isActive(pathname, search) : pathname === item.to)}
          >
            {labelFor(item)}
          </NavItem>
        )
      })}
    </Nav>
  )
}
