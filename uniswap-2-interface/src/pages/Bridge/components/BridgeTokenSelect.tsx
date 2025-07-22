import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import { TokenSymbols } from '../shared/types'
import BridgeTokenSearchModal from './BridgeTokenSearchModal'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'
import { getTokenImage } from '../shared/utils'
import { TokenAmount } from '@uniswap/sdk'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 12px;
  background-color: #b4dafe;
`

const StyledInput = styled(NumericalInput)`
background: transparent;
color: #000;
font-size: 1.875rem;
font-weight: 600;
&::placeholder {
  color: #000;
}
`

const TokenSelect = styled.button`
  display: flex;
  align-items: center;
  height: 2.2rem;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ theme }) => theme.buttonBg1};
  color: #043f84;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  white-space: nowrap;
  :focus,
  :hover {
    background-color: ${({ theme }) => theme.buttonHoverBg1};
  }
`

interface BridgeTokenInputPanelProps {
  value: string | number | undefined
  onUserInput: (value: string) => void
  onTokenSelect: (token: TokenSymbols) => void
  availableTokens: TokenSymbols[]
  selectedToken?: TokenSymbols
  id?: string
  balance?: TokenAmount
}

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 0.875rem;
`

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`

export default function BridgeTokenInputPanel({
  value,
  onUserInput,
  onTokenSelect,
  availableTokens,
  selectedToken,
  id,
  balance
}: BridgeTokenInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
        <StyledInput
          className="token-amount-input"
          value={value === undefined ? '' : value}
          onUserInput={val => {
            onUserInput(val)
          }}
        />
        <TokenSelect onClick={() => setModalOpen(true)}>
          {selectedToken && <TokenIcon src={getTokenImage(selectedToken)} alt={`${selectedToken} logo`} />}

          <StyledTokenName active={!!selectedToken}>{selectedToken || 'Select Token'}</StyledTokenName>
          <StyledDropDown />
        </TokenSelect>
      </div>
      <div
        style={{
          padding: '0 1rem 1rem',
          fontSize: '14px',
          fontWeight: 600,
          color: '#000',
          justifySelf: 'flex-end'
        }}
      >
        {balance ? `Balance: ${balance.toSignificant(6)}` : "Balance: 0.00"}
      </div>
      </Container>
      <BridgeTokenSearchModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        availableTokens={availableTokens}
        onTokenSelect={(token: TokenSymbols) => {
          onTokenSelect(token)
          setModalOpen(false)
        }}
        selectedToken={selectedToken}
      />
    </InputPanel>
  )
}
