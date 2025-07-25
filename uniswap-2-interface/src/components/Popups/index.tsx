import React from 'react'
import styled from 'styled-components'
import { useActivePopups } from '../../state/application/hooks'
import { AutoColumn } from '../Column'
import PopupItem from './PopupItem'

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: fixed;
  top: 10%;
  left: auto;
  right: auto;
  max-width: calc(100% - 0.5rem);
  height: ${({ height }) => height};
  z-index: 100;

  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn)`
  position: fixed;
  top: 100px;
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 5;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none !important;
  `};
`

export default function Popups() {
  // get all popups
  const activePopups = useActivePopups()

  return (
    <>
      <FixedPopupColumn gap="20px">
        {activePopups.map(item => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map(item => (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  )
}
