import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBridgeContract } from '../../hooks/bridge/useBridgeContract'
import { useBridgeState } from '../../state/bridge/hooks'
import { BridgeWrapper } from './BridgeWrapper'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'

export default function Bridge() {
  const { account, chainId } = useActiveWeb3React()
  const bridgeContract = useBridgeContract()
  const bridgeState = useBridgeState()

  return (
    <AppBody>
      <SwapPoolTabs active={'bridge'} />
      <BridgeWrapper account={account} chainId={chainId} bridgeContract={bridgeContract} bridgeState={bridgeState} />
    </AppBody>
  )
}
