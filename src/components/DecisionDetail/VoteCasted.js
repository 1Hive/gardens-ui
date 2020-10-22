import React from 'react'
import { GU, IconCheck, RADIUS, textStyle, useTheme } from '@1hive/1hive-ui'
import { useAppState } from '../../providers/AppState'
import { formatTokenAmount } from '../../utils/token-utils'
import { getAccountCastStake } from '../../utils/vote-utils'
import { VOTE_YEA } from '../../constants'

function VoteCasted({ account, accountVote, vote }) {
  const { config } = useAppState()
  const accountStake = getAccountCastStake(vote, account)
  const { stakeToken } = config?.conviction || {}

  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background: ${theme.background};
        padding: ${3.5 * GU}px ${10 * GU}px;
        text-align: center;
        margin-top: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-template-columns: auto 1fr;
          grid-gap: ${3 * GU}px;
          align-items: center;
          text-align: left;
        `}
      >
        <div>
          <div
            css={`
              border: 3px solid ${theme.accent};
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${theme.accent};
            `}
          >
            <IconCheck />
          </div>
        </div>
        <div>
          <div
            css={`
            ${textStyle('body1')}
            margin-bottom: ${0.5 * GU}px;
          `}
          >
            Your vote was cast successfully
          </div>
          <div
            css={`
            ${textStyle('body2')}
            color: ${theme.surfaceContentSecondary};
          `}
          >
            You voted{' '}
            <span
              css={`
                color: ${theme.surfaceContent};
                font-weight: 600;
                text-transform: uppercase;
              `}
            >
              {accountVote === VOTE_YEA ? 'yes' : 'no'}
            </span>{' '}
            with{' '}
            <span
              css={`
                color: ${theme.surfaceContent};
                font-weight: 600;
              `}
            >
              {accountStake === 0
                ? '…'
                : formatTokenAmount(accountStake, stakeToken.decimals)}{' '}
              {stakeToken.symbol}
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoteCasted
