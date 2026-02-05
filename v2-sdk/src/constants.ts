import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string
export enum ChainId {
  MAINNET = 1,
  BNB = 56,
  WCHAIN = 171717,
  WCHAIN_TESTNET = 71117
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

/** NOTE: Defined by W Chain */
const INIT_CODE_HASH = '0x78b9069d48c93365b1d138365ec3f9c761f91bd3a0b9cfda24ba11cf6a8f122e'
const INIT_CODE_HASH_MAP = {
  [ChainId.BNB]: '0x78b9069d48c93365b1d138365ec3f9c761f91bd3a0b9cfda24ba11cf6a8f122e',
  [ChainId.MAINNET]: '0x78b9069d48c93365b1d138365ec3f9c761f91bd3a0b9cfda24ba11cf6a8f122e',
  [ChainId.WCHAIN]: '0x78b9069d48c93365b1d138365ec3f9c761f91bd3a0b9cfda24ba11cf6a8f122e',
  [ChainId.WCHAIN_TESTNET]: '0x78b9069d48c93365b1d138365ec3f9c761f91bd3a0b9cfda24ba11cf6a8f122e'
}

export const getInitCodeHash = (chainId: ChainId) => {
  return INIT_CODE_HASH_MAP[chainId] || INIT_CODE_HASH
}

const FACTORY_ADDRESS = '0x2A44f013aD7D6a1083d8F499605Cf1148fbaCE31'
const FACTORY_ADDRESS_MAP = {
  [ChainId.BNB]: '0x5105989c863e801fC610396529BE9f2A6B95bF0A',
  [ChainId.MAINNET]: '0x46B0B17Bb1f637CcfFA9fCc34bD591E3A0fF58F9',
  [ChainId.WCHAIN]: '0x2A44f013aD7D6a1083d8F499605Cf1148fbaCE31',
  [ChainId.WCHAIN_TESTNET]: '0xc93763715AA0C56cB0D78eDC973DaFbb012E4823'
}

export const getFactoryAddress = (chainId: ChainId) => {
  return FACTORY_ADDRESS_MAP[chainId] || FACTORY_ADDRESS
}

const ROUTER_ADDRESS = '0x617Fe3C8aF56e115e0E9742247Af0d4477240f53'
const ROUTER_ADDRESS_MAP = {
  [ChainId.BNB]: '0xc93763715AA0C56cB0D78eDC973DaFbb012E4823',
  [ChainId.MAINNET]: '0xf3E68De4d32EA2363e2cA21274b18C85aAcc4c2F',
  [ChainId.WCHAIN]: '0x617Fe3C8aF56e115e0E9742247Af0d4477240f53',
  [ChainId.WCHAIN_TESTNET]: '0x65899dA94ED1ed1C5bB6aB264638df736D44B5f3'
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
