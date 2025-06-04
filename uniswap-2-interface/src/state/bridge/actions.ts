import { createAction } from '@reduxjs/toolkit'
import { BridgeTransaction, TransactionStatus } from './types'

export const setFromChain = createAction<number>('bridge/setFromChain')
export const setToChain = createAction<number>('bridge/setToChain')
export const setFromToken = createAction<string>('bridge/setFromToken')
export const setToToken = createAction<string>('bridge/setToToken')
export const setAmount = createAction<string>('bridge/setAmount')
export const setHandlerAllowance = createAction<string>('bridge/setHandlerAllowance')

export const addTransaction = createAction<BridgeTransaction>('bridge/addTransaction')
export const updateTransactionStatus = createAction<{ txHash: string; status: TransactionStatus }>('bridge/updateTransactionStatus')
export const updateDepositNonce = createAction<{ txHash: string; depositNonce: string }>('bridge/updateDepositNonce') 