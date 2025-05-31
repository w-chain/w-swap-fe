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
import WBTCLogo from './assets/wbtc.webp'

import { useActiveWeb3React } from '../../hooks'

const USDTAddresses = [
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // ETH
  '0x55d398326f99059fF775485246999027B3197955', // BSC
  '0x9373D5cec0833Ae2f8b45b22A3159a7B956d7B69', // Sepolia
  '0x9D6d68774326b2100adD0aA29C928Ed7bdC3B127', // W Chain TESTNET
  '0x40CB2CCcF80Ed2192b53FB09720405F6Fe349743' // W Chain MAINNET
]

const USDCAddresses = [
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // ETH
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // BSC
  '0x5880D73B892745Df7465bcCa1A21cF79Ea2A7Ff5', // Sepolia
  '0x1aB74716E3Ec78c71967a846199407c351094c45', // W Chain TESTNET
  '0x643eC74Ed2B79098A37Dc45dcc7F1AbfE2AdE6d8' // W Chain MAINNET
]

const WCOAddresses = [
  '0xF4b85c92c50677E4314413Db6358B037eaA1A721', // ETH & BSC
  '0xEdB8008031141024d50cA2839A607B2f82C1c045', // W Chain
  '0x8495cbfd11759f920a5f6ad34ca5f2b499a348fc' // W Chain TESTNET
]

const getTokenLogoURL = (address: string, chainId: ChainId) => {
  // Temporarily Cheat sheet until we found better dynamic sourcing for logos
  if (['0x2170Ed0880ac9A755fd29B2688956BD959F933F8', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'].includes(address)) {
    return EthereumLogo
  }

  if (USDTAddresses.includes(address)) {
    return USDTLogo
  }

  if (USDCAddresses.includes(address)) {
    return USDCLogo
  }

  if (['0x0555E30da8f98308EdB960aa94C0Db47230d2B9c', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'].includes(address)) {
    return WBTCLogo
  }

  if (['0xEdB8008031141024d50cA2839A607B2f82C1c045', '0xF4b85c92c50677E4314413Db6358B037eaA1A721'].includes(address)) {
    return WcoLogoPng
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
