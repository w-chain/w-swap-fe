import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
// import MigrateV1 from './MigrateV1'
// import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Bridge from './Bridge'
import Landing from './Landing'
import FishComponent from '../components/FishComponent'

const AppWrapper = styled.div`
  display: flex;
  position: relative;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
  background-color: #fff;
`

const HeadBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 120px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: calc(100vh - 120px);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;

  @media (max-width: 768px) {
    padding-top: 80px;
  }

  @media (max-width: 1024px) {
    padding-top: 100px;
  }

  .fish-bottom-right {
    position: fixed;
    bottom: 0px;
    right: max(-80px, -10vw);
    width: 40vw;
    max-width: 350px;
    pointer-events: none;
    user-select: none;
    opacity: 0.3;
    z-index: 0;
  }

  @media (max-width: 1024px) {
    .fish-bottom-right {
      bottom: 0px;
    }
  }
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper>
          <HeadBodyWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Popups />
              <AppBg />
              <SeamlessGradient />

              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/" component={Landing} />
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact strict path="/bridge" component={Bridge} />
                  <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                  <Route exact path="/add" component={AddLiquidity} />
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  {/* <Route exact strict path="/migrate/v1" component={MigrateV1} />
                  <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} /> */}
                  <Route component={RedirectPathToSwapOnly} />
                </Switch>
              </Web3ReactManager>

              <FishComponent />
            </BodyWrapper>
          </HeadBodyWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}

const AppBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  overflow: hidden;
`

const SeamlessGradient = styled.div`
  top: 73px;
  background: linear-gradient(180deg, #034e94 0%, #75b6fe 59.62%, #ffffff 100%);
  width: 100%;
  height: 500px;
  left: 0px;
  position: absolute;
`
