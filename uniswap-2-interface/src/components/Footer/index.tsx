import React from 'react'
import styled from 'styled-components'
import discordSvg from './assets/discord.png'
import telegramSvg from './assets/telegram.png'
import twitterSvg from './assets/twitter.png'
import linkedinSvg from './assets/linkedin.png'
import footerLogo from './assets/wadz-footer-logo.png'

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

const socialLinks = [
  { icon: discordSvg, href: 'https://discord.gg/hr35kDxtfT' },
  { icon: telegramSvg, href: 'https://t.me/official_wchain' },
  { icon: twitterSvg, href: 'https://x.com/WChainNetwork' },
  { icon: linkedinSvg, href: 'https://www.linkedin.com/company/wchain' }
]

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 42px 52px;
  gap: 48px;
  width: 100%;
  align-items: flex-start;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
`

const SocialIconBox = styled.a`
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
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
`

const buildTheBlockLinks = [
  { text: 'Blogs & Article', href: '#' },
  { text: 'Tutorials', href: '#' },
  { text: 'Guidelines', href: '#' },
  { text: 'FAQ', href: '#' }
]
const programLinks = [
  { text: 'Tokenomics', href: '#' },
  { text: 'Airdrop', href: '#' },
  { text: 'Raffles', href: '#' },
  { text: 'Strategic Buyback', href: '#' }
]
const wcnLinks = [
  { text: 'WCN Testnet Scan', href: '#' },
  { text: 'WCN Mainnet Scan', href: '#' },
  { text: 'Migration Portal', href: '#' },
  { text: 'W Bridge', href: '#' }
]

export function Footer() {
  return (
    <FooterWrapper>
      <FooterGrid>
        <Section style={{ maxWidth: '400px' }}>
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
          <SectionTitle>Social Media</SectionTitle>
          <SectionLine />
          <SocialIconsRow>
            {socialLinks.map(link => (
              <SocialIconBox key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                <img src={link.icon} alt="Social media icon" />
              </SocialIconBox>
            ))}
          </SocialIconsRow>
        </Section>
      </FooterGrid>
      <BottomBar>
        <span>© Copyright 2025 WP Worldwide. All Rights Reserved.</span>
      </BottomBar>
    </FooterWrapper>
  )
}
