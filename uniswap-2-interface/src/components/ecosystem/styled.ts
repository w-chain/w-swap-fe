import styled from 'styled-components'
import { ButtonPrimaryGradient } from '../Button'

export const FlipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin-bottom: 10px;
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
  min-height: 48px;
  border-radius: 8px;
  font-size: 15px;
  touch-action: manipulation;
`

export const EcosystemSection = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  padding: 14px 12px;

  @media (min-width: 480px) {
    padding: 16px;
  }

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
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background: #ffffff;
  overflow: hidden;
`

export const EcosystemModalHeader = styled.div`
  padding: 20px 16px 0;

  @media (min-width: 480px) {
    padding: 24px 20px 0;
  }

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 0;
  box-sizing: border-box;
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
  margin: 0 16px;

  @media (min-width: 480px) {
    margin: 0 20px;
  }
`

export const EcosystemModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px 24px;
`

/** Header wallet row: balance + address pill */
export const HeaderAccountShell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 4px 4px 12px;
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 8px 24px -20px rgba(26, 36, 48, 0.12);
  white-space: nowrap;
  width: auto;
  max-width: min(240px, 42vw);
  min-height: 44px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-left: 8px;
    max-width: min(200px, 48vw);
  `};
`

export const HeaderBalanceText = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a2430;
  padding-right: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const HeaderSettingsButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: 1px solid #e4ddd2;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  svg {
    stroke: #1a2430;
  }

  &:hover,
  &:focus {
    outline: none;
    border-color: #0e9a86;
    background: #faf8f4;
  }
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
