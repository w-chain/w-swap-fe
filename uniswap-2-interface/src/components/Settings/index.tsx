import React, { useRef, useContext, useState } from 'react'
import { Settings, X } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import {
  useUserSlippageTolerance,
  useExpertModeManager,
  useUserDeadline,
  useDarkModeManager
} from '../../state/user/hooks'
import TransactionSettings from '../TransactionSettings'
import { RowFixed, RowBetween } from '../Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../QuestionHelper'
import Toggle from '../Toggle'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import { ButtonError } from '../Button'
import { useSettingsMenuOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { Text } from 'rebass'
import Modal from '../Modal'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg3};
  }

  svg {
    margin-top: 2px;
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);

  border: 1px solid ${({ theme }) => theme.bg3};

  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 18.125rem;
    right: -46px;
  `};
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useSettingsMenuOpen()
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [deadline, setDeadline] = useUserDeadline()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                Are you sure?
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </Text>
              <Text fontWeight={600} fontSize={20}>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  Turn On Expert Mode
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.8277 0.612438C11.8277 0.612438 12.4896 2.53278 12.4896 2.53188C13.0401 2.76785 13.5598 3.06828 14.0388 3.42707L16.0333 3.04C16.2648 2.99495 16.5035 3.07712 16.659 3.25476C17.4676 4.18267 18.0889 5.25818 18.4874 6.42289C18.5643 6.64648 18.5157 6.89393 18.361 7.0724C18.361 7.0724 17.0293 8.60564 17.0293 8.60478C17.1 9.1995 17.1 9.80043 17.0293 10.3943L18.361 11.9275C18.5157 12.106 18.5643 12.3535 18.4874 12.577C18.0889 13.7418 17.4676 14.8173 16.659 15.7452C16.5035 15.9228 16.2648 16.005 16.0333 15.9599C16.0333 15.9599 14.0388 15.5729 14.0396 15.5729C13.5598 15.9317 13.0393 16.2321 12.4896 16.4672L11.8277 18.3875C11.7508 18.6111 11.5608 18.7763 11.3293 18.8223C10.1213 19.0591 8.87874 19.0591 7.67068 18.8223C7.43915 18.7763 7.24916 18.6111 7.17226 18.3875C7.17226 18.3875 6.51037 16.4672 6.51037 16.4681C5.9598 16.2321 5.4402 15.9317 4.96119 15.5728L2.96665 15.96C2.73512 16.0051 2.49651 15.9229 2.34098 15.7452C1.53235 14.8173 0.911116 13.7418 0.51254 12.5771C0.435639 12.3535 0.484261 12.1061 0.638895 11.9276C0.638895 11.9276 1.97068 10.3943 1.97068 10.3952C1.89998 9.80043 1.89998 9.19954 1.97068 8.60564L0.63893 7.0724C0.484296 6.89389 0.435674 6.64645 0.51254 6.42289C0.911116 5.25814 1.53235 4.18267 2.34094 3.25473C2.49648 3.07708 2.73508 2.99491 2.96662 3.04C2.96662 3.04 4.96116 3.42707 4.96029 3.42707C5.44017 3.06828 5.96066 2.76782 6.51034 2.53275L7.17223 0.612438C7.24913 0.388874 7.43911 0.2236 7.67065 0.177647C8.87867 -0.0591902 10.1212 -0.0591902 11.3293 0.177647C11.5608 0.2236 11.7508 0.388839 11.8277 0.612438ZM9.49998 5.59309C7.3437 5.59309 5.59303 7.34372 5.59303 9.50004C5.59303 11.6564 7.34367 13.4069 9.49998 13.4069C11.6563 13.4069 13.4069 11.6563 13.4069 9.5C13.4069 7.34372 11.6563 5.59309 9.49998 5.59309ZM9.49998 6.91867C10.9245 6.91867 12.0813 8.07548 12.0813 9.5C12.0813 10.9245 10.9245 12.0813 9.49998 12.0813C8.07542 12.0813 6.91865 10.9246 6.91865 9.5C6.91865 8.07544 8.07542 6.91867 9.49998 6.91867Z"
            fill="#043F84"
          />
        </svg>

        {expertMode && (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        )}
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              Transaction Settings
            </Text>
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={deadline}
              setDeadline={setDeadline}
            />
            <Text fontWeight={600} fontSize={14}>
              Interface Settings
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Expert Mode
                </TYPE.black>
                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }
                    : () => {
                        toggle()
                        setShowConfirmation(true)
                      }
                }
              />
            </RowBetween>
            {/* <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Dark Mode
                </TYPE.black>
              </RowFixed>
              <Toggle isActive={darkMode} toggle={toggleDarkMode} />
            </RowBetween> */}
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
