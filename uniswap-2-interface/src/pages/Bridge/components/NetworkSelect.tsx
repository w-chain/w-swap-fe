import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Networks as BridgeNetworks } from '../shared/types'
import { getNetworkImage } from '../shared/utils/network'
import { AppDispatch, AppState } from '../../../state'
import Modal from '../../../components/Modal'
import { ButtonLight, ButtonPrimary } from '../../../components/Button'
import { ChevronDown, X } from 'react-feather'
import styled from 'styled-components'
import { setFromNetwork, setToNetwork } from '../stores/BridgeStates'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'
import type { BridgeState } from '../stores/BridgeStates'
import { Separator } from '../../../components/SearchModal/styleds'

const NetworkButton = styled(ButtonLight)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  padding-left: 16px;
  background-color: ${({ theme }) => theme.buttonBg1};
  padding: 4px 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const NetworkImage = styled.img`
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  margin-right: 12px;
`

const NetworkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #fff;
  width: 100%;
  padding: 16px;
`

const NetworkListItem = styled.li`
  width: 100%;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
`

// Modal Card styling
const ModalCard = styled.div`
  background: #D9EBFF;
  border-radius: 15px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 0;
  width: 100%;
  position: relative;
`

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #043F84;
`

const ModalSubtitle = styled.div`
  font-size: 14px;
  color: #585858;
  margin-top: 4px;
  margin-bottom: 16px;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  color: #888;
  font-size: 20px;
`

const StyledNetworkList = styled(NetworkList)`
  padding: 0 24px 24px 24px;
  gap: 0;
  background: #D9EBFF;
`

const StyledNetworkListItem = styled(NetworkListItem)<{ selected: boolean; disabled: boolean }>`
  margin-bottom: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  background: ${({ selected }) => (selected ? '#f6f7fa' : 'transparent')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover {
    background: ${({ disabled, selected }) => (!disabled && !selected ? '#f0f2f5' : '')};
  }
`

const StyledNetworkButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 12px 0 12px 16px;
  font-size: 18px;
  font-weight: 600;
  color: #043F83;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: #f0f2f5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e0e0e0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    background: transparent;
  }

  span {
    margin-left: 12px;
  }
`

interface NetworkSelectProps {
  direction: 'from' | 'to'
}

export default function NetworkSelect({ direction }: NetworkSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const bridgeState = useSelector<AppState, BridgeState>(state => state.bridgeStates)

  const network = direction === 'from' ? bridgeState.from : bridgeState.to
  const networks = Object.values(BridgeNetworks)

  const handleSelect = (selectedNetwork: BridgeNetworks) => {
    if (direction === 'from') {
      dispatch(setFromNetwork(selectedNetwork))
    } else {
      dispatch(setToNetwork(selectedNetwork))
    }
    setIsOpen(false)
  }

  const isNetworkDisabled = (selectedNetwork: BridgeNetworks) => {
    // If current network is the same as selected, it should be disabled
    if (network === selectedNetwork) return true

    if (direction === 'from') {
      // If selecting source network
      const targetNetwork = bridgeState.to
      // Only allow WCHAIN -> ETH/BSC or ETH/BSC -> WCHAIN
      if (selectedNetwork === BridgeNetworks.WCHAIN) {
        return targetNetwork === BridgeNetworks.WCHAIN
      } else {
        return targetNetwork !== BridgeNetworks.WCHAIN
      }
    } else {
      // If selecting target network
      const sourceNetwork = bridgeState.from
      // Only allow WCHAIN -> ETH/BSC or ETH/BSC -> WCHAIN
      if (sourceNetwork === BridgeNetworks.WCHAIN) {
        return selectedNetwork === BridgeNetworks.WCHAIN
      } else {
        return selectedNetwork !== BridgeNetworks.WCHAIN
      }
    }
  }

  return (
    <>
      <NetworkButton
        onClick={() => setIsOpen(true)}
        style={{
          padding: ''
        }}
      >
        {network && <NetworkImage src={getNetworkImage(network)} alt={`${network} logo`} />}
        <span>{network}</span>
        <StyledDropDown selected={!!network} />
      </NetworkButton>

      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} maxHeight={400}>
        <ModalCard>
          <ModalHeader>
            <div>
              <ModalTitle>Select Network</ModalTitle>
              <ModalSubtitle>Select Network you want to transfer from</ModalSubtitle>
            </div>
            <CloseButton onClick={() => setIsOpen(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <Separator  style={{ background: '#043F83', width:"auto",margin:"0 24px" }} />
          <StyledNetworkList>
            {networks.map(network_ => {
              const selected = network === network_
              const disabled = isNetworkDisabled(network_)
              return (
                <StyledNetworkListItem key={network_} selected={selected} disabled={disabled}>
                  <StyledNetworkButton onClick={() => handleSelect(network_)} disabled={disabled}>
                    <NetworkImage src={getNetworkImage(network_)} alt={`${network_} logo`} />
                    <span>{network_}</span>
                  </StyledNetworkButton>
                </StyledNetworkListItem>
              )
            })}
          </StyledNetworkList>
        </ModalCard>
      </Modal>
    </>
  )
}
