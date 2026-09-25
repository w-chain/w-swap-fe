import React from 'react'
import styled, { css } from 'styled-components'

const cardStyles = css`
  max-width: min(520px, calc(100vw - 32px));
  padding: 28px 28px 36px;
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.18);
  margin-bottom: 48px;
`

export const BodyWrapper = styled.div<{ $plain?: boolean; $card?: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ $plain, $card }) => ($plain || $card ? 'none' : '480px')};
  margin: 0 auto;
  padding: ${({ $plain, $card }) => ($plain ? '0' : $card ? '0' : '1rem 2rem 2rem 2rem')};
  z-index: 2;
  background: ${({ $plain, $card }) => ($plain ? 'transparent' : $card ? 'transparent' : '#d9ebff')};
  box-shadow: ${({ $plain, $card }) => ($plain || $card ? 'none' : '4px 4px 4px rgba(4, 63, 132, 0.25)')};
  border-radius: ${({ $plain, $card }) => ($plain || $card ? '0' : '15px')};
  margin-bottom: ${({ $plain, $card }) => ($plain ? '0' : $card ? '0' : '100px')};
  height: auto;

  ${({ $card }) => $card && cardStyles}

  @media (max-width: 768px) {
    padding: ${({ $plain, $card }) => ($plain ? '0' : $card ? '0' : '1rem 1.2rem 1.2rem 1.2rem')};
    ${({ $card }) =>
      $card &&
      css`
        max-width: calc(100vw - 24px);
        padding: 22px 18px 28px;
      `}
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  plain,
  card
}: {
  children: React.ReactNode
  plain?: boolean
  card?: boolean
}) {
  return (
    <BodyWrapper $plain={plain} $card={card}>
      {children}
    </BodyWrapper>
  )
}
