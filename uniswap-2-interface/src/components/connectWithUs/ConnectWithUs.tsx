import React from 'react'
import styled from 'styled-components'
import WcoLogoPng from '../../components/CurrencyLogo/assets/wco-logo.png'
import USDTLogo from '../../components/CurrencyLogo/assets/usdt.webp'
import USDCLogo from '../../components/CurrencyLogo/assets/usdc.webp'
import WAVELogo from '../../components/CurrencyLogo/assets/wave.jpeg'
import { ConnectSvg, GuidelinesSvg, LiquiditySvg, StakingSvg, SupportSvg, WaveSvg } from './connectSvgs'
import FishBG from '../../assets/images/fish-bg.png'
import ReviewCards from '../ReviewCards/ReviewCards'

const pairs = [
  {
    icon: USDTLogo,
    name: 'WCO/USDT',
    tvl: 'Growing...'
  },
  {
    icon: USDCLogo,
    name: 'WCO/USDC',
    tvl: 'Growing...'
  },
  {
    icon: WAVELogo,
    name: 'WCO/WAVE',
    tvl: 'Growing...'
  }
]

const ConnectWithUs = () => {
  return (
    <ConnectWithUsBg>
      <img src={FishBG} alt="" className="fish-top-right" />
      <img src={FishBG} alt="" className="fish-bottom-left" />
      <Title>Go Direct to DeFi with W Swap</Title>

      <MainContainer>
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: '#ffffff',
              borderRadius: '10px',
              padding: '6px 10px 6px 6px',
              height: 'fit-content'
            }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.35148" cy="8.35148" r="7.73222" fill="#043F84" />
            </svg>
            <DotTitle>Available Pair</DotTitle>
          </div>

          <ContainerTitle>
            Swapping made simple. Experience seamless cross-chain swaps with an intuitive interface.
          </ContainerTitle>

          <ContainerTitle>Ready to dive in? </ContainerTitle>

          <PairsContainer>
            <PairName style={{ margin: '0 20px 4px auto' }}>TVL:</PairName>
            {pairs.map((pair, idx) => (
              <PairRow key={pair.name} selected={idx === 0}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <Icons>
                    <IconWrapper src={WcoLogoPng} />
                    <IconWrapper style={{ marginLeft: '-12px', zIndex: 2 }} src={pair.icon} />
                  </Icons>
                  <PairName>{pair.name}</PairName>
                </div>
                <PairName style={{ margin: '0 10px 0 auto' }}>{pair.tvl}</PairName>
              </PairRow>
            ))}
          </PairsContainer>
        </Container>

        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <Container direction="row" align="center" style={{ gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '8px',
                flexDirection: 'column'
              }}
            >
              <ContainerTitle>LP Token Staking:</ContainerTitle>
              <Content>
                LP Token Staking: Stake your LP tokens and earn even more rewards! Unlock addiitonal yield within the W
                Swap Ecosystem
              </Content>
            </div>

            <SVGContainer>
              <StakingSvg />
            </SVGContainer>
          </Container>

          <Container direction="row" align="center">
            <a href="/#/pool" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '3px 12px 3px 6px',
                  height: 'fit-content',
                  width: 'fit-content'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8.35148" cy="8.35148" r="7.73222" fill="#043F84" />
                </svg>
                <DotTitle>Liquidity</DotTitle>
              </div>

              <ContainerTitle>
                Fuel the ecosystem and earn fees! Provide liquidity to pools on W Swap and benefit from every swap.
              </ContainerTitle>
            </a>

            <SVGContainer>
              <LiquiditySvg />
            </SVGContainer>
          </Container>

          <Container direction="row" style={{ paddingTop: '25px', paddingBottom: '25px' }} align="center">
            <ContainerTitle>Invest Your WAVE Power with W Swap's Feature!</ContainerTitle>

            <SVGContainer>
              <WaveSvg />
            </SVGContainer>
          </Container>
        </div>
      </MainContainer>

      {/* <Title style={{ marginTop: '120px' }}>Connect With Us</Title>

      <ConnectWithUsWrapper>
        <ConnectWithUsContainer href="https://w-chain.com/contact-us/" target="_blank" rel="noreferrer">
          <ContainerTitle>Customer Support</ContainerTitle>
          <ConnectWithSvgWrapper>
            <SupportSvg />
          </ConnectWithSvgWrapper>
        </ConnectWithUsContainer>

        <ConnectWithUsContainer href="https://w-chain.com/guidelines/" target="_blank" rel="noreferrer">
          <ContainerTitle>Guidelines</ContainerTitle>
          <ConnectWithSvgWrapper>
            <GuidelinesSvg />
          </ConnectWithSvgWrapper>
        </ConnectWithUsContainer>

        <ConnectWithUsContainer href="https://w-chain.com/faq/" target="_blank" rel="noreferrer">
          <ContainerTitle>Connect with our Community </ContainerTitle>
          <ConnectWithSvgWrapper>
            <ConnectSvg />
          </ConnectWithSvgWrapper>
        </ConnectWithUsContainer>
      </ConnectWithUsWrapper> */}

      <ReviewCards />
    </ConnectWithUsBg>
  )
}

export default ConnectWithUs

const ConnectWithUsBg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
  z-index: 1;

  .fish-top-right {
    position: absolute;
    top: -250px;
    right: max(-80px, -10vw);
    width: 40vw;
    max-width: 350px;
    pointer-events: none;
    user-select: none;
    opacity: 0.3;
    z-index: -1;
  }

  .fish-bottom-left {
    position: absolute;
    bottom: 100px;
    left: max(-80px, -10vw);
    width: 40vw;
    max-width: 350px;
    pointer-events: none;
    user-select: none;
    transform: scaleX(-1);
    opacity: 0.3;
    z-index: -1;
  }

  @media (max-width: 1024px) {
    .fish-top-right {
      top: -200px;
    }

    .fish-bottom-left {
      bottom: 400px;
    }
  }
`

const Title = styled.h2`
  font-family: Montserrat;
  font-weight: 600;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #043f84;
`

const Container = styled.div<{ direction?: string; align?: string; width?: string; height?: string }>`
  padding: 15px 20px;
  background: #d9ebff;
  border-radius: 15px;
  width: ${({ width }) => width || '390px'};
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  align-items: ${({ align }) => align || 'start'};
  justify-content: center;
  gap: 25px;
  height: ${({ height }) => height || 'fit-content'};

  @media (max-width: 1024px) {
    width: 100%;
    margin-top: 10px;
  }
`

const SVGContainer = styled.div`
  width: 75px;
  height: 75px;
`

const ContainerTitle = styled.h3<{ size?: string }>`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: ${({ size }) => size || '16px'};
  line-height: 20px;
  color: #043f84;
  margin: 0;
`

const DotTitle = styled.p`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  color: #043f84;
  line-height: 13px;
  margin: 0;
`

const PairsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: -20px;
  padding-bottom: 15px;
`

const PairRow = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 15px;
  padding: 10px;
  width: 100%;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
`

const IconWrapper = styled.img`
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #043f84;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`

const PairName = styled.span`
  font-family: Montserrat;
  font-weight: 600;
  font-size: 12px;
  color: #043f84;
  margin-left: 16px;
  flex: 1;
`

const Content = styled.p`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #043f84;
  margin: 0;
`

const ConnectWithUsContainer = styled.a`
  padding: 53px 32px;
  background: #d9ebff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 325px;
  height: 174px;
  border-radius: 15px;
  gap: 30px;
`

const ConnectWithSvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108px;
  height: 108px;
`

const ConnectWithUsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
  gap: 27px;
  padding-top: 25px;
  width: 100%;
  margin: 0 auto;
  justify-items: center;
  max-width: 1029px;
  place-content: center;
  place-items: center;
  align-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 30px;
  flex-wrap: wrap;
  padding-top: 25px;
`
