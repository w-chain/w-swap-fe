import React from 'react'
import styled from 'styled-components'
import { FaDiscord, FaLinkedin, FaTelegramPlane } from 'react-icons/fa'

const MAIN_TEXT =
  'W Swap is a next-generation decentralized exchange (DEX) on the W Chain ecosystem, delivering lightning-fast, secure, and cost-efficient crypto swaps.'

const FooterWrapper = styled.footer`
  position: relative;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;
  background: linear-gradient(180deg, #004c99 0%, #00264d 100%);
  color: #fff;
  align-items: center;
  margin-top: 3rem;
`

const Description = styled.p`
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
`

// Try to import FaXTwitter from fa6
// If not available, use a custom SVG

let XIcon = null
try {
  // @ts-ignore
  XIcon = require('react-icons/fa6').FaXTwitter
} catch {
  XIcon = () => (
    <svg width="22" height="22" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M299 0h202l299 441L1099 0h101L801 508l399 719h-202l-299-441-299 441H99l399-719L0 0h299Zm101 1102 200-295 200 295h-400Zm-60-1002H161l340 613-60 108-440-721h199l299 441 60-108-199-333Zm520 0-340 613 60 108 440-721H839l-299 441-60-108 199-333Zm-260 502 60 108 60-108-60-108-60 108Z"
        fill="#043F84"
      />
    </svg>
  )
}

const socialLinks = [
  { icon: XIcon, href: 'https://x.com/WChainNetwork' },
  { icon: FaDiscord, href: 'https://discord.com/invite/MKwECfek45' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/wadzchain/posts/?feedView=all' },
  { icon: FaTelegramPlane, href: 'https://t.me/Official_WChain_Updates' }
]

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 42px 52px;
  gap: 48px;
  width: 100%;
  align-items: flex-start;

  & > div:first-child {
    max-width: 400px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;

    & > div:first-child {
      max-width: 100%;
      width: 100%;
    }
  }
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 8px;
`

const SectionLine = styled.div`
  width: 100%;
  max-width: 180px;
  height: 2px;
  background: #e6f3ff;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin: 0 auto 16px;
  }
`

const SectionLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
  &:hover {
    color: #e6f3ff;
  }
`

const SocialIconsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`

const SocialIconBox = styled.a`
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  color: #043f84;
  font-size: 22px;

  &:hover {
    opacity: 0.8;
  }
`

const BottomBar = styled.div`
  width: 100%;
  background: #00264d;
  color: #e6f3ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  border-radius: 0 0 24px 24px;
  font-size: 15px;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 24px 16px;
    text-align: center;
    justify-content: center;
  }
`

const buildTheBlockLinks = [
  { text: 'Blogs & Article', href: 'https://w-chain.com/blog/' },
  { text: 'Tutorials', href: 'https://wchain.gitbook.io/wchain-hub/' },
  { text: 'Guidelines', href: 'https://w-chain.com/guidelines/' },
  { text: 'FAQ', href: 'https://w-chain.com/faq/' }
]
const programLinks = [
  { text: 'Tokenomics', href: 'https://w-chain.com/wchain-tokenomics/' },
  { text: 'Airdrop', href: 'https://w-chain.com/airdrop/' }
]
const wcnLinks = [
  {
    text: 'WCN Testnet Scan',
    href:
      'https://scan-testnet.w-chain.com/?_gl=1*10f265a*_ga*ODgzMzM5NzEyLjE3NDY2MjgxMDU.*_ga_SNV30L8084*czE3NDk4MTM5MjAkbzQkZzEkdDE3NDk4MTUzNzckajYwJGwwJGgw'
  },
  {
    text: 'WCN Mainnet Scan',
    href:
      'https://scan.w-chain.com/?_gl=1*10f265a*_ga*ODgzMzM5NzEyLjE3NDY2MjgxMDU.*_ga_SNV30L8084*czE3NDk4MTM5MjAkbzQkZzEkdDE3NDk4MTUzNzckajYwJGwwJGgw'
  },
  { text: 'W Bridge', href: 'https://bridge.w-chain.com/' }
]

const companyLinks = [
  { text: 'About W Chain', href: 'https://w-chain.com/about-w-chain/' },
  { text: 'W Foundation', href: 'https://w-chain.com/w-foundation/' },
  { text: 'Roadmap', href: 'https://w-chain.com/roadmap/' },
  { text: 'Contact Us', href: 'https://w-chain.com/contact-us/' }
]

export function Footer() {
  return (
    <FooterWrapper>
      <FooterGrid>
        <Section>
          <Description>{MAIN_TEXT}</Description>
        </Section>
        <Section>
          <SectionTitle>Build The Block</SectionTitle>
          <SectionLine />
          {buildTheBlockLinks.map(link => (
            <SectionLink key={link.text} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.text}
            </SectionLink>
          ))}
        </Section>
        <Section>
          <SectionTitle>Program</SectionTitle>
          <SectionLine />
          {programLinks.map(link => (
            <SectionLink key={link.text} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.text}
            </SectionLink>
          ))}
        </Section>
        <Section>
          <SectionTitle>WCN</SectionTitle>
          <SectionLine />
          {wcnLinks.map(link => (
            <SectionLink key={link.text} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.text}
            </SectionLink>
          ))}
        </Section>
        <Section>
          <SectionTitle>Company</SectionTitle>
          <SectionLine />
          {companyLinks.map(link => (
            <SectionLink key={link.text} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.text}
            </SectionLink>
          ))}
        </Section>
        <Section>
          <SectionTitle>Social Media</SectionTitle>
          <SectionLine />
          <SocialIconsRow>
            {socialLinks.map(({ icon: Icon, href }) => {
              const IconComponent = Icon as React.ComponentType<{ size: number }>
              return (
                <SocialIconBox key={href} href={href} target="_blank" rel="noopener noreferrer">
                  <IconComponent size={16} />
                </SocialIconBox>
              )
            })}
          </SocialIconsRow>
        </Section>
      </FooterGrid>
      <BottomBar>
        <span>© Copyright 2025 WP Worldwide. All Rights Reserved.</span>
      </BottomBar>
    </FooterWrapper>
  )
}
