// pages/Bridge/stores/Transaction.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BridgeTransaction } from '../shared/types/transaction'
import { TransactionStatus } from '../shared/types/enums'

interface TransactionState {
  transactions: BridgeTransaction[]
  loading: boolean
}

const initialState: TransactionState = {
  transactions: [],
  loading: false
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<BridgeTransaction>) => {
      state.transactions.push(action.payload)
    },
    updateDepositNonce: (state, action: PayloadAction<{ txHash: string; depositNonce: string }>) => {
      const tx = state.transactions.find(tx => tx.txHash === action.payload.txHash)
      if (tx) {
        tx.depositNonce = action.payload.depositNonce
      }
    },
    updateTransactionStatus: (state, action: PayloadAction<{ txHash: string; status: TransactionStatus }>) => {
      const tx = state.transactions.find(tx => tx.txHash === action.payload.txHash)
      if (tx) {
        tx.status = action.payload.status
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(tx => tx.txHash !== action.payload)
    },
    clearCompletedTransactions: (state) => {
      state.transactions = state.transactions.filter(tx => 
        tx.status === TransactionStatus.PENDING || 
        tx.status === TransactionStatus.AWAITING
      )
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const {
  addTransaction,
  updateDepositNonce,
  updateTransactionStatus,
  removeTransaction,
  clearCompletedTransactions,
  setLoading
} = transactionSlice.actions

// Thunks
export const persistTransactions = () => async (dispatch: any, getState: any) => {
  const { transactions } = getState().transaction
  localStorage.setItem('bridge_transactions', JSON.stringify(transactions))
}

export const loadTransactions = () => async (dispatch: any) => {
  try {
    const stored = localStorage.getItem('bridge_transactions')
    if (stored) {
      const transactions = JSON.parse(stored)
      transactions.forEach((tx: BridgeTransaction) => {
        dispatch(addTransaction(tx))
      })
    }
  } catch (error) {
    console.error('Failed to load stored transactions:', error)
  }
}

export default transactionSlice.reducer