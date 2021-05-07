import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  useLayout,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import { useGardens } from '../../providers/Gardens'
import { useAppState } from '../../providers/AppState'

import { formatTokenAmount } from '../../utils/token-utils'

import wrappedIcon from '../../assets/wrappedIcon.svg'
import unwrappedIcon from '../../assets/unwrappedIcon.svg'

function WrapToken() {
  const { layoutName } = useLayout()
  const { connectedGarden } = useGardens()
  console.log('connected garden ', connectedGarden)
  const {
    accountBalance: gardenTokenBalance,
    stakeToken,
    wrappableAccountBalance,
    wrappableToken,
  } = useAppState()

  const theme = useTheme()
  const compactMode = layoutName === 'small' || layoutName === 'medium'
  console.log('compact ', compactMode)
  console.log(
    'formatedDDDDDDDDDDD ',
    wrappableAccountBalance,
    formatTokenAmount(wrappableAccountBalance, wrappableToken.decimals)
  )

  return (
    <Box padding={3 * GU}>
      <div
        css={`
          display: flex;
          flex-direction: row;
          height: ${27 * GU}px;
        `}
      >
        <Token
          mode="wrap"
          balance={formatTokenAmount(
            wrappableAccountBalance,
            wrappableToken.decimals
          )}
          symbol={wrappableToken.symbol}
          onClick={() => {}}
        />
        <LineSeparator border={theme.border} />
        <Token
          mode="unwrap"
          balance={formatTokenAmount(gardenTokenBalance, stakeToken.decimals)}
          symbol={stakeToken.symbol}
          onClick={() => {}}
        />
      </div>
    </Box>
  )
}

function Token({ mode, balance, symbol, onClick }) {
  const icon = mode === 'wrap' ? unwrappedIcon : wrappedIcon
  const button =
    mode === 'wrap'
      ? { mode: 'strong', label: 'Wrap' }
      : { mode: 'normal', label: 'Unwrap' }

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        ${textStyle('body2')};
      `}
    >
      <img src={icon} height="48" width="48" />
      <span
        css={`
          font-weight: 400;
        `}
      >
        {balance}
      </span>
      <span>{symbol}</span>
      <Button mode={button.mode} wide label={button.label} onClick={onClick} />
    </div>
  )
}

const LineSeparator = styled.div`
  border-left: 1px solid ${({ border }) => border};
  margin: 0 ${3 * GU}px;
`

export default WrapToken
