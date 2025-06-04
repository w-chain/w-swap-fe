import { ChainId } from './chainId'

// Alchemy API key should be stored in environment variables
const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY || ''

export const RPC_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  [ChainId.WCHAIN]: 'https://rpc.w-chain.com',
  [ChainId.WCHAIN_TESTNET]: 'https://rpc-testnet.w-chain.com',
  [ChainId.BNB]: `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
} 