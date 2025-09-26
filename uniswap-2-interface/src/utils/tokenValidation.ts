import { Token } from '@uniswap/sdk'
import tokenList from '../constants/token-list/token-list.json'

interface TokenListToken {
  name: string
  symbol: string
  address: string
  decimals: number
  chainId: number
  logoURI?: string
}

interface TokenList {
  name: string
  tokens: TokenListToken[]
}

/**
 * Get all official tokens from the token list for a specific chain
 */
export function getOfficialTokens(chainId: number): TokenListToken[] {
  const typedTokenList = tokenList as TokenList
  return typedTokenList.tokens.filter(token => token.chainId === chainId)
}

/**
 * Check if a token address is in the official token list for the given chain
 */
export function isTokenInOfficialList(tokenAddress: string, chainId: number): boolean {
  const officialTokens = getOfficialTokens(chainId)
  return officialTokens.some(token => 
    token.address.toLowerCase() === tokenAddress.toLowerCase()
  )
}

/**
 * Check if a token is WCO (the native token equivalent)
 * WCO should always be allowed without warning
 */
export function isWCOToken(token: Token | string): boolean {
  if (typeof token === 'string') {
    return token.toUpperCase() === 'WCO' || token.toUpperCase() === 'ETH'
  }
  
  // Check if it's WCO by symbol
  if (token.symbol?.toUpperCase() === 'WCO' || token.symbol?.toUpperCase() === 'ETH') {
    return true
  }
  
  // Check if it's a wrapped WCO token
  if (token.symbol?.toUpperCase() === 'WWCO') {
    return true
  }
  
  return false
}

/**
 * Filter tokens that should show warnings
 * Returns only tokens that are NOT in the official list and are NOT WCO
 */
export function getTokensRequiringWarning(tokens: Token[], chainId: number): Token[] {
  return tokens.filter(token => {
    // Always allow WCO without warning
    if (isWCOToken(token)) {
      return false
    }
    
    // Show warning if token is not in official list
    return !isTokenInOfficialList(token.address, chainId)
  })
}

/**
 * Check if any of the provided tokens require a warning
 */
export function shouldShowTokenWarning(tokens: Token[], chainId: number): boolean {
  const tokensRequiringWarning = getTokensRequiringWarning(tokens, chainId)
  return tokensRequiringWarning.length > 0
}