// pages/Bridge/stores/hooks/useTransaction.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import * as actions from '../Transaction'
import { BridgeTransaction, TransactionStatus } from '../../shared/types'

export function useTransaction() {
  const dispatch = useDispatch()
  const state = useSelector((state: AppState) => state.transaction)

  return {
    ...state,
    addTransaction: useCallback((transaction: BridgeTransaction) => 
      dispatch(actions.addTransaction(transaction)), [dispatch]),
    updateDepositNonce: useCallback((txHash: string, depositNonce: string) => 
      dispatch(actions.updateDepositNonce({ txHash, depositNonce })), [dispatch]),
    updateTransactionStatus: useCallback((txHash: string, status: TransactionStatus) => 
      dispatch(actions.updateTransactionStatus({ txHash, status })), [dispatch]),
    removeTransaction: useCallback((txHash: string) => 
      dispatch(actions.removeTransaction(txHash)), [dispatch]),
    clearCompletedTransactions: useCallback(() => 
      dispatch(actions.clearCompletedTransactions()), [dispatch]),
    setLoading: useCallback((loading: boolean) => 
      dispatch(actions.setLoading(loading)), [dispatch])
  }
}