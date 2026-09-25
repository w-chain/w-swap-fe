import { Currency, Token } from '@uniswap/sdk'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import { useTokenComparator } from './sorting'
import { SeparatorDark, TokenListFooter } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  EcosystemModalBody,
  EcosystemModalClose,
  EcosystemModalDivider,
  EcosystemModalHeader,
  EcosystemModalSubtitle,
  EcosystemModalTitle
} from '../ecosystem/styled'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  onDismiss,
  isOpen,
  onChangeList
}: CurrencySearchProps) {
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  const selectedListInfo = useSelectedListInfo()

  return (
    <EcosystemModalBody style={{ display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
      <EcosystemModalHeader>
        <div>
          <EcosystemModalTitle>
            Select token
            <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
          </EcosystemModalTitle>
          <EcosystemModalSubtitle>Select the token you want to move from Source Chain.</EcosystemModalSubtitle>
        </div>
        <EcosystemModalClose type="button" aria-label="Close" onClick={onDismiss}>
          ×
        </EcosystemModalClose>
      </EcosystemModalHeader>
      <EcosystemModalDivider />

      <div style={{ flex: '1 1 auto', width: '100%', minHeight: 280, paddingTop: 12, background: '#ffffff' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={showETH}
              currencies={filteredSortedTokens}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>

      <TokenListFooter>
        <SeparatorDark style={{ marginBottom: 12 }} />
        <RowBetween>
          {selectedListInfo.current ? (
            <Row>
              {selectedListInfo.current.logoURI ? (
                <ListLogo
                  style={{ marginRight: 12 }}
                  logoURI={selectedListInfo.current.logoURI}
                  alt={`${selectedListInfo.current.name} list logo`}
                />
              ) : null}
              <TYPE.main id="currency-search-selected-list-name" color="#1a2430">
                {selectedListInfo.current.name}
              </TYPE.main>
            </Row>
          ) : (
            <span />
          )}
          <LinkStyledButton
            style={{ fontWeight: 600, color: '#0e9a86', fontSize: 14 }}
            onClick={onChangeList}
            id="currency-search-change-list-button"
          >
            {selectedListInfo.current ? 'Change' : 'Select a list'}
          </LinkStyledButton>
        </RowBetween>
      </TokenListFooter>
    </EcosystemModalBody>
  )
}
