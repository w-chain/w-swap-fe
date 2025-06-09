export const getDomainId = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return 0;
    case ChainId.ETH:
    case ChainId.SEPOLIA:
      return 1;
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
      return 2;
    default:
      throw new Error('getDomainId: Invalid network');
  }
}