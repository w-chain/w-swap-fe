import styled from 'styled-components'
import { ButtonPrimaryGradient } from '../Button'

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

export const EcosystemPrimaryButton = styled(ButtonPrimaryGradient)`
  width: 100%;
  min-height: 42px;
  border-radius: 5px;
  font-size: 14px;
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

export const EcosystemModalBody = styled.div`
  width: 100%;
  background: #ffffff;
`

export const EcosystemModalHeader = styled.div`
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const EcosystemModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a2430;
`

export const EcosystemModalSubtitle = styled.div`
  font-size: 14px;
  color: #5c6a78;
  margin-top: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  line-height: 1.45;
`

export const EcosystemModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  color: #5c6a78;
  font-size: 28px;
  line-height: 1;
  font-weight: 400;

  &:hover {
    color: #1a2430;
  }
`

export const EcosystemModalDivider = styled.div`
  height: 1px;
  background: #e4ddd2;
  margin: 0 24px;
`

export const EcosystemModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px 24px;
`

export const EcosystemPickButton = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(14, 154, 134, 0.45)' : '#e4ddd2')};
  background: ${({ $selected }) => ($selected ? '#faf8f4' : '#ffffff')};
  font-size: 16px;
  font-weight: 600;
  color: #1a2430;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  width: 100%;
  text-align: left;
  box-shadow: ${({ $selected }) => ($selected ? '0 0 0 1px rgba(14, 154, 134, 0.12)' : 'none')};

  &:hover {
    border-color: #0e9a86;
    background: #faf8f4;
  }
`
