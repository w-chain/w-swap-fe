import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  gap: 16px;
  position: relative;
  z-index: 2;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})<{ disabled?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-decoration: none;
  width: 80px;
  height: 24px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  border: 1px solid #e4ddd2;
  background: #fff;
  color: ${({ disabled }) => (disabled ? '#00000040' : '#5c6a78')};

  &.${activeClassName} {
    border: 1px solid transparent;
    background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #12b39c, #2f6fed);
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #0e9a86;
  }

  :hover,
  :focus {
    color: ${({ disabled }) => (disabled ? '#00000040' : '#0e9a86')};
  }
`

const ActiveText = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #043f84;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active, landing }: { active: 'swap' | 'pool' | 'bridge'; landing?: boolean }) {
  const { t } = useTranslation()
  return (
    <div style={{ position: 'relative' }}>
      <Tabs style={{ marginBottom: '24px', zIndex: 2 }}>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'} disabled={landing}>
          {t('swap')}
        </StyledNavLink>
        <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'} disabled={landing}>
          {t('pool')}
        </StyledNavLink>
        <StyledNavLink id={`bridge-nav-link`} to={'/bridge'} isActive={() => active === 'bridge'} disabled={landing}>
          {t('bridge')}
        </StyledNavLink>
      </Tabs>
    </div>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
