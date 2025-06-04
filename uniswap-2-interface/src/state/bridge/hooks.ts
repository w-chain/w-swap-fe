import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { 
  setFromChain,
  setToChain,
  setFromToken,
  setToToken,
  setAmount,
  setHandlerAllowance
} from './actions'

export function useBridgeState() {
  const dispatch = useDispatch<AppDispatch>()
  const bridgeState = useSelector((state: AppState) => state.bridge)

  const updateFromChain = useCallback(
    (chainId: number) => {
      dispatch(setFromChain(chainId))
    },
    [dispatch]
  )

  const updateToChain = useCallback(
    (chainId: number) => {
      dispatch(setToChain(chainId))
    },
    [dispatch]
  )

  const updateFromToken = useCallback(
    (token: string) => {
      dispatch(setFromToken(token))
    },
    [dispatch]
  )

  const updateToToken = useCallback(
    (token: string) => {
      dispatch(setToToken(token))
    },
    [dispatch]
  )

  const updateAmount = useCallback(
    (amount: string) => {
      dispatch(setAmount(amount))
    },
    [dispatch]
  )

  const updateHandlerAllowance = useCallback(
    (allowance: string) => {
      dispatch(setHandlerAllowance(allowance))
    },
    [dispatch]
  )

  return {
    ...bridgeState,
    updateFromChain,
    updateToChain,
    updateFromToken,
    updateToToken,
    updateAmount,
    updateHandlerAllowance
  }
} 