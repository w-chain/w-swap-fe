import { useCallback, useMemo, useState, useEffect } from 'react'
import { ChainId, TransactionStatus } from '../../shared/types'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../../../hooks'
import Token from '../../shared/objects/token'
import { getDomainId } from '../../shared/utils'
import { utils, BigNumber } from 'ethers'
import { useContract } from '../../../../hooks/useContract'
import { BRIDGE_CONTRACT_REGISTRY } from '../../shared/contracts/bridge'
import { BRIDGE_ABI } from '../../shared/abi/bridge'
import { useTransaction } from './useTransaction'

export function useBridgeContract() {
  const { account, chainId } = useActiveWeb3React()
  const contract = useContract(
    chainId ? BRIDGE_CONTRACT_REGISTRY[chainId]?.bridge : undefined,
    BRIDGE_ABI
  )
  const { addTransaction, updateDepositNonce, updateTransactionStatus } = useTransaction()
  const [fee, setFee] = useState<BigNumber | null>(null)
  const [feeLoading, setFeeLoading] = useState<boolean>(false)

  // Get bridge fee
  const getFee = useCallback(async (): Promise<BigNumber | null> => {
    if (!contract) return null
    
    try {
      setFeeLoading(true)
      const feeValue = await contract._fee()
      setFee(feeValue)
      return feeValue
    } catch (error) {
      console.error('Failed to get bridge fee:', error)
      return null
    } finally {
      setFeeLoading(false)
    }
  }, [contract])

  // Auto-fetch fee when contract or chainId changes
  useEffect(() => {
    if (contract && chainId) {
      getFee()
    }
  }, [contract, chainId, getFee])

  const deposit = useCallback(async (amount: number, token: Token, destinationChainId: number) => {
    if (!account || !chainId || !contract || !token || !destinationChainId) return

    if (Number(token.chainId) !== Number(chainId)) {
      console.error("Wrong Network")
      return
    }

    const domainId = getDomainId(destinationChainId)

    const data = utils.hexConcat([
      // Deposit Amount (32 bytes)
      utils.hexZeroPad(
        utils.hexValue(utils.parseUnits(amount.toString(), token.decimals)),
        32
      ),
      // Length of recipient address (32 bytes)
      utils.hexZeroPad(
        utils.hexValue(20), // Fixed length for Ethereum address (20 bytes)
        32
      ),
      // Recipient address (20 bytes)
      utils.hexZeroPad(account, 20),
    ]);

    if (!contract) {
      console.error("Bridge contract not found")
      return
    }

    // Get current fee for the transaction
    const currentFee = await getFee()
    if (!currentFee) {
      console.error("Failed to get bridge fee")
      return
    }

    return contract
      .deposit(domainId, token.resourceId, data, { value: currentFee })
      .then( async (response: TransactionResponse) => {
        addTransaction({
          fromChainId: chainId,
          toChainId: destinationChainId,
          originDomainId: getDomainId(Number(chainId)),
          destinationDomainId: domainId,
          resourceId: token.resourceId,
          depositNonce: '0',
          data: data,
          amount: amount,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          sender: account!,
          recipient: account,
          txHash: response.hash,
          status: TransactionStatus.PENDING,
          timestamp: Date.now(),
        });

        const res = await response.wait();
        if (response.hash && res && res.status === 1) {
          const depositLog = res.logs.find(log => {
            try {
              const parsed = contract.interface.parseLog(log);
              return parsed?.name === "Deposit";
            } catch {
              return false;
            }
          });
        
          if (depositLog) {
            const parsedLog = contract.interface.parseLog(depositLog);
            if (parsedLog && parsedLog.args) {
              const depositNonce = parsedLog.args.depositNonce;
              updateDepositNonce(response.hash, String(depositNonce));
              updateTransactionStatus(response.hash, TransactionStatus.AWAITING);
            }
          } else {
            console.error("Deposit event not found");
          }
        }
        return response;
      })
      .catch((error: Error) => {
        console.debug('Failed to bridge token', error)
        throw error
      })
  }, [account, chainId, contract, addTransaction, updateDepositNonce, updateTransactionStatus])  

  return {
    deposit,
    getFee,
    fee,
    feeLoading,
    feeInEth: fee ? utils.formatEther(fee) : null
  }
}