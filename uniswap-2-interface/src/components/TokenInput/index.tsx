import React from 'react'
import styled from 'styled-components'
import { AutoRow } from '../Row'
import { TYPE } from '../../theme'
import { TokenSelect } from '../TokenSelect'

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text1};
  margin: 0.5rem 0;
  padding: 0;

  &::placeholder {
    color: ${({ theme }) => theme.text3};
  }
`

interface TokenInputProps {
  value: string
  onUserInput: (value: string) => void
  token: string | null
  onTokenSelect: (token: string) => void
}

export default function TokenInput({ value, onUserInput, token, onTokenSelect }: TokenInputProps) {
  return (
    <InputContainer>
      <AutoRow justify="space-between">
        <TYPE.body color="text2">Amount</TYPE.body>
        <TokenSelect selectedToken={token} onTokenSelect={onTokenSelect} />
      </AutoRow>
      <Input type="number" placeholder="0.0" value={value} onChange={e => onUserInput(e.target.value)} />
    </InputContainer>
  )
}
