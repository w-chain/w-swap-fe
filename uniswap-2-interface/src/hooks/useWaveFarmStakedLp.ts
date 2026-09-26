import { ChainId, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import WAVE_MAKER_ABI from '../constants/abis/waveMaker.json'
import { isWaveFarmSupportedChain, WAVE_MAKER_ADDRESSES, waveFarmLpAddressForPid } from '../constants/waveFarm'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { useContract } from './useContract'

export interface WaveFarmStakedLpState {
  /** Raw staked LP amount per pair (LP token address, lowercase). */
  stakedRawByLpAddress: Record<string, JSBI>
  loading: boolean
  error: boolean
}

export function useWaveFarmStakedLp(): WaveFarmStakedLpState {
  const { account, chainId } = useActiveWeb3React()
  const makerAddress = chainId && isWaveFarmSupportedChain(chainId) ? WAVE_MAKER_ADDRESSES[chainId] : undefined
  const contract = useContract(makerAddress, WAVE_MAKER_ABI, false)
  const call = useSingleCallResult(contract, 'getUserInfo', account ? [account] : undefined)

  return useMemo(() => {
    if (!account || chainId !== ChainId.WCHAIN || !makerAddress) {
      return { stakedRawByLpAddress: {}, loading: false, error: false }
    }
    if (call.loading) {
      return { stakedRawByLpAddress: {}, loading: true, error: false }
    }
    if (call.error || !call.result) {
      return { stakedRawByLpAddress: {}, loading: false, error: true }
    }

    const userInfo = call.result[0] as
      | {
          poolsInfo?: { pid: { toString(): string }; stakedAmount: { toString(): string } }[]
        }
      | unknown[]
    const pools =
      userInfo && typeof userInfo === 'object' && !Array.isArray(userInfo) && 'poolsInfo' in userInfo
        ? (userInfo as { poolsInfo: { pid: { toString(): string }; stakedAmount: { toString(): string } }[] })
            .poolsInfo
        : Array.isArray(userInfo) && userInfo[3]
        ? (userInfo[3] as { pid: { toString(): string }; stakedAmount: { toString(): string } }[])
        : []
    const stakedRawByLpAddress: Record<string, JSBI> = {}

    for (const pool of pools) {
      const pid = Number(pool.pid.toString())
      const lp = waveFarmLpAddressForPid(pid)
      if (!lp) continue
      const raw = JSBI.BigInt(pool.stakedAmount.toString())
      if (JSBI.greaterThan(raw, JSBI.BigInt(0))) {
        stakedRawByLpAddress[lp] = raw
      }
    }

    return { stakedRawByLpAddress, loading: false, error: false }
  }, [account, chainId, makerAddress, call.loading, call.error, call.result])
}

export function useWaveFarmStakedAmount(liquidityToken: Token | undefined): TokenAmount | undefined {
  const { stakedRawByLpAddress, loading } = useWaveFarmStakedLp()

  return useMemo(() => {
    if (!liquidityToken || loading) return undefined
    const raw = stakedRawByLpAddress[liquidityToken.address.toLowerCase()]
    if (!raw || JSBI.equal(raw, JSBI.BigInt(0))) return undefined
    return new TokenAmount(liquidityToken, raw)
  }, [liquidityToken, loading, stakedRawByLpAddress])
}

export function useUserTotalLpBalance(
  liquidityToken: Token | undefined,
  walletBalance: TokenAmount | undefined
): { total: TokenAmount | undefined; farmStaked: TokenAmount | undefined; wallet: TokenAmount | undefined } {
  const farmStaked = useWaveFarmStakedAmount(liquidityToken)

  return useMemo(() => {
    if (!liquidityToken) {
      return { total: undefined, farmStaked: undefined, wallet: undefined }
    }
    const wallet = walletBalance ?? new TokenAmount(liquidityToken, JSBI.BigInt(0))
    const farm = farmStaked ?? new TokenAmount(liquidityToken, JSBI.BigInt(0))
    const total =
      JSBI.greaterThan(wallet.raw, JSBI.BigInt(0)) || JSBI.greaterThan(farm.raw, JSBI.BigInt(0))
        ? new TokenAmount(liquidityToken, JSBI.add(wallet.raw, farm.raw))
        : undefined
    return {
      total,
      farmStaked: farmStaked ?? undefined,
      wallet: walletBalance
    }
  }, [liquidityToken, walletBalance, farmStaked])
}
