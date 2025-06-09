// pages/Bridge/stores/BridgeContract.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contract } from 'ethers'
import { BRIDGE_CONTRACT_REGISTRY } from '../shared/contracts/bridge'
import { ERC20_ABI } from '../shared/abi/token'
import { ChainId } from '../shared/types'
import { BRIDGE_ABI } from '../shared/abi/bridge'

interface BridgeContractState {
  bridgeContract: Contract | null
  handlerContract: Contract | null
  isInitialized: boolean
}

const initialState: BridgeContractState = {
  bridgeContract: null,
  handlerContract: null,
  isInitialized: false
}

const bridgeContractSlice = createSlice({
  name: 'bridgeContract',
  initialState,
  reducers: {
    setBridgeContract: (state, action: PayloadAction<Contract>) => {
      state.bridgeContract = action.payload
    },
    setHandlerContract: (state, action: PayloadAction<Contract>) => {
      state.handlerContract = action.payload
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    }
  }
})

export const { setBridgeContract, setHandlerContract, setInitialized } = bridgeContractSlice.actions

// Thunks
export const initializeContracts = (chainId: ChainId) => async (dispatch: any) => {
  try {
    const bridgeContract = new Contract(
      BRIDGE_CONTRACT_REGISTRY[chainId].bridge,
      BRIDGE_ABI
    )
    const handlerContract = new Contract(
      BRIDGE_CONTRACT_REGISTRY[chainId].erc20Handler,
      ERC20_ABI
    )
    
    dispatch(setBridgeContract(bridgeContract))
    dispatch(setHandlerContract(handlerContract))
    dispatch(setInitialized(true))
  } catch (error) {
    console.error('Failed to initialize contracts:', error)
  }
}

export default bridgeContractSlice.reducer