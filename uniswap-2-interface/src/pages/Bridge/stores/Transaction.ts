// pages/Bridge/stores/Transaction.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BridgeTransaction } from '../shared/types/transaction'
import { TransactionStatus } from '../shared/types/enums'

interface TransactionState {
  transactions: BridgeTransaction[]
  loading: boolean
  initialized: boolean
}

// Load transactions from localStorage on initialization
const loadStoredTransactions = (): BridgeTransaction[] => {
  try {
    const stored = localStorage.getItem('bridge_transactions')
    if (stored) {
      const transactions = JSON.parse(stored)
      // Validate that the stored data is an array
      if (Array.isArray(transactions)) {
        // Filter out any invalid transactions and ensure they have required fields
        return transactions.filter(tx => 
          tx && 
          typeof tx === 'object' && 
          tx.txHash && 
          tx.fromChainId && 
          tx.toChainId && 
          tx.status
        )
      }
    }
  } catch (error) {
    console.error('Failed to load stored transactions:', error)
    // Clear corrupted data
    localStorage.removeItem('bridge_transactions')
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
      if (tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING) {
        return true
      }
      // Keep completed transactions only if they're less than 30 days old
      return tx.timestamp > thirtyDaysAgo
    })
    
    localStorage.setItem('bridge_transactions', JSON.stringify(cleanedTransactions))
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error)
    // If localStorage is full, try to clear old completed transactions and retry
    if (error.name === 'QuotaExceededError') {
      try {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        const essentialTransactions = transactions.filter(tx => 
          tx.status === TransactionStatus.PENDING || 
          tx.status === TransactionStatus.AWAITING ||
          tx.timestamp > sevenDaysAgo
        )
        localStorage.setItem('bridge_transactions', JSON.stringify(essentialTransactions))
      } catch (retryError) {
        console.error('Failed to save transactions even after cleanup:', retryError)
      }
    }
  }
}

const initialState: TransactionState = {
  transactions: loadStoredTransactions(),
  loading: false,
  initialized: true
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
      state.transactions = state.transactions.filter(tx => 
        tx.status === TransactionStatus.PENDING || 
        tx.status === TransactionStatus.AWAITING
      )
      saveTransactionsToStorage(state.transactions)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    initializeTransactions: (state) => {
      if (!state.initialized) {
        state.transactions = loadStoredTransactions()
        state.initialized = true
      }
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