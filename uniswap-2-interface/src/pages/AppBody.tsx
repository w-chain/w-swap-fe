import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem 2rem 2rem 2rem;
  z-index: 2;
  background: #d9ebff;
  box-shadow: 4px 4px 4px rgba(4, 63, 132, 0.25);
  border-radius: 15px;
  margin-bottom: 100px;
  height: auto;

  @media (max-width: 768px) {
    padding: 1rem 1.2rem 1.2rem 1.2rem;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
