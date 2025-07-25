import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletlink } from '../connectors'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')

export const WCHAIN_TOKENS = {
  USDT: new Token(ChainId.WCHAIN, '0x40CB2CCcF80Ed2192b53FB09720405F6Fe349743', 6, 'USDT', 'Tether USD'),
  USDC: new Token(ChainId.WCHAIN, '0x643eC74Ed2B79098A37Dc45dcc7F1AbfE2AdE6d8', 6, 'USDC', 'USD Coin'),
}

export const WCHAIN_TESTNET_TOKENS = {
  USDT: new Token(ChainId.WCHAIN_TESTNET, '0x9D6d68774326b2100adD0aA29C928Ed7bdC3B127', 6, 'USDT', 'Tether USD'),
  USDC: new Token(ChainId.WCHAIN_TESTNET, '0x1aB74716E3Ec78c71967a846199407c351094c45', 6, 'USDC', 'USD Coin'),
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.WCHAIN]: [WETH[ChainId.WCHAIN]],
  [ChainId.WCHAIN_TESTNET]: [WETH[ChainId.WCHAIN_TESTNET]],
  [ChainId.BNB]: [WETH[ChainId.BNB]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC, USDT],
  [ChainId.WCHAIN]: [...WETH_ONLY[ChainId.WCHAIN], WCHAIN_TOKENS.USDT, WCHAIN_TOKENS.USDC],
  [ChainId.WCHAIN_TESTNET]: [...WETH_ONLY[ChainId.WCHAIN_TESTNET], WCHAIN_TESTNET_TOKENS.USDT, WCHAIN_TESTNET_TOKENS.USDC],
  [ChainId.BNB]: [...WETH_ONLY[ChainId.BNB]]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    // tokenAddress: [ bases ]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC, USDT],
  [ChainId.WCHAIN]: [...WETH_ONLY[ChainId.WCHAIN], WCHAIN_TOKENS.USDT, WCHAIN_TOKENS.USDC],
  [ChainId.WCHAIN_TESTNET]: [...WETH_ONLY[ChainId.WCHAIN_TESTNET], WCHAIN_TESTNET_TOKENS.USDT, WCHAIN_TESTNET_TOKENS.USDC],
  [ChainId.BNB]: [...WETH_ONLY[ChainId.BNB]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC, USDT],
  [ChainId.WCHAIN]: [...WETH_ONLY[ChainId.WCHAIN], WCHAIN_TOKENS.USDT, WCHAIN_TOKENS.USDC],
  [ChainId.WCHAIN_TESTNET]: [...WETH_ONLY[ChainId.WCHAIN_TESTNET], WCHAIN_TESTNET_TOKENS.USDT, WCHAIN_TESTNET_TOKENS.USDC],
  [ChainId.BNB]: [...WETH_ONLY[ChainId.BNB]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [WETH[ChainId.MAINNET], USDT],
    [USDC, USDT],
    [DAI, USDT]
  ],
  [ChainId.WCHAIN]: [
    [WETH[ChainId.WCHAIN], WCHAIN_TOKENS.USDT],
    [WETH[ChainId.WCHAIN], WCHAIN_TOKENS.USDC],
    [WCHAIN_TOKENS.USDC, WCHAIN_TOKENS.USDT]
  ],
  [ChainId.WCHAIN_TESTNET]: [
    [WETH[ChainId.WCHAIN_TESTNET], WCHAIN_TESTNET_TOKENS.USDT],
    [WETH[ChainId.WCHAIN_TESTNET], WCHAIN_TESTNET_TOKENS.USDC],
    [WCHAIN_TESTNET_TOKENS.USDC, WCHAIN_TESTNET_TOKENS.USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  // WALLET_CONNECT: {
  //   connector: walletconnect,
  //   name: 'WalletConnect',
  //   iconName: 'walletConnectIcon.svg',
  //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true
  // },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
