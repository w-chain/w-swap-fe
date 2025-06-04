import React, { useState } from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { ChainId } from '@uniswap/sdk'
import Modal from '../Modal'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import BNBLogoPng from '../CurrencyLogo/assets/bnb-logo.png'
import WcoLogoPng from '../CurrencyLogo/assets/wco-logo.png'

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg2};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
`

const ChainName = styled(TYPE.body)`
  font-weight: 500;
`

const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
`

const NETWORK_LABELS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.WCHAIN]: 'W Chain',
  [ChainId.WCHAIN_TESTNET]: 'W Chain Testnet',
  [ChainId.BNB]: 'BNB'
}

const NETWORK_ICONS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.WCHAIN]: WcoLogoPng,
  [ChainId.WCHAIN_TESTNET]: WcoLogoPng,
  [ChainId.BNB]: BNBLogoPng
}

interface ChainSelectProps {
  selectedChain: number | null
  onChainSelect: (chainId: number) => void
}

export function ChainSelect({ selectedChain, onChainSelect }: ChainSelectProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const availableChains = Object.keys(NETWORK_LABELS).map(Number)

  return (
    <>
      <SelectContainer onClick={() => setModalOpen(true)}>
        {selectedChain && NETWORK_ICONS[selectedChain as ChainId] && (
          <ChainIcon src={NETWORK_ICONS[selectedChain as ChainId]} alt={NETWORK_LABELS[selectedChain as ChainId]} />
        )}
        <ChainName>{selectedChain ? NETWORK_LABELS[selectedChain as ChainId] || 'Unknown' : 'Select Chain'}</ChainName>
      </SelectContainer>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} maxHeight={60} minHeight={20}>
        <div style={{ padding: '1rem' }}>
          <TYPE.largeHeader>Select Network</TYPE.largeHeader>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {availableChains.map(chainId => (
              <button
                key={chainId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedChain === chainId ? '#e0e0e0' : '#fff',
                  cursor: selectedChain === chainId ? 'not-allowed' : 'pointer',
                  opacity: selectedChain === chainId ? 0.5 : 1
                }}
                disabled={selectedChain === chainId}
                onClick={() => {
                  onChainSelect(chainId)
                  setModalOpen(false)
                }}
              >
                <ChainIcon src={NETWORK_ICONS[chainId as ChainId]} alt={NETWORK_LABELS[chainId as ChainId]} />
                <span>{NETWORK_LABELS[chainId as ChainId]}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
