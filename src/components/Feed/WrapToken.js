import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  Help,
  useLayout,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import { useAppState } from '../../providers/AppState'

import { formatTokenAmount } from '../../utils/token-utils'

import wrappedIcon from '../../assets/wrappedIcon.svg'
import unwrappedIcon from '../../assets/unwrappedIcon.svg'

function WrapToken() {
  const { layoutName } = useLayout()
  const {
    accountBalance: gardenTokenBalance,
    stakeToken,
    wrappableAccountBalance,
    wrappableToken,
  } = useAppState()

  const theme = useTheme()
  const compactMode = layoutName === 'small' || layoutName === 'medium'
  const tabletMode = layoutName === 'medium'

  return (
    <Box
      css={`
        ${tabletMode && `height: 100%;`}
        ${!compactMode && `margin-bottom: ${3 * GU}px;`}
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: row;
          justify-content: center;
        `}
      >
        <Token
          mode="wrap"
          balance={wrappableAccountBalance}
          token={wrappableToken}
          onClick={() => {}}
        />
        <LineSeparator border={theme.border} />
        <Token
          mode="unwrap"
          balance={gardenTokenBalance}
          token={stakeToken}
          onClick={() => {}}
        />
      </div>
    </Box>
  )
}

function Token({ mode, balance, token, onClick }) {
  const wrapMode = mode === 'wrap'
  const icon = wrapMode ? unwrappedIcon : wrappedIcon
  const button = wrapMode
    ? { mode: 'strong', label: 'Wrap' }
    : { mode: 'normal', label: 'Unwrap' }

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        ${textStyle('body2')};
      `}
    >
      <img src={icon} height="48" width="48" />
      <span
        css={`
          font-weight: 400;
          margin-top: ${1 * GU}px;
          margin-button: ${1 * GU}px;
        `}
      >
        {formatTokenAmount(balance, token.decimals)}
      </span>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            margin-right: ${1 * GU}px;
          `}
        >
          {token.symbol}
        </span>
        {!wrapMode && (
          <Help>
            This amount can be used to vote on proposals. It can be unwrapped at
            any time.
          </Help>
        )}
      </div>
      <Button
        mode={button.mode}
        wide
        label={button.label}
        onClick={onClick}
        disabled={balance.lte(0)}
        css={`
          margin-top: ${2 * GU}px;
        `}
      />
    </div>
  )
}

const LineSeparator = styled.div`
  border-left: 1px solid ${({ border }) => border};
  margin: 0 ${3 * GU}px;
`

export default WrapToken
