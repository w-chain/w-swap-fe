import { Networks, ChainId } from '../types'

export function getNetworkChainId(network: Networks, isTestnet: boolean = false): ChainId {
  switch (network) {
    case Networks.ETH:
      return isTestnet? ChainId.SEPOLIA : ChainId.ETH;
    case Networks.WCHAIN:
      return isTestnet? ChainId.WCHAIN_TESTNET : ChainId.WCHAIN;
    case Networks.BSC:
      return isTestnet? ChainId.BSC_TESTNET : ChainId.BSC;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export function getNetworkFromChainId(chainId: number): Networks {
  switch (chainId) {
    case ChainId.ETH:
    case ChainId.SEPOLIA:
      return Networks.ETH;
    case ChainId.WCHAIN:
    case ChainId.WCHAIN_TESTNET:
      return Networks.WCHAIN;
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
      return Networks.BSC;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}

export function getNetworkImage(network: Networks): string {

  switch (network) {
    case Networks.ETH :
      return '/images/networks/eth.webp';
    case Networks.WCHAIN:
      return '/images/networks/w-chain.webp';
    case Networks.BSC:
      return '/images/networks/bsc.webp';
    default:
      return '';
  }
}

export function getNetworkNativeToken(network: Networks) {
  switch (network) {
    case Networks.ETH:
      return 'ETH';
    case Networks.WCHAIN:
      return 'WCO';
    case Networks.BSC:
      return 'BNB';
    default:
      return '';
  }
}

export function getExplorerTxUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.SEPOLIA:
      return 'https://sepolia.etherscan.io/tx/'
    case ChainId.WCHAIN_TESTNET:
      return 'https://scan-testnet.w-chain.com/tx/'
    case ChainId.WCHAIN:
      return 'https://scan.w-chain.com/tx/'
    case ChainId.BSC_TESTNET:
      return 'https://testnet.bscscan.com/tx/'
    case ChainId.BSC:
      return 'https://bscscan.com/tx/'
    case ChainId.ETH:
    default:
      return 'https://etherscan.io/tx/'
  }
}