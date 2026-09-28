import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AddLiquidityContent from './AddLiquidityContent'

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  return <AddLiquidityContent currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
}

export { default as AddLiquidityContent } from './AddLiquidityContent'
