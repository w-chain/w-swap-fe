import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const ModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.primary1};
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const MenuItem = styled(RowBetween)`
  padding: 10px 16px;
  min-height: 52px;
  margin: 0 16px 10px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  border: 1px solid #e4ddd2;
  border-radius: 12px;
  background: #ffffff;
  color: #1a2430;
  transition: border-color 0.15s ease, background 0.15s ease;
  :hover {
    background-color: ${({ disabled }) => (!disabled ? '#faf8f4' : '#ffffff')};
    border-color: ${({ disabled }) => (!disabled ? '#0e9a86' : '#e4ddd2')};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid #e4ddd2;
  background: #ffffff;
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e4ddd2;
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e4ddd2;
`

export const TokenListFooter = styled.div`
  padding: 16px 20px 20px;
  border-top: 1px solid #e4ddd2;
  background: #ffffff;
`
