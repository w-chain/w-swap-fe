import React from 'react'
import styled from 'styled-components'
import { W_CHAIN_SITE_URL } from '../../constants/ecosystemLinks'

const TAGLINE =
  'A cutting-edge hybrid blockchain, built for payments, speed, and scalability.'

const FOOTER_COLUMNS: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}[] = [
  {
    title: 'Ecosystem',
    links: [
      { label: 'Overview', href: `${W_CHAIN_SITE_URL}/ecosystem` },
      { label: 'WCO', href: `${W_CHAIN_SITE_URL}/ecosystem/wco` },
      { label: 'WAVE (Farm)', href: `${W_CHAIN_SITE_URL}/ecosystem/wave` },
      { label: 'W-SWAP DEX', href: `${W_CHAIN_SITE_URL}/ecosystem/w-swap` },
      { label: 'Bridge', href: `${W_CHAIN_SITE_URL}/ecosystem#bridge` },
      { label: 'W+ Premium', href: `${W_CHAIN_SITE_URL}/ecosystem#premium` },
      { label: 'W Builders', href: `${W_CHAIN_SITE_URL}/developers#builders` },
      { label: 'WayFinders', href: `${W_CHAIN_SITE_URL}/community#wayfinders` },
      { label: 'Builder Academy', href: `${W_CHAIN_SITE_URL}/w-chain-builder-academy` },
      { label: 'Tokenomics', href: `${W_CHAIN_SITE_URL}/ecosystem/wco#tokenomics` }
    ]
  },
  {
    title: 'Developers',
    links: [
      { label: 'Docs Hub', href: 'https://docs.w-chain.com/', external: true },
      { label: 'W Builders', href: `${W_CHAIN_SITE_URL}/developers#builders` },
      { label: 'Run a Node', href: `${W_CHAIN_SITE_URL}/developers#nodes` },
      { label: 'Mainnet Explorer', href: 'https://scan.w-chain.com/', external: true },
      { label: 'Testnet Explorer', href: 'https://scan-testnet.w-chain.com/', external: true },
      { label: 'Testnet Faucet', href: 'https://faucet-testnet.w-chain.com/', external: true }
    ]
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', href: `${W_CHAIN_SITE_URL}/about` },
      { label: 'Roadmap', href: `${W_CHAIN_SITE_URL}/about#roadmap` },
      { label: 'Partners', href: `${W_CHAIN_SITE_URL}/about#partners` },
      { label: 'FAQ', href: `${W_CHAIN_SITE_URL}/about#faq` },
      { label: 'Brand kit', href: `${W_CHAIN_SITE_URL}/about#brand` }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Community', href: `${W_CHAIN_SITE_URL}/community` },
      { label: 'WayFinders', href: `${W_CHAIN_SITE_URL}/community#wayfinders` },
      { label: 'Events & AMAs', href: `${W_CHAIN_SITE_URL}/community#events` }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Legal Disclosures', href: `${W_CHAIN_SITE_URL}/legal/disclosures` },
      { label: 'Terms of Access', href: `${W_CHAIN_SITE_URL}/legal/terms-of-access` },
      { label: 'Audit Reports', href: `${W_CHAIN_SITE_URL}/legal/audit-report` },
      { label: 'WCO Terms & Conditions', href: `${W_CHAIN_SITE_URL}/legal/wco-terms` }
    ]
  }
]

const FooterWrapper = styled.footer`
  position: relative;
  width: 100%;
  border-top: 1px solid #e4ddd2;
  background: #faf8f4;
  color: #1a2430;
`

const FooterInner = styled.div`
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 64px 24px 56px;

  @media (min-width: 768px) {
    padding: 80px 100px 56px;
  }
`

const FooterGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 48px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr repeat(5, 1fr);
    gap: 32px 40px;
  }
`

const BrandColumn = styled.div`
  grid-column: span 2;

  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`

const LogoLink = styled.a`
  display: inline-block;
  line-height: 0;
`

const LogoImg = styled.img`
  width: 70px;
  height: auto;
  display: block;
`

const Tagline = styled.p`
  margin: 12px 0 0;
  max-width: 220px;
  font-size: 12px;
  line-height: 1.6;
  color: #5c6a78;
  font-weight: 400;

  @media (max-width: 1023px) {
    max-width: 100%;
  }
`

const Column = styled.div`
  min-width: 0;
`

const ColumnTitle = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.33;
  color: #1a2430;
`

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FooterLink = styled.a`
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25rem;
  color: #5c6a78;
  text-decoration: none;
  transition: color 0.15s ease, transform 0.15s ease;

  &:hover {
    color: #0e9a86;
    transform: translateX(2px);
  }
`

const BottomBar = styled.div`
  border-top: 1px solid #e4ddd2;
  background: #faf8f4;
`

const BottomInner = styled.div`
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    padding: 24px 100px;
  }
`

const Copyright = styled.p`
  margin: 0;
  font-size: 12px;
  color: #5c6a78;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const AuditBadge = styled.img`
  width: 76px;
  height: auto;
  display: block;
`

export function Footer() {
  const logoSrc = `${W_CHAIN_SITE_URL}/images/logo-w-chain.png`
  const badgeSrc = `${W_CHAIN_SITE_URL}/images/badge-audited.png`

  return (
    <FooterWrapper>
      <FooterInner>
        <FooterGrid>
          <BrandColumn>
            <LogoLink href={W_CHAIN_SITE_URL} target="_blank" rel="noopener noreferrer" aria-label="W Chain home">
              <LogoImg src={logoSrc} alt="W Chain" width={70} height={39} loading="lazy" />
            </LogoLink>
            <Tagline>{TAGLINE}</Tagline>
          </BrandColumn>
          {FOOTER_COLUMNS.map(column => (
            <Column key={column.title}>
              <ColumnTitle>{column.title}</ColumnTitle>
              <LinkList>
                {column.links.map(link => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </LinkList>
            </Column>
          ))}
        </FooterGrid>
      </FooterInner>
      <BottomBar>
        <BottomInner>
          <Copyright>© 2026 W Chain. Infrastructure for builders.</Copyright>
          <AuditBadge src={badgeSrc} alt="Audited by QuilAudits" width={76} height={31} loading="lazy" />
        </BottomInner>
      </BottomBar>
    </FooterWrapper>
  )
}
