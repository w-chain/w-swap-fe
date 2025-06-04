import { ChainId, Token } from '@uniswap/sdk'

export const WETH = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.WCHAIN]: new Token(ChainId.WCHAIN, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.WCHAIN_TESTNET]: new Token(ChainId.WCHAIN_TESTNET, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.BNB]: new Token(ChainId.BNB, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')
}

export const WUSD = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'WUSD', 'Wrapped USD'),
  [ChainId.WCHAIN]: new Token(ChainId.WCHAIN, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 18, 'WUSD', 'Wrapped USD'),
  [ChainId.WCHAIN_TESTNET]: new Token(ChainId.WCHAIN_TESTNET, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 18, 'WUSD', 'Wrapped USD'),
  [ChainId.BNB]: new Token(ChainId.BNB, '0x55d398326f99059fF775485246999027B3197955', 18, 'WUSD', 'Wrapped USD')
}

export const WCHAIN = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WCHAIN', 'Wrapped Chain'),
  [ChainId.WCHAIN]: new Token(ChainId.WCHAIN, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WCHAIN', 'Wrapped Chain'),
  [ChainId.WCHAIN_TESTNET]: new Token(ChainId.WCHAIN_TESTNET, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WCHAIN', 'Wrapped Chain'),
  [ChainId.BNB]: new Token(ChainId.BNB, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WCHAIN', 'Wrapped Chain')
} 