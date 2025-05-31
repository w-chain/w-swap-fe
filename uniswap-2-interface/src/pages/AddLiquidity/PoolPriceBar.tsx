import { Currency, Percent, Price } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { getCurrencySymbol } from '../../utils/getNativeTokenSymbol'
import { useActiveWeb3React } from '../../hooks'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.primary>{price?.toSignificant(6) ?? '-'}</TYPE.primary>
          <Text fontWeight={600} fontSize={14} color={'#585858'} pt={1}>
            {getCurrencySymbol(currencies[Field.CURRENCY_B], chainId)} per{' '}
            {getCurrencySymbol(currencies[Field.CURRENCY_A], chainId)}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.primary>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.primary>
          <Text fontWeight={600} fontSize={14} color={'#585858'} pt={1}>
            {getCurrencySymbol(currencies[Field.CURRENCY_A], chainId)} per{' '}
            {getCurrencySymbol(currencies[Field.CURRENCY_B], chainId)}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.primary>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TYPE.primary>
          <Text fontWeight={600} fontSize={14} color={'#585858'} pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
