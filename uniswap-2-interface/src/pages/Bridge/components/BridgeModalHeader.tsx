import React, { useContext } from 'react'
import { ArrowRight } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../../components/Column'
import { RowBetween, RowFixed } from '../../../components/Row'
import { TruncatedText } from '../../../components/swap/styleds'
import { Networks, TokenSymbols } from '../shared/types'
import { getTokenImage } from '../shared/utils/token'
import { getNetworkImage } from '../shared/utils/network'
import styled from 'styled-components'

const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
`

const NetworkLogo = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
`

export default function BridgeModalHeader({
  amount,
  tokenSymbol,
  fromNetwork,
  toNetwork
}: {
  amount: number
  tokenSymbol: TokenSymbols
  fromNetwork: Networks
  toNetwork: Networks
}) {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <TokenLogo src={getTokenImage(tokenSymbol)} alt={tokenSymbol} />
          <TruncatedText fontSize={24} fontWeight={500}>
            {amount}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {tokenSymbol}
          </Text>
        </RowFixed>
      </RowBetween>
      
      <RowBetween align="center">
        <RowFixed gap={'8px'}>
          <NetworkLogo src={getNetworkImage(fromNetwork)} alt={fromNetwork} />
          <Text fontSize={16} fontWeight={500} color={theme.text1}>
            {fromNetwork}
          </Text>
        </RowFixed>
        <ArrowRight size="16" color={theme.text2} style={{ minWidth: '16px' }} />
        <RowFixed gap={'8px'}>
          <NetworkLogo src={getNetworkImage(toNetwork)} alt={toNetwork} />
          <Text fontSize={16} fontWeight={500} color={theme.text1}>
            {toNetwork}
          </Text>
        </RowFixed>
      </RowBetween>
    </AutoColumn>
  )
}