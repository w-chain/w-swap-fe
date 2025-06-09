import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TokenSymbols } from '../shared/types'
import BridgeTokenSearchModal from './BridgeTokenSearchModal'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'

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

const StyledInput = styled.input`
  background: transparent;
  color: #000;
  border: none;
  font-size: 1.875rem;
  width: 100%;
  font-weight: 600;
  &::placeholder {
    color: #000;
  }
`

const TokenSelect = styled.button`
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
  value: string
  onUserInput: (value: string) => void
  onTokenSelect: (token: TokenSymbols) => void
  availableTokens: TokenSymbols[]
  selectedToken?: TokenSymbols
  showMaxButton?: boolean
  onMax?: () => void
  label?: string
  id?: string
  hideInput?: boolean
  hideBalance?: boolean
}

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 0.875rem;
`

export default function BridgeTokenInputPanel({
  value,
  onUserInput,
  onTokenSelect,
  availableTokens,
  selectedToken,
  showMaxButton,
  onMax,
  label,
  id,
  hideInput,
  hideBalance
}: BridgeTokenInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container hideInput={!!hideInput}>
        {!hideInput && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
            <StyledInput value={value} onChange={e => onUserInput(e.target.value)} placeholder="0.0" />
            <TokenSelect onClick={() => setModalOpen(true)}>
              <StyledTokenName active={!!selectedToken}>{selectedToken || 'Select Token'}</StyledTokenName>
              <StyledDropDown />
            </TokenSelect>
          </div>
        )}
        {/* Balance display can be added here if needed */}
        {!hideBalance && (
          <div
            style={{
              padding: '0 1rem 1rem',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000',
              justifySelf: 'flex-end'
            }}
          >
            Balance: 0.00
          </div>
        )}
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
