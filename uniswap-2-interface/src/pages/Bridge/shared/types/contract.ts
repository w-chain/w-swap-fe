export type SupportedChainId = 1 | 171717 | 11155111 | 71117;

export type BridgeContracts = {
  bridge: string;
  erc20Handler: string;
}

export type BridgeContractsMap = {
  [key in SupportedChainId]: BridgeContracts;
}