import React from 'react'
import styled from 'styled-components'
import { TokenSymbols } from '../shared/types'
import Modal from '../../../components/Modal'
import { getTokenImage } from '../shared/utils'

interface BridgeTokenSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  availableTokens: TokenSymbols[]
  onTokenSelect: (token: TokenSymbols) => void
  selectedToken?: TokenSymbols
}

const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 0;
  min-width: 340px;
  position: relative;
`

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #222;
`

const ModalSubtitle = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 4px;
  margin-bottom: 16px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  color: #888;
  font-size: 20px;
`

const Divider = styled.div`
  height: 1px;
  background: #ececec;
  margin: 16px 0 0 0;
`

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  padding-top: 16px;
`

const TokenButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: ${({ selected }) => (selected ? '#eaf4fb' : '#f7fafd')};
  font-size: 17px;
  font-weight: 600;
  color: #222;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: none;
  outline: none;
  &:hover {
    background: #e0f0ff;
  }
`

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`

export default function BridgeTokenSearchModal({
  isOpen,
  onDismiss,
  availableTokens,
  onTokenSelect,
  selectedToken
}: BridgeTokenSearchModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalCard>
        <ModalHeader>
          <div>
            <ModalTitle>Select Token</ModalTitle>
            <ModalSubtitle>Select the token you want to move from Source Chain.</ModalSubtitle>
          </div>
          <CloseButton onClick={onDismiss}>&times;</CloseButton>
        </ModalHeader>
        <Divider />
        <TokenList>
          {availableTokens.map(token => (
            <TokenButton key={token} selected={selectedToken === token} onClick={() => onTokenSelect(token)}>
              <TokenIcon src={getTokenImage(token)} alt={`${token} logo`} />
              {token}
            </TokenButton>
          ))}
        </TokenList>
      </ModalCard>
    </Modal>
  )
}
