import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Networks as BridgeNetworks } from '../shared/types'
import { getNetworkImage } from '../shared/utils/network'
import { AppDispatch, AppState } from '../../../state'
import Modal from '../../../components/Modal'
import { ButtonLight } from '../../../components/Button'
import styled from 'styled-components'
import {
  EcosystemModalBody,
  EcosystemModalClose,
  EcosystemModalHeader,
  EcosystemModalList,
  EcosystemModalSubtitle,
  EcosystemModalTitle,
  EcosystemPickButton
} from '../../../components/ecosystem/styled'
import { setFromNetwork, setToNetwork } from '../stores/BridgeStates'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'
import type { BridgeState } from '../stores/BridgeStates'

const NetworkButton = styled(ButtonLight)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  padding: 8px 12px;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e4ddd2;
  color: #1a2430;

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

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
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
        <EcosystemModalBody>
          <EcosystemModalHeader>
            <div>
              <EcosystemModalTitle>Select Network</EcosystemModalTitle>
              <EcosystemModalSubtitle>Select Network you want to transfer from</EcosystemModalSubtitle>
            </div>
            <EcosystemModalClose type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
              ×
            </EcosystemModalClose>
          </EcosystemModalHeader>

          <EcosystemModalList>
            {networks.map(network_ => {
              const selected = network === network_
              const disabled = isNetworkDisabled(network_)
              return (
                <EcosystemPickButton
                  key={network_}
                  type="button"
                  $selected={selected}
                  disabled={disabled}
                  onClick={() => handleSelect(network_)}
                  style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  <NetworkImage src={getNetworkImage(network_)} alt={`${network_} logo`} />
                  {network_}
                </EcosystemPickButton>
              )
            })}
          </EcosystemModalList>
        </EcosystemModalBody>
      </Modal>
    </>
  )
}
