import styled from 'styled-components'

/** Full-width portfolio page container (Uniswap-style dashboard, not swap card). */
export const PortfolioPageShell = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 24px 56px;
  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 4px 16px 40px;
  `};
`

export const PortfolioPageHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
`

export const PortfolioTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 640px;
`

export const PortfolioPageTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1a2430;
  line-height: 1.15;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 26px;
  `};
`

export const PortfolioPageSubtitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
  color: #5c6a78;
`

/** Vertical stack for wallet, analytics, and main grid sections */
export const PortfolioStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

export const PortfolioMainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
  gap: 20px;
  align-items: start;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
  `};
`

export const PortfolioMainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`

export const PortfolioSideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`

export const PortfolioSectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px;
  margin-bottom: 4px;
`

export const PortfolioSectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a2430;
`

export const PortfolioConnectHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  padding: 48px 24px;
  margin-top: 24px;
  background: #ffffff;
  border: 1px solid #e4ddd2;
  border-radius: 16px;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7) inset, 0 18px 40px -28px rgba(26, 36, 48, 0.12);
`

/** Responsive stat tiles for portfolio summary row */
export const PortfolioStatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 8px;
  `};

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(5, 1fr);
  }
`
