import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getChainConfig } from '../constants/chains'
import { ChainId } from '@uniswap/sdk'

export enum SwitchChainErrorType {
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  USER_REJECTED = 'USER_REJECTED',
  NO_WALLET = 'NO_WALLET',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class SwitchChainError extends Error {
  type: SwitchChainErrorType
  chainId?: number

  constructor(
    message: string,
    type: SwitchChainErrorType,
    chainId?: number
  ) {
    super(message)
    this.name = 'SwitchChainError'
    this.type = type
    this.chainId = chainId
  }
}

export function useSwitchChain() {
  const switchChain = useCallback(async (targetChainId: ChainId): Promise<void> => {
    if (!window.ethereum) {
      throw new SwitchChainError(
        'No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.',
        SwitchChainErrorType.NO_WALLET
      )
    }

    const hexChainId = `0x${targetChainId.toString(16)}`
    const chainConfig = getChainConfig(targetChainId)

    if (!chainConfig) {
      throw new SwitchChainError(
        `Chain ${targetChainId} is not supported`,
        SwitchChainErrorType.UNSUPPORTED_CHAIN,
        targetChainId
      )
    }

    const ethereum = window.ethereum as any

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }]
      })
    } catch (switchError) {
      const error = switchError as { code: number; message?: string }
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                chainName: chainConfig.chainName,
                nativeCurrency: chainConfig.nativeCurrency,
                rpcUrls: chainConfig.rpcUrls,
                blockExplorerUrls: chainConfig.blockExplorerUrls
              }
            ]
          })
        } catch (addError) {
          const addErr = addError as { code: number; message?: string }
          if (addErr.code === 4001) {
            throw new SwitchChainError(
              'User rejected adding the network',
              SwitchChainErrorType.USER_REJECTED,
              targetChainId
            )
          }
          throw new SwitchChainError(
            `Failed to add network: ${addErr.message || 'Unknown error'}`,
            SwitchChainErrorType.UNKNOWN_ERROR,
            targetChainId
          )
        }
      } else if (error.code === 4001) {
        throw new SwitchChainError(
          'User rejected the network switch',
          SwitchChainErrorType.USER_REJECTED,
          targetChainId
        )
      } else {
        throw new SwitchChainError(
          `Failed to switch network: ${error.message || 'Unknown error'}`,
          SwitchChainErrorType.UNKNOWN_ERROR,
          targetChainId
        )
      }
    }
  }, [])

  return { switchChain }
}
