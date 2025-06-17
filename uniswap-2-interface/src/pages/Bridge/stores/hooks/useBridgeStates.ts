// pages/Bridge/stores/hooks/useBridgeStates.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import * as actions from '../BridgeStates'
import { Networks, TokenSymbols } from '../../shared/types'

export function useBridgeStates() {
  const dispatch = useDispatch()
  const state = useSelector((state: AppState) => state.bridgeStates)

  return {
    ...state,
    setFromNetwork: useCallback((network: Networks) => 
      dispatch(actions.setFromNetwork(network)), [dispatch]),
    setToNetwork: useCallback((network: Networks) => 
      dispatch(actions.setToNetwork(network)), [dispatch]),
    setFromToken: useCallback((token: TokenSymbols | undefined) => 
      dispatch(actions.setFromToken(token)), [dispatch]),
    setToToken: useCallback((token: TokenSymbols | undefined) => 
      dispatch(actions.setToToken(token)), [dispatch]),
    setFromAmount: useCallback((amount: number | undefined) => 
      dispatch(actions.setFromAmount(amount)), [dispatch]),
    setToAmount: useCallback((amount: number | undefined) => 
      dispatch(actions.setToAmount(amount)), [dispatch]),
    setFee: useCallback((fee: number) => 
      dispatch(actions.setFee(fee)), [dispatch]),
    setHandlerAllowance: useCallback((allowance: string) => 
      dispatch(actions.setHandlerAllowance(allowance)), [dispatch]),
    resetTokens: useCallback(() => 
      dispatch(actions.resetTokens()), [dispatch]),
    swapNetworks: useCallback(() => 
      dispatch(actions.swapNetworks()), [dispatch])
  }
}