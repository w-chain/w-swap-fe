// pages/Bridge/stores/Network.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChainId, Networks } from '../shared/types'
import { getNetworkChainId } from '../shared/utils/network'

interface NetworkState {
  chainId?: ChainId
  currentAccount?: string
  isTestnet: boolean
  allowedChains: ChainId[]
}

const initialState: NetworkState = {
  isTestnet: false,
  allowedChains: [ChainId.ETH, ChainId.BSC, ChainId.WCHAIN]
}

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setChainId: (state, action: PayloadAction<ChainId>) => {
      state.chainId = action.payload
    },
    setCurrentAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload
    },
    setIsTestnet: (state, action: PayloadAction<boolean>) => {
      state.isTestnet = action.payload
      state.allowedChains = action.payload 
        ? [ChainId.SEPOLIA, ChainId.BSC_TESTNET, ChainId.WCHAIN_TESTNET]
        : [ChainId.ETH, ChainId.BSC, ChainId.WCHAIN]
    }
  }
})

export const { setChainId, setCurrentAccount, setIsTestnet } = networkSlice.actions

// Thunks
export const switchNetworkWithChainId = (chainId: ChainId) => async (dispatch: any) => {
  try {
    // Implement network switching logic here
    dispatch(setChainId(chainId))
  } catch (error) {
    console.error('Failed to switch network:', error)
  }
}

export const switchNetwork = (network: Networks) => async (dispatch: any) => {
  const chainId = getNetworkChainId(network, false)
  return dispatch(switchNetworkWithChainId(chainId))
}

export default networkSlice.reducer