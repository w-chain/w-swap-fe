import { Currency, CurrencyAmount, Fraction, Percent } from '@uniswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary, ButtonPrimaryDark } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { getCurrencySymbol } from '../../utils/getNativeTokenSymbol'
import { PurpleCard } from '../../components/Card'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <PurpleCard
      style={{
        background: 'rgba(4, 63, 132, 0.25)',
        padding: '20px 26px'
      }}
    >
      <RowBetween>
        <TYPE.primary fontSize={14}>{getCurrencySymbol(currencies[Field.CURRENCY_A], chainId)} Deposited</TYPE.primary>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} size="24px" />
          <TYPE.primary>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.primary>
        </RowFixed>
      </RowBetween>
      <RowBetween style={{ marginTop: '5px' }}>
        <TYPE.primary fontSize={14}>{getCurrencySymbol(currencies[Field.CURRENCY_B], chainId)} Deposited</TYPE.primary>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} size="24px" />
          <TYPE.body fontSize={14}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween style={{ marginTop: '5px' }}>
        <TYPE.primary fontSize={14}>Rates</TYPE.primary>
        <TYPE.primary fontSize={14}>
          {`1 ${getCurrencySymbol(currencies[Field.CURRENCY_A], chainId)} = ${price?.toSignificant(
            4
          )} ${getCurrencySymbol(currencies[Field.CURRENCY_B], chainId)}`}
        </TYPE.primary>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end', marginTop: '5px' }}>
        <TYPE.primary fontSize={14}>
          {`1 ${getCurrencySymbol(currencies[Field.CURRENCY_B], chainId)} = ${price
            ?.invert()
            .toSignificant(4)} ${getCurrencySymbol(currencies[Field.CURRENCY_A], chainId)}`}
        </TYPE.primary>
      </RowBetween>
      <RowBetween>
        <TYPE.primary fontSize={14}>Share of Pool:</TYPE.primary>
        <TYPE.primary fontSize={14}>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.primary>
      </RowBetween>
      <ButtonPrimaryDark style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={600} fontSize={16}>
          {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
        </Text>
      </ButtonPrimaryDark>
    </PurpleCard>
  )
}
