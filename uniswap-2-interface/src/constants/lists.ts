// the Uniswap Default token list lives here

import { TokenList } from '@uniswap/token-lists'
import wadzTokenListJSON from './token-list/token-list.json'

// Define the URL directly
const wadzTokenListURL = '/token-list/token-list.json'

/** NOTE: Wadz-specific */
/* This is the token list for wadzchain, it is deployed along the interface as a static file */
const wadzTokenList = window.location.origin + wadzTokenListURL
export const DEFAULT_TOKEN_LIST_URL = wadzTokenList

/** NOTE: Wadz-specific */
export const DEFAULT_LIST_OF_LISTS: string[] = [wadzTokenList]

/** NOTE: Wadz-specific */
/* This is hard-coded token list to be used while nothing is fetched yet */
export const DEFAULT_TOKEN_LIST: TokenList = wadzTokenListJSON
