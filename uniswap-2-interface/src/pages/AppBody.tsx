import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div<{ $plain?: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ $plain }) => ($plain ? 'none' : '480px')};
  margin: 0 auto;
  padding: ${({ $plain }) => ($plain ? '0' : '1rem 2rem 2rem 2rem')};
  z-index: 2;
  background: ${({ $plain }) => ($plain ? 'transparent' : '#d9ebff')};
  box-shadow: ${({ $plain }) => ($plain ? 'none' : '4px 4px 4px rgba(4, 63, 132, 0.25)')};
  border-radius: ${({ $plain }) => ($plain ? '0' : '15px')};
  margin-bottom: ${({ $plain }) => ($plain ? '0' : '100px')};
  height: auto;

  @media (max-width: 768px) {
    padding: ${({ $plain }) => ($plain ? '0' : '1rem 1.2rem 1.2rem 1.2rem')};
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, plain }: { children: React.ReactNode; plain?: boolean }) {
  return <BodyWrapper $plain={plain}>{children}</BodyWrapper>
}
