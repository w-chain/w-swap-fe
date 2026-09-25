import styled from 'styled-components'
import { ButtonPrimaryDark } from '../Button'

export const FlipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: #22d3ee;
    color: #1a2430;
  }
`

export const EcosystemPrimaryButton = styled(ButtonPrimaryDark)`
  width: 100%;
  min-height: 42px;
  border-radius: 5px;
  border: none;
  color: #060a0d;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(90deg, #12b39c 0%, #3b82f6 100%);

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`
