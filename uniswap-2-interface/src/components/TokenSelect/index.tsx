import React, { useState } from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { useSelectedTokenList } from '../../state/lists/hooks'
import { useActiveWeb3React } from '../../hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { currencyId } from '../../utils/currencyId'

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

const TokenSymbol = styled(TYPE.body)`
  font-weight: 500;
`

interface TokenSelectProps {
  selectedToken: string | null
  onTokenSelect: (token: string) => void
}

export function TokenSelect({ selectedToken, onTokenSelect }: TokenSelectProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { chainId } = useActiveWeb3React()
  const tokenList = useSelectedTokenList()
  const selectedTokenInfo = selectedToken && chainId ? tokenList[chainId]?.[selectedToken] : null

  return (
    <>
      <SelectContainer onClick={() => setModalOpen(true)}>
        <TokenSymbol>{selectedTokenInfo?.symbol || 'Select Token'}</TokenSymbol>
      </SelectContainer>
      <CurrencySearchModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onCurrencySelect={currency => {
          onTokenSelect(currencyId(currency))
          setModalOpen(false)
        }}
        selectedCurrency={selectedTokenInfo}
        // You may need to pass other props as required by CurrencySearchModal
      />
    </>
  )
}
