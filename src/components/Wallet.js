import React from 'react'
import styled from 'styled-components'
import { Box, GU, LoadingRing, textStyle, useTheme } from '@1hive/1hive-ui'
import useAccountTokens from '@hooks/useAccountTokens'
import { useGardenState } from '@providers/GardenState'

import { formatTokenAmount } from '@utils/token-utils'

function Wallet({ account }) {
  const theme = useTheme()
  const { token } = useGardenState()
  const { decimals, logo, symbol } = token.data
  const { inactiveTokens } = useAccountTokens(account, token.accountBalance)

  return (
    <Box padding={0}>
      <div
        css={`
          padding: ${3 * GU}px;
        `}
      >
        <div>
          <Balance
            amount={token.accountBalance}
            decimals={decimals}
            icon={logo}
            label="Balance"
            loading={token.accountBalance.lt(0)}
            symbol={symbol}
          />
          <LineSeparator border={theme.border} />
          <Balance
            amount={inactiveTokens}
            decimals={decimals}
            icon={logo}
            inactive
            label="Idle"
            symbol={symbol}
          />
        </div>
      </div>
    </Box>
  )
}

const Balance = ({
  amount,
  decimals,
  icon,
  inactive = false,
  label,
  loading,
  symbol,
}) => {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
      `}
    >
      <div
        css={`
          margin-right: ${3 * GU}px;
        `}
      >
        <img
          src={icon}
          height="50"
          alt=""
          css={`
            opacity: ${inactive ? 0.5 : 1};
          `}
        />
      </div>
      <div>
        <h5
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {label}
        </h5>
        {loading ? (
          <LoadingRing />
        ) : (
          <span
            css={`
              ${textStyle('title4')};
              color: ${theme[inactive ? 'negative' : 'content']};
            `}
          >
            {formatTokenAmount(amount, decimals)}
          </span>
        )}
      </div>
    </div>
  )
}

const LineSeparator = styled.div`
  height: 1px;
  border-bottom: 0.5px solid ${({ border }) => border};
  margin: ${3 * GU}px 0;
`

export default Wallet
