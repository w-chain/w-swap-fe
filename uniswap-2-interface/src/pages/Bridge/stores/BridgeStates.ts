// pages/Bridge/stores/BridgeStates.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Networks, ChainId, TokenSymbols } from '../shared/types'
import { getNetworkChainId } from '../shared/utils/network'
import { getTokenBySymbol } from '../shared/registry/tokens'
import { getBSCTargetToken } from '../shared/utils/token'

export interface BridgeState {
  from: Networks
  fromChainId: ChainId
  fromToken?: TokenSymbols
  fromAmount?: number
  to: Networks
  toChainId: ChainId
  toToken?: TokenSymbols
  toAmount?: number
  fee: number
  selectedTokenAddress?: string
  handlerAllowance: string
}

const initialState: BridgeState = {
  from: Networks.ETH,
  fromChainId: ChainId.ETH,
  to: Networks.WCHAIN,
  toChainId: ChainId.WCHAIN,
  fee: 0,
  handlerAllowance: '0'
}

const bridgeStatesSlice = createSlice({
  name: 'bridgeStates',
  initialState,
  reducers: {
    setFromNetwork: (state, action: PayloadAction<Networks>) => {
      state.from = action.payload
      state.fromChainId = getNetworkChainId(action.payload, false)
      // Clear tokens when network changes as they might not be available
      state.fromToken = undefined
      state.toToken = undefined
      state.selectedTokenAddress = undefined
      state.fromAmount = undefined
    },
    setToNetwork: (state, action: PayloadAction<Networks>) => {
      state.to = action.payload
      state.toChainId = getNetworkChainId(action.payload, false)
      // Clear tokens when network changes as they might not be available
      state.fromToken = undefined
      state.toToken = undefined
      state.selectedTokenAddress = undefined
      state.fromAmount = undefined
    },
    setFromToken: (state, action: PayloadAction<TokenSymbols | undefined>) => {
      state.fromToken = action.payload
      if (action.payload) {
        if (state.from === Networks.BSC || state.to === Networks.BSC) {
          state.toToken = getBSCTargetToken(action.payload)
        } else {
          state.toToken = action.payload
        }
        state.selectedTokenAddress = getTokenBySymbol(state.fromChainId, action.payload)?.address ?? undefined
      } else {
        state.toToken = undefined
        state.selectedTokenAddress = undefined
      }
    },
    setToToken: (state, action: PayloadAction<TokenSymbols | undefined>) => {
      state.toToken = action.payload
    },
    setFromAmount: (state, action: PayloadAction<number | undefined>) => {
      state.fromAmount = action.payload
    },
    setToAmount: (state, action: PayloadAction<number | undefined>) => {
      state.toAmount = action.payload
    },
    setFee: (state, action: PayloadAction<number>) => {
      state.fee = action.payload
    },
    setHandlerAllowance: (state, action: PayloadAction<string>) => {
      state.handlerAllowance = action.payload
    },
    resetTokens: (state) => {
      state.fromToken = undefined
      state.toToken = undefined
    },
    swapNetworks: (state) => {
      const oldFrom = state.from
      const oldFromChainId = state.fromChainId
      const oldTo = state.to
      const oldToChainId = state.toChainId
      
      state.from = oldTo
      state.fromChainId = oldToChainId
      state.to = oldFrom
      state.toChainId = oldFromChainId
      
      // Clear tokens since they might not be valid for swapped networks
      state.fromToken = undefined
      state.toToken = undefined
      state.selectedTokenAddress = undefined
      state.fromAmount = undefined
    }
  }
})

export const {
  setFromNetwork,
  setToNetwork,
  setFromToken,
  setToToken,
  setFromAmount,
  setToAmount,
  setFee,
  setHandlerAllowance,
  resetTokens,
  swapNetworks
} = bridgeStatesSlice.actions

export default bridgeStatesSlice.reducer