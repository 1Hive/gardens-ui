import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  Help,
  LoadingRing,
  useLayout,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import { useGardenState } from '@providers/GardenState'

import { formatTokenAmount } from '@utils/token-utils'

import wrappedIcon from '@assets/wrappedIcon.svg'
import unwrappedIcon from '@assets/unwrappedIcon.svg'

function WrapToken({ onUnwrapToken, onWrapToken }) {
  const { layoutName } = useLayout()
  const {
    accountBalance: gardenTokenBalance,
    stakeToken,
    wrappableAccountBalance,
    wrappableToken,
  } = useGardenState()
  const loading = gardenTokenBalance.eq(-1) || wrappableAccountBalance.eq(-1)

  const theme = useTheme()
  const compactMode = layoutName === 'small' || layoutName === 'medium'

  return (
    <Box
      css={`
        ${!compactMode && `margin-bottom: ${3 * GU}px;`}
      `}
    >
      {loading ? (
        <div
          css={`
            width: 100%;
            height: ${22 * GU}px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingRing />
        </div>
      ) : (
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
            onClick={onWrapToken}
          />
          <LineSeparator border={theme.border} />
          <Token
            mode="unwrap"
            balance={gardenTokenBalance}
            token={stakeToken}
            onClick={onUnwrapToken}
          />
        </div>
      )}
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
          font-weight: 600;
          margin: ${1 * GU}px 0;
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
        <span>{token.symbol}</span>
        {!wrapMode && (
          <div
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            <Help>
              This amount can be used to vote on proposals. It can be unwrapped
              at any time.
            </Help>
          </div>
        )}
      </div>
      <Button
        mode={button.mode}
        wide
        label={button.label}
        onClick={onClick}
        disabled={balance.lte(0)}
        css={`
          margin-top: ${3 * GU}px;
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
