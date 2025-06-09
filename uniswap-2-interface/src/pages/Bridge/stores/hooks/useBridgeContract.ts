// pages/Bridge/stores/hooks/useBridgeContract.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { 
  setBridgeContract, 
  setHandlerContract, 
  setInitialized,
  initializeContracts 
} from '../BridgeContract'
import { ChainId } from '../../shared/types'

export function useBridgeContract() {
  const dispatch = useDispatch()
  const state = useSelector((state: AppState) => state.bridgeContract)

  return {
    ...state,
    initializeContracts: useCallback((chainId: ChainId) => 
      dispatch(initializeContracts(chainId)), [dispatch])
  }
}