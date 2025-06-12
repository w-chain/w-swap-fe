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
  border-radius: 3rem;
  justify-content: space-evenly;
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
  color: ${({ disabled }) => (disabled ? '#00000040' : '#00000080')};
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Montserrat;
  padding: 6px 32px;
  border-radius: 12px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &.${activeClassName} {
    color: #043f84;
    background: #b4dafe;
  }

  :hover,
  :focus {
    color: ${({ disabled }) => (disabled ? '#00000040' : '#043f84')};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active, landing }: { active: 'swap' | 'pool' | 'bridge'; landing?: boolean }) {
  const { t } = useTranslation()
  return (
    <div style={{ position: 'relative' }}>
      <Tabs style={{ marginBottom: '20px', zIndex: 2 }}>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'} disabled={landing}>
          {t('swap')}
        </StyledNavLink>
        {!landing && (
          <>
            <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
              {t('pool')}
            </StyledNavLink>
            <StyledNavLink id={`bridge-nav-link`} to={'/bridge'} isActive={() => active === 'bridge'}>
              {t('bridge')}
            </StyledNavLink>
          </>
        )}
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
