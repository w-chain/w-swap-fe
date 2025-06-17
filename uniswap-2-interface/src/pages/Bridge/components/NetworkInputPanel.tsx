import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../../../components/Row'
import { TYPE } from '../../../theme'
import NetworkSelect from './NetworkSelect'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 12px;
`

interface NetworkInputPanelProps {
  label: string
  id: string
  direction: 'from' | 'to'
}

export default function NetworkInputPanel({
  label,
  id,
  direction
}: NetworkInputPanelProps) {
  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        <LabelRow>
          <RowBetween>
            <TYPE.body color={'#000'} fontWeight={600} fontSize={14}>
              {label}
            </TYPE.body>
          </RowBetween>
        </LabelRow>
        <InputRow selected={false}>
          <NetworkSelect direction={direction} />
        </InputRow>
      </Container>
    </InputPanel>
  )
}
