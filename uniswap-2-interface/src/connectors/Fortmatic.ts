import { FortmaticConnector as FortmaticConnectorCore } from '@web3-react/fortmatic-connector'
import { BNB_CHAIN_ID, WADZCHAIN_CHAIN_ID } from '../wadzchain_config'

export const OVERLAY_READY = 'OVERLAY_READY'

type FormaticSupportedChains = 1 | 3 | 4 | 42 | 56

const CHAIN_ID_NETWORK_ARGUMENT: { readonly [chainId in FormaticSupportedChains]: string | undefined } = {
  1: undefined,
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  [WADZCHAIN_CHAIN_ID]: 'wadzchain',
  [BNB_CHAIN_ID]: 'bnb'
}

export class FortmaticConnector extends FortmaticConnectorCore {
  async activate() {
    if (!this.fortmatic) {
      const { default: Fortmatic } = await import('fortmatic')

      const { apiKey, chainId } = this as any
      if (chainId in CHAIN_ID_NETWORK_ARGUMENT) {
        this.fortmatic = new Fortmatic(apiKey, CHAIN_ID_NETWORK_ARGUMENT[chainId as FormaticSupportedChains])
      } else {
        throw new Error(`Unsupported network ID: ${chainId}`)
      }
    }

    const provider = this.fortmatic.getProvider()

    const pollForOverlayReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if (provider.overlayReady) {
          clearInterval(interval)
          this.emit(OVERLAY_READY)
          resolve()
        }
      }, 200)
    })

    const [account] = await Promise.all([
      provider.enable().then((accounts: string[]) => accounts[0]),
      pollForOverlayReady
    ])

    return { provider: this.fortmatic.getProvider(), chainId: (this as any).chainId, account }
  }
}
