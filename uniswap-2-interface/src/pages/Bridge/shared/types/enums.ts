export enum Networks {
  ETH = 'Ethereum',
  WCHAIN = 'W Chain',
  BSC = 'BNB Chain'
}

export enum Tokens {
  USDT = 'USDT',
  USDC = 'USDC',
  bUSDT = 'bUSDT',
  bUSDC = 'bUSDC'
}

export enum TokenSymbols {
  USDT = 'USDT',
  USDC = 'USDC',
  bUSDT = 'bUSDT',
  bUSDC = 'bUSDC'
}

export enum TransactionStatus {
  NO_STATUS = 'No Status',
  INIT = 'Transaction Initialized',
  PENDING = 'Transaction Pending',
  SUBMITTED = 'Transaction Submitted',
  AWAITING = 'Transaction Awaiting Validators Votes',
  SUCCESS = 'Transaction Successful',
  FAILED = 'Transaction Failed',
  REJECTED = 'Transaction Rejected'
}

export enum ChainId {
  ETH = 1,
  SEPOLIA = 11155111,
  BSC = 56,
  BSC_TESTNET = 97,
  WCHAIN = 171717,
  WCHAIN_TESTNET = 71117,
}

export const getEnumValues = <T extends { [key: string]: string }>(enumObj: T): string[] => {
  return Object.values(enumObj);
}