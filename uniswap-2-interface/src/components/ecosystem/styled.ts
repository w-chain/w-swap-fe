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

export const EcosystemSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 16px;
  background: #faf8f4;
`

export const EcosystemMessageCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: #5c6a78;
  font-size: 14px;
  line-height: 1.5;
`

export const EcosystemFeeRow = styled.div`
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1a2430;
  font-size: 14px;
`

export const EcosystemMutedLink = styled.a`
  color: #0e9a86;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`
