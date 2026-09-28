import { useEffect, useRef } from 'react'
import { ChainId } from '@uniswap/sdk'
import { PREFERRED_APP_CHAIN_ID, isSelectableChain } from '../constants/chains'
import { useActiveWeb3React } from '.'
import { SwitchChainError, SwitchChainErrorType, useSwitchChain } from './useSwitchChain'

const SKIP_SESSION_KEY = 'wswap_preferred_chain_skip'

/**
 * Once per session, nudge the connected wallet onto W Chain when it opens on another supported network.
 * Skips after the user rejects the switch.
 */
export function usePreferredChain() {
  const { account, chainId, active } = useActiveWeb3React()
  const { switchChain } = useSwitchChain()
  const attemptedRef = useRef(false)

  useEffect(() => {
    if (!active || !account || !chainId || attemptedRef.current) return
    if (sessionStorage.getItem(SKIP_SESSION_KEY) === '1') return
    if (chainId === PREFERRED_APP_CHAIN_ID) return
    if (!isSelectableChain(chainId)) return

    attemptedRef.current = true

    switchChain(PREFERRED_APP_CHAIN_ID).catch(err => {
      if (err instanceof SwitchChainError && err.type === SwitchChainErrorType.USER_REJECTED) {
        sessionStorage.setItem(SKIP_SESSION_KEY, '1')
      }
    })
  }, [active, account, chainId, switchChain])
}
