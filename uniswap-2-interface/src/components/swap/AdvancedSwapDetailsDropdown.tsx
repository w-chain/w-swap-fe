import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  width: 100%;
  color: ${({ theme }) => theme.text2};
  height: ${({ show }) => (show ? 'auto' : '0')};
  transition: height 300ms ease-in-out, margin-top 300ms ease-in-out;
  margin-top: ${({ show }) => (show ? '30px' : '0')};
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade) || Boolean(lastTrade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
