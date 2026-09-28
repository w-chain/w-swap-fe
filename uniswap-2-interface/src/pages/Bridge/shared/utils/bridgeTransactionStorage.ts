import { BridgeTransaction } from '../types/transaction'
import { TransactionStatus } from '../types/enums'

export const BRIDGE_TRANSACTIONS_STORAGE_KEY = 'bridge_transactions'

export function normalizeBridgeStatus(raw: unknown): TransactionStatus | null {
  if (raw == null || raw === '') return null

  if (typeof raw === 'number') {
    if (raw === 3) return TransactionStatus.SUCCESS
    if (raw === 2) return TransactionStatus.AWAITING
    if (raw === 1) return TransactionStatus.PENDING
    return TransactionStatus.PENDING
  }

  const value = String(raw).trim()
  if ((Object.values(TransactionStatus) as string[]).includes(value)) {
    return value as TransactionStatus
  }
  if (/^success(ful)?$/i.test(value) || /transaction successful/i.test(value)) {
    return TransactionStatus.SUCCESS
  }
  if (/fail/i.test(value)) return TransactionStatus.FAILED
  if (/reject/i.test(value)) return TransactionStatus.REJECTED
  if (/await|validator/i.test(value)) return TransactionStatus.AWAITING
  if (/pending|submitted|init/i.test(value)) return TransactionStatus.PENDING

  return null
}

function normalizeTimestamp(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Date.parse(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return Date.now()
}

/** Coerce legacy / slightly malformed localStorage rows into BridgeTransaction. */
export function normalizeStoredBridgeTransaction(raw: unknown): BridgeTransaction | null {
  if (!raw || typeof raw !== 'object') return null

  const tx = raw as Record<string, unknown>
  const txHash = String(tx.txHash ?? tx.hash ?? tx.transactionHash ?? '').trim()
  if (!txHash.startsWith('0x')) return null

  const fromChainId = Number(tx.fromChainId ?? tx.from ?? tx.sourceChainId)
  const toChainId = Number(tx.toChainId ?? tx.to ?? tx.destinationChainId)
  if (!Number.isFinite(fromChainId) || !Number.isFinite(toChainId)) return null

  const status = normalizeBridgeStatus(tx.status)
  if (!status) return null

  return {
    fromChainId,
    toChainId,
    originDomainId: Number(tx.originDomainId ?? 0),
    destinationDomainId: Number(tx.destinationDomainId ?? 0),
    resourceId: String(tx.resourceId ?? ''),
    depositNonce: String(tx.depositNonce ?? '0'),
    amount: Number(tx.amount ?? 0),
    tokenAddress: String(tx.tokenAddress ?? ''),
    tokenSymbol: String(tx.tokenSymbol ?? ''),
    sender: String(tx.sender ?? ''),
    recipient: String(tx.recipient ?? tx.toAddress ?? ''),
    txHash,
    data: String(tx.data ?? ''),
    status,
    timestamp: normalizeTimestamp(tx.timestamp)
  }
}

export function isBridgeTransactionPending(status: TransactionStatus): boolean {
  return (
    status === TransactionStatus.PENDING ||
    status === TransactionStatus.AWAITING ||
    status === TransactionStatus.SUBMITTED ||
    status === TransactionStatus.INIT
  )
}

export function isBridgeTransactionCompleted(status: TransactionStatus): boolean {
  return (
    status === TransactionStatus.SUCCESS ||
    status === TransactionStatus.FAILED ||
    status === TransactionStatus.REJECTED
  )
}
