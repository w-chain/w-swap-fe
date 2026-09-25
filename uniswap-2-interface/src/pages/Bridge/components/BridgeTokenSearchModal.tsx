import React from 'react'
import { TokenSymbols } from '../shared/types'
import Modal from '../../../components/Modal'
import { getTokenImage } from '../shared/utils'
import styled from 'styled-components'
import {
  EcosystemModalBody,
  EcosystemModalClose,
  EcosystemModalDivider,
  EcosystemModalHeader,
  EcosystemModalList,
  EcosystemModalSubtitle,
  EcosystemModalTitle,
  EcosystemPickButton
} from '../../../components/ecosystem/styled'

interface BridgeTokenSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  availableTokens: TokenSymbols[]
  onTokenSelect: (token: TokenSymbols) => void
  selectedToken?: TokenSymbols
}

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
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
      <EcosystemModalBody>
        <EcosystemModalHeader>
          <div>
            <EcosystemModalTitle>Select Token</EcosystemModalTitle>
            <EcosystemModalSubtitle>Select the token you want to move from Source Chain.</EcosystemModalSubtitle>
          </div>
          <EcosystemModalClose type="button" aria-label="Close" onClick={onDismiss}>
            ×
          </EcosystemModalClose>
        </EcosystemModalHeader>
        <EcosystemModalDivider />
        <EcosystemModalList>
          {availableTokens.map(token => (
            <EcosystemPickButton
              key={token}
              type="button"
              $selected={selectedToken === token}
              onClick={() => onTokenSelect(token)}
            >
              <TokenIcon src={getTokenImage(token)} alt={`${token} logo`} />
              {token}
            </EcosystemPickButton>
          ))}
        </EcosystemModalList>
      </EcosystemModalBody>
    </Modal>
  )
}
