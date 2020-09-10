import React from 'react'
import styled from 'styled-components'
import { Box, GU, Link, textStyle, useTheme } from '@1hive/1hive-ui'

import { useMyStakesHistory } from '../../hooks/useStakes'

function Activity() {
  const theme = useTheme()

  const myStakeHistory = useMyStakesHistory()

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
          {myStakeHistory.length ? (
            myStakeHistory.map((stake, index) => (
              <div
                key={index}
                css={`
                  padding-top: ${3 * GU}px;
                  display: flex;
                  align-items: center;

                  & :not(:last-child) {
                    padding-bottom: ${3 * GU}px;
                    border-bottom: ${0.5}px solid ${theme.border};
                  }
                `}
              >
                You supported <ProposalIcon /> Proposal{' '}
                <Link
                  href={`/#/proposal/${stake.proposalId}`}
                  external={false}
                  css={`
                    margin-left: ${1 * GU}px;
                    text-decoration: none;
                  `}
                >
                  {stake.proposalName}
                </Link>
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

const ProposalIcon = styled.div`
  width: ${1.5 * GU}px;
  height: ${1.5 * GU}px;
  background: #ffdd0f;
  transform: rotate(45deg);
  margin: 0 ${1 * GU}px;
`

export default Activity
