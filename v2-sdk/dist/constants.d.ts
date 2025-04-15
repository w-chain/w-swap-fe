import JSBI from 'jsbi';
export declare type BigintIsh = JSBI | bigint | string;
export declare const WADZCHAIN_CHAIN_ID: ChainId;
/** NOTE: Wadz-specific */
export declare enum ChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    WADZCHAIN_MAINNET,
    BNB = 56
}
/** NOTE: Wadz-specific */
export declare const WADZCHAIN_RPC_URL = "https://rpc.wadzchain.io";
export declare const WADZCHAIN_WWCO_ADDRESS = "0x2996F51be16a9ee9A0a867f7518D55908F6B44CA";
export declare const BNB_WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const getInitCodeHash: (chainId: ChainId) => string;
export declare const getFactoryAddress: (chainId: ChainId) => string;
export declare const getRouterAddress: (chainId: ChainId) => string;
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TWO: JSBI;
export declare const THREE: JSBI;
export declare const FIVE: JSBI;
export declare const TEN: JSBI;
export declare const _100: JSBI;
export declare const _997: JSBI;
export declare const _1000: JSBI;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
