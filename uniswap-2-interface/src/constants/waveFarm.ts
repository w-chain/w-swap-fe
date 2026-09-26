import { ChainId } from '@uniswap/sdk'

/** Wave Maker (farm) contract on W Chain mainnet — same as wave.w-chain.com. */
export const WAVE_MAKER_ADDRESSES: { [chainId in ChainId]?: string } = {
  [ChainId.WCHAIN]:
    process.env.REACT_APP_WAVE_MAKER_ADDRESS ?? '0x7f483B732Bd148f360ed8Ce64A233aEefC6d1099'
}

/** Farm pool id → W-Swap V2 pair (LP token). Matches wave.w-chain.com farm pools (LP pairs only). */
export const WAVE_FARM_WSWAP_POOLS: readonly { pid: number; lpTokenAddress: string }[] = [
  { pid: 0, lpTokenAddress: '0x35264F0E8cD7A32341f47dBFBf2d85b81fd0ef0A' },
  { pid: 1, lpTokenAddress: '0xD4e9176d5189dbb24F40e5c6c45bb1682dCb3324' },
  { pid: 2, lpTokenAddress: '0x00d91Ce419C068E36928FD8E9379B11D0011F052' },
  { pid: 4, lpTokenAddress: '0x9556d7aFa868CB8B25657d34f3e0d46929f9d710' },
  { pid: 5, lpTokenAddress: '0x8b5F11EA77641B208Fb53b4B91b2825db64b8c32' },
  { pid: 6, lpTokenAddress: '0x24F07DE79398f24C9d4dD60a281a29843E43B7FD' }
]

const LP_BY_PID = new Map(WAVE_FARM_WSWAP_POOLS.map(p => [p.pid, p.lpTokenAddress.toLowerCase()]))

export function waveFarmLpAddressForPid(pid: number): string | undefined {
  return LP_BY_PID.get(pid)
}

export function isWaveFarmSupportedChain(chainId?: ChainId): boolean {
  return chainId === ChainId.WCHAIN && Boolean(WAVE_MAKER_ADDRESSES[ChainId.WCHAIN])
}
