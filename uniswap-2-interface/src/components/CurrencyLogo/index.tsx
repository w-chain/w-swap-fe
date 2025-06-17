import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import TOKEN_LIST from '../../constants/token-list/token-list.json'
import Logo from '../Logo'
import WcoLogoPng from './assets/wco-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import BNBLogoPng from './assets/bnb-logo.png'

import { useActiveWeb3React } from '../../hooks'


const getTokenLogoURL = (address: string, chainId: ChainId) => {
  const token = TOKEN_LIST.tokens.find((token) => token.address === address && token.chainId === chainId)

  if (token && token.logoURI) {
    return token.logoURI
  }

  const prefixMap: Partial<Record<ChainId, string>> = {
    [ChainId.MAINNET]: 'ethereum',
    [ChainId.BNB]: 'smartchain'
  }

  const chainPrefix = prefixMap[chainId] || 'ethereum'

  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainPrefix}/assets/${address}/logo.png`
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  background: #fff;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getNativeCurrencyLogoURL = (chainId?: ChainId) => {
  switch (chainId) {
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return WcoLogoPng
    case ChainId.BNB:
      return BNBLogoPng
    default:
      return EthereumLogo
  }
}

export default function CurrencyLogo({
  currency,
  size = '30px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId, account, connector } = useActiveWeb3React()

  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, currency.chainId)]
      }

      return [getTokenLogoURL(currency.address, currency.chainId)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    const nativeCurrencyLogo = getNativeCurrencyLogoURL(chainId)
    if (nativeCurrencyLogo) {
      return <StyledEthereumLogo src={nativeCurrencyLogo} size={size} style={style} />
    }
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
