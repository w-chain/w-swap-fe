// the Uniswap Default token list lives here

import { TokenList } from '@uniswap/token-lists'
import wchainTokenListJSON from './token-list/token-list.json'

// Define the URL directly
const wchainTokenListURL = '/token-list/token-list.json'

/** NOTE: Defined by W Chain */
/* This is the token list for W Chain, it is deployed along the interface as a static file */
const wchainTokenList = window.location.origin + wchainTokenListURL
export const DEFAULT_TOKEN_LIST_URL = wchainTokenList

/** NOTE: Defined by W Chain */
export const DEFAULT_LIST_OF_LISTS: string[] = [wchainTokenList]

/** NOTE: Defined by W Chain */
/* This is hard-coded token list to be used while nothing is fetched yet */
export const DEFAULT_TOKEN_LIST: TokenList = wchainTokenListJSON
