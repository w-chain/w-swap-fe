// pages/Bridge/stores/Transaction.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BridgeTransaction } from '../shared/types/transaction'
import { TransactionStatus } from '../shared/types/enums'
import {
  BRIDGE_TRANSACTIONS_STORAGE_KEY,
  isBridgeTransactionCompleted,
  isBridgeTransactionPending,
  normalizeStoredBridgeTransaction
} from '../shared/utils/bridgeTransactionStorage'

interface TransactionState {
  transactions: BridgeTransaction[]
  loading: boolean
  initialized: boolean
}

// Load transactions from localStorage on initialization
const loadStoredTransactions = (): BridgeTransaction[] => {
  try {
    const stored = localStorage.getItem(BRIDGE_TRANSACTIONS_STORAGE_KEY)
    if (stored) {
      const transactions = JSON.parse(stored)
      // Validate that the stored data is an array
      if (Array.isArray(transactions)) {
        return transactions
          .map(normalizeStoredBridgeTransaction)
          .filter((tx): tx is BridgeTransaction => tx !== null)
      }
    }
  } catch (error) {
    console.error('Failed to load stored transactions:', error)
    // Clear corrupted data
    localStorage.removeItem(BRIDGE_TRANSACTIONS_STORAGE_KEY)
  }
  return []
}

// Save transactions to localStorage with cleanup
const saveTransactionsToStorage = (transactions: BridgeTransaction[]) => {
  try {
    // Clean up old completed transactions (older than 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const cleanedTransactions = transactions.filter(tx => {
      // Keep all pending/awaiting transactions regardless of age
      if (isBridgeTransactionPending(tx.status)) {
        return true
      }
      // Keep completed transactions only if they're less than 30 days old
      return tx.timestamp > thirtyDaysAgo
    })

    localStorage.setItem(BRIDGE_TRANSACTIONS_STORAGE_KEY, JSON.stringify(cleanedTransactions))
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error)
    // If localStorage is full, try to clear old completed transactions and retry
    if (error.name === 'QuotaExceededError') {
      try {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        const essentialTransactions = transactions.filter(
          tx => isBridgeTransactionPending(tx.status) || tx.timestamp > sevenDaysAgo
        )
        localStorage.setItem(BRIDGE_TRANSACTIONS_STORAGE_KEY, JSON.stringify(essentialTransactions))
      } catch (retryError) {
        console.error('Failed to save transactions even after cleanup:', retryError)
      }
    }
  }
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  initialized: false
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<BridgeTransaction>) => {
      state.transactions.push(action.payload)
      saveTransactionsToStorage(state.transactions)
    },
    updateDepositNonce: (state, action: PayloadAction<{ txHash: string; depositNonce: string }>) => {
      const tx = state.transactions.find(tx => tx.txHash === action.payload.txHash)
      if (tx) {
        tx.depositNonce = action.payload.depositNonce
        saveTransactionsToStorage(state.transactions)
      }
    },
    updateTransactionStatus: (state, action: PayloadAction<{ txHash: string; status: TransactionStatus }>) => {
      const tx = state.transactions.find(tx => tx.txHash === action.payload.txHash)
      if (tx) {
        tx.status = action.payload.status
        saveTransactionsToStorage(state.transactions)
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(tx => tx.txHash !== action.payload)
      saveTransactionsToStorage(state.transactions)
    },
    clearCompletedTransactions: (state) => {
      state.transactions = state.transactions.filter(tx => isBridgeTransactionPending(tx.status))
      saveTransactionsToStorage(state.transactions)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    initializeTransactions: (state) => {
      state.transactions = loadStoredTransactions()
      state.initialized = true
      state.loading = false
    }
  }
})

export const {
  addTransaction,
  updateDepositNonce,
  updateTransactionStatus,
  removeTransaction,
  clearCompletedTransactions,
  setLoading,
  initializeTransactions
} = transactionSlice.actions

// Helper function to manually save transactions (if needed)
export const saveTransactions = () => (dispatch: any, getState: any) => {
  const { transactions } = getState().transaction
  saveTransactionsToStorage(transactions)
}

export default transactionSlice.reducer