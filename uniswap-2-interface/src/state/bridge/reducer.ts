import { createReducer } from '@reduxjs/toolkit'
import {
  setFromChain,
  setToChain,
  setFromToken,
  setToToken,
  setAmount,
  setHandlerAllowance,
  addTransaction,
  updateTransactionStatus,
  updateDepositNonce
} from './actions'
import { BridgeTransaction, TransactionStatus } from './types'

export interface BridgeState {
  fromChain: number | null
  toChain: number | null
  fromToken: string | null
  toToken: string | null
  amount: string
  handlerAllowance: string
  transactions: BridgeTransaction[]
}

const initialState: BridgeState = {
  fromChain: null,
  toChain: null,
  fromToken: null,
  toToken: null,
  amount: '',
  handlerAllowance: '0',
  transactions: []
}

export default createReducer(initialState, builder =>
  builder
    .addCase(setFromChain, (state, { payload }) => {
      state.fromChain = payload
    })
    .addCase(setToChain, (state, { payload }) => {
      state.toChain = payload
    })
    .addCase(setFromToken, (state, { payload }) => {
      state.fromToken = payload
    })
    .addCase(setToToken, (state, { payload }) => {
      state.toToken = payload
    })
    .addCase(setAmount, (state, { payload }) => {
      state.amount = payload
    })
    .addCase(setHandlerAllowance, (state, { payload }) => {
      state.handlerAllowance = payload
    })
    .addCase(addTransaction, (state, { payload }) => {
      state.transactions.unshift(payload)
    })
    .addCase(updateTransactionStatus, (state, { payload: { txHash, status } }) => {
      const tx = state.transactions.find(t => t.txHash === txHash)
      if (tx) {
        tx.status = status
      }
    })
    .addCase(updateDepositNonce, (state, { payload: { txHash, depositNonce } }) => {
      const tx = state.transactions.find(t => t.txHash === txHash)
      if (tx) {
        tx.depositNonce = depositNonce
      }
    })
) 