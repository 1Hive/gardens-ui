import React, { useMemo } from 'react'
import { Box, GU, Link, textStyle, useTheme } from '@1hive/1hive-ui'

import ProposalIcon from '../ProposalIcon'
import { useAppState } from '../../providers/AppState'
import { useSupporterSubscription } from '../../hooks/useSubscriptions'

import { convertToString } from '../../types'
import { dateFormat } from '../../utils/date-utils'

function Activity({ account, isConnectedAccount, profileName }) {
  const theme = useTheme()

  const { honeypot } = useAppState()
  const supporter = useSupporterSubscription(honeypot, account)

  const dedupedStakes = useMemo(() => {
    if (!supporter?.stakesHistory?.length) {
      return []
    }
    return supporter.stakesHistory.reduce((acc, stake) => {
      const index = acc.findIndex(
        accStake => accStake.proposal.id === stake.proposal.id
      )

      if (index >= 0) {
        return acc
      }

      return [...acc, stake]
    }, [])
  }, [supporter])

  return (
    <Box>
      <div>
        <h3
          css={`
            margin-bottom: ${2 * GU}px;
            ${textStyle('title3')};
          `}
        >
          Recent activity
        </h3>
        <div>
          {dedupedStakes.length ? (
            dedupedStakes.map((stake, index) => (
              <div
                key={index}
                css={`
                  padding-top: ${3 * GU}px;

                  & :not(:last-child) {
                    padding-bottom: ${3 * GU}px;
                    border-bottom: ${0.5}px solid ${theme.border};
                  }
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    margin-bottom: ${1 * GU}px;
                    flex-wrap: wrap;
                    column-gap: ${0.75 * GU}px;
                  `}
                >
                  {isConnectedAccount ? 'You' : profileName} supported the{' '}
                  <ProposalIcon type={stake.proposal.type} />{' '}
                  {convertToString(stake.proposal.type)}{' '}
                  <Link
                    href={`/#/proposal/${stake.proposal.id}`}
                    external={false}
                    css={`
                      text-align: left;
                      text-decoration: none;
                      white-space: normal;
                    `}
                  >
                    {stake.proposal.name}
                  </Link>
                </div>
                <div
                  css={`
                    color: ${theme.contentSecondary};
                    ${textStyle('body3')};
                  `}
                >
                  {dateFormat(stake.createdAt, 'custom')}
                </div>
              </div>
            ))
          ) : (
            <span>No recent activity</span>
          )}
        </div>
      </div>
    </Box>
  )
}

export default Activity
