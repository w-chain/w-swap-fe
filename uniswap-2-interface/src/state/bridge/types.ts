export enum TransactionStatus {
  PENDING = 'PENDING',
  AWAITING = 'AWAITING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface BridgeTransaction {
  fromChainId: number
  toChainId: number
  originDomainId: number
  destinationDomainId: number
  resourceId: string
  depositNonce: string
  amount: number
  tokenAddress: string
  tokenSymbol: string
  sender: string
  recipient: string
  txHash: string
  data: string
  status: TransactionStatus
  timestamp: number
} 