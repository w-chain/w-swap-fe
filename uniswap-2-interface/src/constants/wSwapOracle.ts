import { ChainId } from '@uniswap/sdk'

/** @see https://docs.w-chain.com/advanced-features/w-swap-trade-volume-api */
export const W_SWAP_ORACLE_BASE =
  process.env.REACT_APP_W_SWAP_ORACLE_URL?.replace(/\/$/, '') ?? 'https://oracle.w-chain.com/api'

/** Mainnet W-Swap `trade_pairs` indexed by pair contract address (lowercase). */
export const W_SWAP_TRADE_PAIR_IDS: Record<string, number> = {
  '0x35264f0e8cd7a32341f47dbfbf2d85b81fd0ef0a': 1, // WAVE/WCO
  '0xd4e9176d5189dbb24f40e5c6c45bb1682dcb3324': 2, // USDT/WCO
  '0x00d91ce419c068e36928fd8e9379b11d0011f052': 3, // USDC/WCO
  '0x9556d7afa868cb8b25657d34f3e0d46929f9d710': 4, // SOL/WCO
  '0x8b5f11ea77641b208fb53b4b91b2825db64b8c32': 5, // DOGE/WCO
  '0x24f07de79398f24c9d4dd60a281a29843e43b7fd': 6 // XRP/WCO
}

export const W_SWAP_LP_FEE_BPS = 30 // 0.30%

export function getWSwapTradePairId(pairAddress?: string, chainId?: ChainId): number | undefined {
  if (!pairAddress || chainId !== ChainId.WCHAIN) return undefined
  return W_SWAP_TRADE_PAIR_IDS[pairAddress.toLowerCase()]
}

export function isWSwapOracleSupportedChain(chainId?: ChainId): boolean {
  return chainId === ChainId.WCHAIN
}
