import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TYPE } from '../../../theme'
import { ButtonError } from '../../../components/Button'
import { AutoColumn } from '../../../components/Column'
import { RowBetween, RowFixed } from '../../../components/Row'
import { SwapCallbackError } from '../../../components/swap/styleds'
import { Networks, TokenSymbols } from '../shared/types'

export default function BridgeModalFooter({
  amount,
  tokenSymbol,
  fromNetwork,
  toNetwork,
  onConfirm,
  bridgeErrorMessage
}: {
  amount: number
  tokenSymbol: TokenSymbols
  fromNetwork: Networks
  toNetwork: Networks
  onConfirm: () => void
  bridgeErrorMessage: string | undefined
}) {
  const theme = useContext(ThemeContext)

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Amount
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text1}>
            {amount} {tokenSymbol}
          </Text>
        </RowBetween>

        <RowBetween>
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            From Network
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text1}>
            {fromNetwork}
          </Text>
        </RowBetween>

        <RowBetween>
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            To Network
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text1}>
            {toNetwork}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoColumn gap="12px">
        <ButtonError
          onClick={onConfirm}
          disabled={!!bridgeErrorMessage}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-bridge-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            Confirm Bridge Transaction
          </Text>
        </ButtonError>

        {bridgeErrorMessage ? <SwapCallbackError error={bridgeErrorMessage} /> : null}
      </AutoColumn>
    </>
  )
}