import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string
export const WADZCHAIN_CHAIN_ID: ChainId = 171717 as const
/** NOTE: Wadz-specific */
export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  WADZCHAIN_MAINNET = WADZCHAIN_CHAIN_ID,
  BNB = 56
}
/** NOTE: Wadz-specific */
export const WADZCHAIN_RPC_URL = 'https://rpc.wadzchain.io'
export const WADZCHAIN_WWCO_ADDRESS = '0x2996F51be16a9ee9A0a867f7518D55908F6B44CA'
export const BNB_WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

/** NOTE: Wadz-specific */
const INIT_CODE_HASH = '0xef8ef663d992dea71acf872a41c6c344699e481f62330c39dae2be4102890f7a'
const INIT_CODE_HASH_MAP = {
  [ChainId.BNB]: '0xef8ef663d992dea71acf872a41c6c344699e481f62330c39dae2be4102890f7a',
  [ChainId.MAINNET]: '0xef8ef663d992dea71acf872a41c6c344699e481f62330c39dae2be4102890f7a',
  [ChainId.WADZCHAIN_MAINNET]: '0xef8ef663d992dea71acf872a41c6c344699e481f62330c39dae2be4102890f7a'
}

export const getInitCodeHash = (chainId: ChainId) => {
  return INIT_CODE_HASH_MAP[chainId] || INIT_CODE_HASH
}

const FACTORY_ADDRESS = '0x9A9bed06107B0036361DE7320042918c029EDB78'
const FACTORY_ADDRESS_MAP = {
  [ChainId.BNB]: '0x2996F51be16a9ee9A0a867f7518D55908F6B44CA',
  [ChainId.MAINNET]: '0x65166A8f9C8bC43fA0647F088FCDb9B044C9F48D',
  [ChainId.WADZCHAIN_MAINNET]: '0x9A9bed06107B0036361DE7320042918c029EDB78'
}

export const getFactoryAddress = (chainId: ChainId) => {
  return FACTORY_ADDRESS_MAP[chainId] || FACTORY_ADDRESS
}

const ROUTER_ADDRESS = '0xdbA784B3A27a5dBFCa0739eD3E8EFdea2bF8F663'
const ROUTER_ADDRESS_MAP = {
  [ChainId.BNB]: '0x65166A8f9C8bC43fA0647F088FCDb9B044C9F48D',
  [ChainId.MAINNET]: '0xaD2DD426639fE954f6c47f55758CCF9AFC535BE0',
  [ChainId.WADZCHAIN_MAINNET]: '0xdbA784B3A27a5dBFCa0739eD3E8EFdea2bF8F663'
}

export const getRouterAddress = (chainId: ChainId) => {
  return ROUTER_ADDRESS_MAP[chainId] || ROUTER_ADDRESS
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
