import React, { useState } from 'react'
import Modal from './index'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'

const items = [
  'I acknowledge that the service will not store any of my funds on its platform.',
  'I understand that once the transaction is submitted, it cannot be cancelled or reversed.',
  'I understand that funds cannot be returned if they are sent to the wrong address.',
  'I understand that the service is provided as-is and that I am responsible for any damages that may occur.'
]

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`

export default function PreflightChecksModal({
  isOpen,
  onResult
}: {
  isOpen: boolean
  onResult: (agreed: boolean) => void
}) {
  const [checked, setChecked] = useState<boolean[]>(Array(items.length).fill(false))

  const allChecked = checked.every(Boolean)

  const handleCheck = (idx: number) => {
    setChecked(prev => prev.map((v, i) => (i === idx ? !v : v)))
  }

  const handleAgree = () => {
    onResult(true)
  }

  const handleCancel = () => {
    onResult(false)
  }

  return (
    <Modal isOpen={isOpen} onDismiss={handleCancel} maxHeight={60} minHeight={20}>
      <div style={{ padding: '1.5rem', minWidth: 300 }}>
        <TYPE.largeHeader>Service Acknowledgement</TYPE.largeHeader>
        <div style={{ margin: '1.5rem 0' }}>
          {items.map((item, idx) => (
            <CheckboxLabel key={idx}>
              <input
                type="checkbox"
                checked={checked[idx]}
                onChange={() => handleCheck(idx)}
                style={{ marginTop: 2 }}
              />
              {item}
            </CheckboxLabel>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <ButtonPrimary onClick={handleCancel} style={{ background: '#eee', color: '#333' }}>
            Cancel
          </ButtonPrimary>
          <ButtonPrimary disabled={!allChecked} onClick={handleAgree}>
            Agree & Continue
          </ButtonPrimary>
        </div>
      </div>
    </Modal>
  )
}
