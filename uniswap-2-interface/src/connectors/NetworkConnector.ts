import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import invariant from 'tiny-invariant'

// Custom error for chain switching
class ChainSwitchError extends Error {
  constructor(message: string, public chainId: number, public code?: string) {
    super(message)
    this.name = 'ChainSwitchError'
  }
}

interface NetworkConnectorArguments {
  urls: { [chainId: number]: string }
  defaultChainId?: number
}

// taken from ethers.js, compatible interface with web3 provider
type AsyncSendable = {
  isMetaMask?: boolean
  host?: string
  path?: string
  sendAsync?: (request: any, callback: (error: any, response: any) => void) => void
  send?: (request: any, callback: (error: any, response: any) => void) => void
}

class RequestError extends Error {
  constructor(message: string, public code: number, public data?: unknown) {
    super(message)
  }
}

interface BatchItem {
  request: { jsonrpc: '2.0'; id: number; method: string; params: unknown }
  resolve: (result: any) => void
  reject: (error: Error) => void
}

class MiniRpcProvider implements AsyncSendable {
  public readonly isMetaMask: false = false
  public readonly chainId: number
  public readonly url: string
  public readonly host: string
  public readonly path: string
  public readonly batchWaitTimeMs: number

  private nextId = 1
  private batchTimeoutId: ReturnType<typeof setTimeout> | null = null
  private batch: BatchItem[] = []

  constructor(chainId: number, url: string, batchWaitTimeMs?: number) {
    this.chainId = chainId
    this.url = url
    const parsed = new URL(url)
    this.host = parsed.host
    this.path = parsed.pathname
    // how long to wait to batch calls
    this.batchWaitTimeMs = batchWaitTimeMs ?? 50
  }

  public readonly clearBatch = async () => {
    const batch = this.batch
    this.batch = []
    this.batchTimeoutId = null
    let response: Response
    try {
      response = await fetch(this.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(batch.map(item => item.request))
      })
    } catch (error) {
      batch.forEach(({ reject }) => reject(new Error('Failed to send batch call')))
      return
    }

    if (!response.ok) {
      batch.forEach(({ reject }) => reject(new RequestError(`${response.status}: ${response.statusText}`, -32000)))
      return
    }

    let json
    try {
      json = await response.json()
    } catch (error) {
      batch.forEach(({ reject }) => reject(new Error('Failed to parse JSON response')))
      return
    }
    const byKey = batch.reduce<{ [id: number]: BatchItem }>((memo, current) => {
      memo[current.request.id] = current
      return memo
    }, {})
    for (const result of json) {
      const {
        resolve,
        reject,
        request: { method }
      } = byKey[result.id]
      if (resolve && reject) {
        if ('error' in result) {
          reject(new RequestError(result?.error?.message, result?.error?.code, result?.error?.data))
        } else if ('result' in result) {
          resolve(result.result)
        } else {
          reject(new RequestError(`Received unexpected JSON-RPC response to ${method} request.`, -32000, result))
        }
      }
    }
  }

  public readonly sendAsync = (
    request: { jsonrpc: '2.0'; id: number | string | null; method: string; params?: unknown[] | object },
    callback: (error: any, response: any) => void
  ): void => {
    this.request(request.method, request.params)
      .then(result => callback(null, { jsonrpc: '2.0', id: request.id, result }))
      .catch(error => callback(error, null))
  }

  public readonly request = async (
    method: string | { method: string; params: unknown[] },
    params?: unknown[] | object
  ): Promise<unknown> => {
    if (typeof method !== 'string') {
      return this.request(method.method, method.params)
    }
    if (method === 'eth_chainId') {
      return `0x${this.chainId.toString(16)}`
    }
    const promise = new Promise((resolve, reject) => {
      this.batch.push({
        request: {
          jsonrpc: '2.0',
          id: this.nextId++,
          method,
          params
        },
        resolve,
        reject
      })
    })
    this.batchTimeoutId = this.batchTimeoutId ?? setTimeout(this.clearBatch, this.batchWaitTimeMs)
    return promise
  }
}

export class NetworkConnector extends AbstractConnector {
  private readonly providers: { [chainId: number]: MiniRpcProvider }
  private currentChainId: number
  private readonly urls: { [chainId: number]: string }
  private _supportedChainIds: number[]

  constructor({ urls, defaultChainId }: NetworkConnectorArguments) {
    invariant(defaultChainId || Object.keys(urls).length === 1, 'defaultChainId is a required argument with >1 url')
    const chainIds = Object.keys(urls).map((k): number => Number(k))
    super({ supportedChainIds: chainIds })

    this.currentChainId = defaultChainId || Number(Object.keys(urls)[0])
    this.urls = urls
    this._supportedChainIds = [...chainIds]
    this.providers = Object.keys(urls).reduce<{ [chainId: number]: MiniRpcProvider }>((accumulator, chainId) => {
      accumulator[Number(chainId)] = new MiniRpcProvider(Number(chainId), urls[Number(chainId)])
      return accumulator
    }, {})
  }

  public get provider(): MiniRpcProvider {
    return this.providers[this.currentChainId]
  }

  public async activate(): Promise<ConnectorUpdate> {
    return { provider: this.providers[this.currentChainId], chainId: this.currentChainId, account: null }
  }

  public async getProvider(): Promise<MiniRpcProvider> {
    return this.providers[this.currentChainId]
  }

  public async getChainId(): Promise<number> {
    return this.currentChainId
  }

  public async getAccount(): Promise<null> {
    return null
  }

  public deactivate() {
    return
  }

  /**
   * Switch to a different chain programmatically
   * @param chainId - The target chain ID to switch to
   * @returns Promise<ConnectorUpdate> - Updated connector state
   * @throws ChainSwitchError if the chain is not supported
   */
  public async switchChain(chainId: number): Promise<ConnectorUpdate> {
     // Check if the chain is supported
     if (!this._supportedChainIds.includes(chainId)) {
       throw new ChainSwitchError(
         `Chain ID ${chainId} is not supported. Supported chains: ${this._supportedChainIds.join(', ')}`,
         chainId,
         'UNSUPPORTED_CHAIN'
       )
     }

    // Check if provider exists for this chain
    if (!this.providers[chainId]) {
      throw new ChainSwitchError(
        `No provider configured for chain ID ${chainId}`,
        chainId,
        'NO_PROVIDER'
      )
    }

    // If already on the target chain, return current state
    if (this.currentChainId === chainId) {
      return {
        provider: this.providers[this.currentChainId],
        chainId: this.currentChainId,
        account: null
      }
    }

    try {
      // Test the connection to the new chain
      const newProvider = this.providers[chainId]
      await newProvider.request('eth_chainId')
      
      // Update current chain
      this.currentChainId = chainId
      
      // Emit update to web3-react
      const update: ConnectorUpdate = {
        provider: this.providers[this.currentChainId],
        chainId: this.currentChainId,
        account: null
      }
      
      this.emitUpdate(update)
      
      return update
    } catch (error) {
      throw new ChainSwitchError(
        `Failed to switch to chain ${chainId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        chainId,
        'SWITCH_FAILED'
      )
    }
  }

  /**
    * Get all supported chain IDs
    * @returns Array of supported chain IDs
    */
   public getSupportedChainIds(): number[] {
     return [...this._supportedChainIds]
   }

   /**
    * Check if a chain ID is supported
    * @param chainId - Chain ID to check
    * @returns boolean indicating if the chain is supported
    */
   public isChainSupported(chainId: number): boolean {
     return this._supportedChainIds.includes(chainId)
   }

  /**
    * Add support for a new chain
    * @param chainId - Chain ID to add
    * @param rpcUrl - RPC URL for the chain
    */
   public addChain(chainId: number, rpcUrl: string): void {
     if (this.providers[chainId]) {
       console.warn(`Chain ${chainId} is already supported`)
       return
     }

     // Add to providers
     this.providers[chainId] = new MiniRpcProvider(chainId, rpcUrl)
     
     // Add to urls
     this.urls[chainId] = rpcUrl
     
     // Update supported chain IDs
     if (!this._supportedChainIds.includes(chainId)) {
       this._supportedChainIds.push(chainId)
     }
   }
}

// Export the error class for external use
export { ChainSwitchError }
