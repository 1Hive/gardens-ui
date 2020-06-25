import React, { useMemo } from 'react'
import {
  Box,
  EthIdenticon,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import BigNumber from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'

function Wallet({ myStakes }) {
  const theme = useTheme()
  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const inactiveTokens = useMemo(() => {
    if (!accountBalance.gte(0) || !myActiveTokens) {
      return new BigNumber('0')
    }
    return accountBalance.minus(myActiveTokens)
  }, [accountBalance, myActiveTokens])

  return (
    <Box padding={0}>
      <div
        css={`
          display: flex;
          align-items: center;
          padding: ${3 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <EthIdenticon
          address={account}
          radius={100}
          scale={1.7}
          css={`
            margin-right: ${1.5 * GU}px;
          `}
        />
        <span
          css={`
            ${textStyle('title4')}
          `}
        >
          {shortenAddress(account, 4)}
        </span>
      </div>
      <div
        css={`
          padding: ${3 * GU}px;
        `}
      >
        <h5
          css={`
            ${textStyle('title4')};
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Wallet
        </h5>
        <div
          css={`
            margin-left: ${3 * GU}px;
          `}
        >
          <div
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            <h5
              css={`
                color: ${theme.contentSecondary};
                margin-bottom: ${0.5 * GU}px;
              `}
            >
              Balance
            </h5>
            <span
              css={`
                ${textStyle('title4')};
              `}
            >
              {formatTokenAmount(accountBalance, stakeToken.decimals)}
            </span>
          </div>
          <div>
            <h5
              css={`
                color: ${theme.contentSecondary};
                margin-bottom: ${0.5 * GU}px;
              `}
            >
              Inactive
            </h5>
            <span
              css={`
                ${textStyle('title4')};
                color: ${theme.negative};
              `}
            >
              {formatTokenAmount(inactiveTokens, stakeToken.decimals)}
            </span>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default Wallet
