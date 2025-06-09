// pages/Bridge/stores/hooks/useNetwork.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import * as actions from '../Network'
import { ChainId, Networks } from '../../shared/types'

export function useNetwork() {
  const dispatch = useDispatch()
  const state = useSelector((state: AppState) => state.network)

  return {
    ...state,
    switchNetwork: useCallback((network: Networks) => 
      dispatch(actions.switchNetwork(network)), [dispatch]),
    switchNetworkWithChainId: useCallback((chainId: ChainId) => 
      dispatch(actions.switchNetworkWithChainId(chainId)), [dispatch])
  }
}