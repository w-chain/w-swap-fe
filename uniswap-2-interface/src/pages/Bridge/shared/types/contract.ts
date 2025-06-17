export type SupportedChainId = 1 | 11155111 | 56 | 97 | 171717 | 71117;

export type BridgeContracts = {
  bridge: string;
  erc20Handler: string;
}

export type BridgeContractsMap = {
  [key in SupportedChainId]: BridgeContracts;
}