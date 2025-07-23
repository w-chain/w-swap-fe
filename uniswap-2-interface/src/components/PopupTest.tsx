import React from 'react'
import styled from 'styled-components'
import { useAddPopup } from '../state/application/hooks'
import { ButtonPrimary, ButtonSecondary } from './Button'
import { AutoColumn } from './Column'

const TestContainer = styled.div`
  position: fixed;
  bottom: 5px;
  left: 20px;
  z-index: 1000;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const TestTitle = styled.h3`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
`

export default function PopupTest() {
  const addPopup = useAddPopup()

  const triggerSuccessTransaction = () => {
    addPopup({
      txn: {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        success: true,
        summary: 'Swap 1 ETH for 2000 USDC'
      }
    }, 'test-success-txn')
  }

  const triggerFailedTransaction = () => {
    addPopup({
      txn: {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        success: false,
        summary: 'Failed to swap ETH for USDC'
      }
    }, 'test-failed-txn')
  }

  const triggerListUpdate = () => {
    addPopup({
      listUpdate: {
        listUrl: 'https://tokens.uniswap.org',
        oldList: {
          name: 'Uniswap Default List',
          version: { major: 1, minor: 0, patch: 0 },
          tokens: []
        },
        newList: {
          name: 'Uniswap Default List',
          version: { major: 1, minor: 1, patch: 0 },
          tokens: []
        },
        auto: false
      }
    }, 'test-list-update')
  }

  return (
    <TestContainer>
      <TestTitle>Popup Test Controls</TestTitle>
      <AutoColumn gap="4px">
        <ButtonPrimary onClick={triggerSuccessTransaction} style={{ fontSize: '10px', padding: '8px 12px' }}>
          Success Transaction
        </ButtonPrimary>
        <ButtonSecondary onClick={triggerFailedTransaction} style={{ fontSize: '10px', padding: '8px 12px' }}>
          Failed Transaction
        </ButtonSecondary>
        <ButtonSecondary onClick={triggerListUpdate} style={{ fontSize: '10px', padding: '8px 12px' }}>
          List Update
        </ButtonSecondary>
      </AutoColumn>
    </TestContainer>
  )
}