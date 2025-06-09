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
    default:
      return '';
  }
}