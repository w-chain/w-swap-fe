import React from 'react'
import styled from 'styled-components'
import discordSvg from './assets/discord.png'
import telegramSvg from './assets/telegram.png'
import twitterSvg from './assets/twitter.png'
import linkedinSvg from './assets/linkedin.png'
import footerLogo from './assets/wadz-footer-logo.png'

const MAIN_TEXT =
  'W Chain stands out as a pioneering hybrid blockchain designed specifically for seamless global payments. Combining the best of both worlds, it delivers exceptional scalability, speed, and security. Built to manage a high volume of transactions effortlessly, W Chain guarantees that each transaction is fast, secure, and efficient.'

/** NOTE: Wadz-specific */
const links = [
  { text: 'Contact us', href: 'https://w-chain.com/contact-us/' },
  { text: 'FAQ', href: 'https://w-chain.com/faq/' },
  { text: 'Guidelines', href: 'https://w-chain.com/guidelines/' },
  { text: 'Tutorial', href: 'https://wchain.gitbook.io/wchain-hub' }
]

const FooterWrapper = styled.footer`
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 32px;
  padding-right: 32px;
  position: relative;
  min-height: 190px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;
  background: white;
  align-items: center;
`

const Logo = styled.img`
  width: 159px;
  height: 159px;
  object-fit: contain;
`

const ContentSection = styled.div`
  margin-left: 30px;
  max-width: 320px;
`

const Description = styled.p`
  color: black;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
`

const LinksWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  a {
    color: black;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;

    &:hover {
      color: black;
    }
  }
`

const Separator = styled.span`
  font-weight: 700;
  color: black;
`

const SocialLinks = styled.div`
  margin-left: auto;
  display: flex;
  gap: 15px;
`

const SocialIcon = styled.a`
  width: 42px;
  height: 42px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    opacity: 0.8;
  }
`
/** NOTE: Wadz-specific */
const socialLinks = [
  { icon: discordSvg, href: 'https://discord.gg/wadz' },
  { icon: telegramSvg, href: 'https://t.me/wadz_global' },
  { icon: twitterSvg, href: 'https://twitter.com/wadz' },
  { icon: linkedinSvg, href: 'https://linkedin.com/company/wadz' }
]

export function Footer() {
  return (
    <FooterWrapper>
      <Logo src={footerLogo} alt="Wadz Logo" />
      <ContentSection>
        <Description>{MAIN_TEXT}</Description>
        <LinksWrapper>
          {links.map((link, index) => (
            <React.Fragment key={link.text}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
              {index < links.length - 1 && <Separator>|</Separator>}
            </React.Fragment>
          ))}
        </LinksWrapper>
      </ContentSection>
      <SocialLinks>
        {socialLinks.map(link => (
          <SocialIcon key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
            <img src={link.icon} alt="Social media icon" />
          </SocialIcon>
        ))}
      </SocialLinks>
    </FooterWrapper>
  )
}
