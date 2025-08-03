import { TokenSymbols, Networks } from "../types";
import { getTokenBySymbol } from "../registry/tokens";
import { Token } from "@uniswap/sdk";

export function getBSCTargetToken(token: TokenSymbols) {
  switch (token) {
    case TokenSymbols.USDT:
      return TokenSymbols.bUSDT;
    case TokenSymbols.USDC:
      return TokenSymbols.bUSDC;
    case TokenSymbols.bUSDT:
      return TokenSymbols.USDT;
    case TokenSymbols.bUSDC:
      return TokenSymbols.USDC;
    case TokenSymbols.SOL:
      return TokenSymbols.SOL;
    case TokenSymbols.DOGE:
      return TokenSymbols.DOGE;
    default:
      throw new Error(`Unsupported token: ${token}`);
  }
}

export function getTokenImage(token: TokenSymbols) {
  switch (token) {
    case TokenSymbols.USDT:
      return '/images/tokens/usdt.webp';
    case TokenSymbols.bUSDT:
      return '/images/tokens/busdt.webp';
    case TokenSymbols.USDC:
      return '/images/tokens/usdc.webp';
    case TokenSymbols.bUSDC:
      return '/images/tokens/busdc.webp';
    case TokenSymbols.SOL:
      return '/images/tokens/sol.webp';
    case TokenSymbols.DOGE:
      return '/images/tokens/doge.webp';
    default:
      return '';
  }
}

export function getAvailableFromTokens(from: Networks, to: Networks): TokenSymbols[] {
  if (from === Networks.WCHAIN && to === Networks.BSC) {
    return [TokenSymbols.bUSDT, TokenSymbols.bUSDC, TokenSymbols.SOL, TokenSymbols.DOGE]
  }
  if (from === Networks.BSC && to === Networks.WCHAIN) {
    return [TokenSymbols.USDT, TokenSymbols.USDC, TokenSymbols.SOL, TokenSymbols.DOGE]
  }
  return [TokenSymbols.USDT, TokenSymbols.USDC]
}

export function getTokenAsUniV2Token(symbol: TokenSymbols, chainId: number) {
  const token = getTokenBySymbol(chainId, symbol);
  if (!token) return undefined;
  return new Token(
    chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name
  )
}