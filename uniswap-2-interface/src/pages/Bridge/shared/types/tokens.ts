import type { SupportedChainId } from "./contract";

export type TokenContracts = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  resourceId: string;
  isNative?: boolean; 
}

export type HandlerAllowances = {
  [key: string]: {
    [key: string]: bigint;
  };
}

export type TokenContractsMap = {
  [key in SupportedChainId]: TokenContracts[];
}