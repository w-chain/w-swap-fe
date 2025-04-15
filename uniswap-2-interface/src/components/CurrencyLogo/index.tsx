import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import WcoLogoPng from './assets/wco-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import BNBLogoPng from './assets/bnb-logo.png'
import USDTLogo from './assets/usdt.webp'
import USDCLogo from './assets/usdc.webp'

import { useActiveWeb3React } from '../../hooks'

const getTokenLogoURL = (address: string, chainId: ChainId) => {
  if (['0x2170Ed0880ac9A755fd29B2688956BD959F933F8', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'].includes(address)) {
    return EthereumLogo;
  }
  if (['0xdAC17F958D2ee523a2206206994597C13D831ec7', '0x55d398326f99059fF775485246999027B3197955'].includes(address)) {
    return USDTLogo;
  }
  if (['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'].includes(address)) {
    return USDCLogo;
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
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getNativeCurrencyLogoURL = (chainId?: ChainId) => {
  if (chainId === ChainId.WADZCHAIN_MAINNET) {
    return WcoLogoPng
  } else if (chainId === ChainId.BNB) {
    return BNBLogoPng
  }

  return EthereumLogo
}

export default function CurrencyLogo({
  currency,
  size = '24px',
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
