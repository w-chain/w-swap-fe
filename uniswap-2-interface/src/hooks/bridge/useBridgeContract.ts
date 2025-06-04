import { useCallback } from 'react'
import { useContract } from './useContract'
import { BRIDGE_ABI } from '../../constants/bridge/abis/bridge'
import { BRIDGE_CONTRACT_ADDRESSES } from '../../constants/bridge/addresses'
import { useActiveWeb3React } from '../index'
import { Contract } from '@ethersproject/contracts'

export function useBridgeContract() {
  const { chainId } = useActiveWeb3React()
  const contract = useContract(
    chainId ? BRIDGE_CONTRACT_ADDRESSES[chainId] : undefined,
    BRIDGE_ABI
  ) as Contract | null

  const deposit = useCallback(
    async (amount: string, recipient: string, token: string, destinationChainId: number) => {
      if (!contract) return
      try {
        const tx = await contract.deposit(
          amount,
          recipient,
          token,
          destinationChainId
        )
        return tx
      } catch (error) {
        console.error('Bridge deposit error:', error)
        throw error
      }
    },
    [contract]
  )

  const getHandlerAllowance = useCallback(
    async (token: string, handler: string) => {
      if (!contract) return
      try {
        const allowance = await contract.getHandlerAllowance(token, handler)
        return allowance
      } catch (error) {
        console.error('Get handler allowance error:', error)
        throw error
      }
    },
    [contract]
  )

  return {
    contract,
    deposit,
    getHandlerAllowance
  }
} 