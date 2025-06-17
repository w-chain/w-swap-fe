import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL ?? 'https://rpc.w-chain.com'

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '171717')

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 171717, 71117, 56]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: 'https://ethereum-rpc.publicnode.com', 171717: 'https://rpc.w-chain.com', 56: 'https://bsc-rpc.publicnode.com' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  // @ts-ignore
  pollingInterval: 15000
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'WSwap',
  appLogoUrl:
    'https://w-chain-data.s3.eu-north-1.amazonaws.com/images/wchain-logo-no-bg.png'
})
