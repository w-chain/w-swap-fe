import React from 'react'
import { TokenSymbols } from '../shared/types'
import Modal from '../../../components/Modal'

interface BridgeTokenSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  availableTokens: TokenSymbols[]
  onTokenSelect: (token: TokenSymbols) => void
  selectedToken?: TokenSymbols
}

export default function BridgeTokenSearchModal({
  isOpen,
  onDismiss,
  availableTokens,
  onTokenSelect,
  selectedToken
}: BridgeTokenSearchModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div style={{ padding: 24 }}>
        <h3>Select Token</h3>
        {availableTokens.map(token => (
          <button
            key={token}
            style={{
              display: 'block',
              width: '100%',
              padding: 12,
              margin: '8px 0',
              background: selectedToken === token ? '#b4dafe' : '#fff',
              border: '1px solid #b4dafe',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => onTokenSelect(token)}
          >
            {token}
          </button>
        ))}
      </div>
    </Modal>
  )
}
