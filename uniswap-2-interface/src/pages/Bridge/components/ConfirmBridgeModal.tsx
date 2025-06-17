import React, { useCallback } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../../../components/TransactionConfirmationModal'
import BridgeModalHeader from './BridgeModalHeader'
import BridgeModalFooter from './BridgeModalFooter'
import { Networks, TokenSymbols } from '../shared/types'

export default function ConfirmBridgeModal({
  amount,
  tokenSymbol,
  fromNetwork,
  toNetwork,
  onConfirm,
  onDismiss,
  bridgeErrorMessage,
  isOpen,
  attemptingTxn,
  txHash
}: {
  isOpen: boolean
  amount?: number
  tokenSymbol?: TokenSymbols
  fromNetwork: Networks
  toNetwork: Networks
  attemptingTxn: boolean
  txHash: string | undefined
  onConfirm: () => void
  bridgeErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const modalHeader = useCallback(() => {
    return amount && tokenSymbol ? (
      <BridgeModalHeader
        amount={amount}
        tokenSymbol={tokenSymbol}
        fromNetwork={fromNetwork}
        toNetwork={toNetwork}
      />
    ) : null
  }, [amount, tokenSymbol, fromNetwork, toNetwork])

  const modalBottom = useCallback(() => {
    return amount && tokenSymbol ? (
      <BridgeModalFooter
        onConfirm={onConfirm}
        amount={amount}
        tokenSymbol={tokenSymbol}
        fromNetwork={fromNetwork}
        toNetwork={toNetwork}
        bridgeErrorMessage={bridgeErrorMessage}
      />
    ) : null
  }, [onConfirm, amount, tokenSymbol, fromNetwork, toNetwork, bridgeErrorMessage])

  // text to show while loading
  const pendingText = `Moving ${amount} ${tokenSymbol} from ${fromNetwork} to ${toNetwork}`

  const confirmationContent = useCallback(
    () =>
      bridgeErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={bridgeErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Bridge Transaction"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, bridgeErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}