import type { TransactionStatus } from "./enums";

export type BridgeTransaction = {
  fromChainId: number;
  toChainId: number;
  originDomainId: number;
  destinationDomainId: number;
  resourceId: string;
  depositNonce: string;
  amount: number;
  tokenAddress: string;
  tokenSymbol: string;
  sender: string;
  recipient: string;
  txHash: string;
  data: string;
  status: TransactionStatus;
  timestamp: number;
}