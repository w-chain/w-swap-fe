import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ChainId } from '@uniswap/sdk'
import { X, ChevronDown } from 'react-feather'
import Modal from '../Modal'
import { SELECTABLE_CHAINS, getNetworkInfo } from '../../constants/chains'
import { useSwitchChain, SwitchChainError, SwitchChainErrorType } from '../../hooks/useSwitchChain'
import { useActiveWeb3React } from '../../hooks'

const NetworkSelectorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bg2};
    border-color: ${({ theme }) => theme.primary1};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
`

const NetworkName = styled.span`
  white-space: nowrap;
`

const DropdownIcon = styled(ChevronDown)<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`

const ModalCard = styled.div`
  background: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  padding: 0;
  overflow: hidden;
`

const ModalHeader = styled.div`
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.text2};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.text1};
  }
`

const NetworkList = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const NetworkOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: ${({ theme, isActive }) => (isActive ? theme.bg2 : 'transparent')};
  cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
  transition: all 0.2s ease;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.bg2};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const NetworkOptionIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
`

const NetworkOptionInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const NetworkOptionName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
`

const NetworkOptionDescription = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
`

const ActiveIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
`

const ErrorMessage = styled.div`
  padding: 12px 16px;
  margin: 0 16px 16px;
  background: ${({ theme }) => theme.red1}20;
  border: 1px solid ${({ theme }) => theme.red1}40;
  border-radius: 8px;
  color: ${({ theme }) => theme.red1};
  font-size: 13px;
`

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)
  const { chainId } = useActiveWeb3React()
  const { switchChain } = useSwitchChain()

  const currentNetwork = getNetworkInfo(chainId)

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  const handleSwitchChain = useCallback(
    async (targetChainId: ChainId) => {
      if (targetChainId === chainId) {
        handleClose()
        return
      }

      setIsSwitching(true)
      setError(null)

      try {
        await switchChain(targetChainId)
        handleClose()
      } catch (err) {
        if (err instanceof SwitchChainError) {
          if (err.type === SwitchChainErrorType.USER_REJECTED) {
            setError('Network switch was rejected. Please try again.')
          } else if (err.type === SwitchChainErrorType.NO_WALLET) {
            setError('No wallet detected. Please install MetaMask.')
          } else {
            setError(err.message)
          }
        } else {
          setError('Failed to switch network. Please try again.')
        }
      } finally {
        setIsSwitching(false)
      }
    },
    [chainId, handleClose, switchChain]
  )

  return (
    <>
      <NetworkSelectorButton onClick={handleOpen} disabled={isSwitching}>
        {currentNetwork && <NetworkIcon src={currentNetwork.icon} alt={currentNetwork.name} />}
        <NetworkName>{currentNetwork?.shortName || 'Select Network'}</NetworkName>
        <DropdownIcon isOpen={isOpen} />
      </NetworkSelectorButton>

      <Modal isOpen={isOpen} onDismiss={handleClose} maxHeight={60}>
        <ModalCard>
          <ModalHeader>
            <ModalTitle>Select Network</ModalTitle>
            <CloseButton onClick={handleClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <NetworkList>
            {SELECTABLE_CHAINS.map(chainId => {
              const network = getNetworkInfo(chainId)
              if (!network) return null

              const isActive = chainId === currentNetwork?.chainId

              return (
                <NetworkOption
                  key={chainId}
                  isActive={isActive}
                  onClick={() => handleSwitchChain(chainId)}
                  disabled={isActive || isSwitching}
                >
                  <NetworkOptionIcon src={network.icon} alt={network.name} />
                  <NetworkOptionInfo>
                    <NetworkOptionName>{network.name}</NetworkOptionName>
                    <NetworkOptionDescription>{network.isTestnet ? 'Testnet' : 'Mainnet'}</NetworkOptionDescription>
                  </NetworkOptionInfo>
                  {isActive && <ActiveIndicator />}
                </NetworkOption>
              )
            })}
          </NetworkList>
        </ModalCard>
      </Modal>
    </>
  )
}
