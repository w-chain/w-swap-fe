export enum TokenSymbols {
  USDT = 'USDT',
  USDC = 'USDC',
  bUSDT = 'bUSDT',
  bUSDC = 'bUSDC'
}

export const getTokenImage = (token: TokenSymbols): string => {
  switch (token) {
    case TokenSymbols.USDT:
      return '/images/tokens/usdt.png'
    case TokenSymbols.USDC:
      return '/images/tokens/usdc.png'
    case TokenSymbols.bUSDT:
      return '/images/tokens/busdt.png'
    case TokenSymbols.bUSDC:
      return '/images/tokens/busdc.png'
    default:
      return ''
  }
}

export const getBSCTargetToken = (token: TokenSymbols): TokenSymbols => {
  switch (token) {
    case TokenSymbols.USDT:
      return TokenSymbols.bUSDT
    case TokenSymbols.USDC:
      return TokenSymbols.bUSDC
    case TokenSymbols.bUSDT:
      return TokenSymbols.USDT
    case TokenSymbols.bUSDC:
      return TokenSymbols.USDC
    default:
      return token
  }
} 