import React, { useMemo } from 'react'
import {
  Box,
  GU,
  isAddress,
  Link,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import ProposalIcon from '../ProposalIcon'
import { useGardens } from '@/providers/Gardens'
import useUser from '@hooks/useUser'
import { useWallet } from '@providers/Wallet'

import { convertToString } from '@/types'
import { dateFormat } from '@utils/date-utils'
import { getGardenLabel } from '@utils/garden-utils'
import { getNetworkType } from '@utils/web3-utils'

type ActivityProps = {
  account: string
  isConnectedAccount: boolean
  profileName: string
}

type StakeItem = {
  proposal: {
    id: number | string
    name?: string
    organization: {
      id: number | string
    }
    type: string
  }
  createdAt?: any
}

function Activity({ account, isConnectedAccount, profileName }: ActivityProps) {
  const theme = useTheme()
  const { user } = useUser(account)

  const { gardensMetadata } = useGardens()
  const { preferredNetwork } = useWallet()

  const networkType = getNetworkType(preferredNetwork)

  const dedupedStakes = useMemo(() => {
    if (!user?.supports.length) {
      return []
    }

    return user.supports
      .flatMap(({ stakesHistory }) => stakesHistory)
      .reduce((acc: Array<StakeItem>, stake: StakeItem) => {
        const index = acc.findIndex(
          (accStake: StakeItem) => accStake.proposal.id === stake.proposal.id
        )

        if (index >= 0) {
          return acc
        }

        return [...acc, stake]
      }, [])
  }, [user])

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
            dedupedStakes.map(({ createdAt, proposal }, index) => {
              const gardenAddress = proposal.organization.id
              const gardenPath = `/#/${networkType}/garden/${gardenAddress}`
              // TODO: evaluate a more efficient way to handle this
              const gardenLabel = getGardenLabel(gardenAddress, gardensMetadata)

              return (
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
                    <ProposalIcon type={proposal.type} />{' '}
                    {convertToString(proposal.type)}{' '}
                    <Link
                      href={`${gardenPath}/proposal/${proposal.id}`}
                      external={false}
                      css={`
                        text-align: left;
                        text-decoration: none;
                        white-space: normal;
                      `}
                    >
                      {proposal.name}
                    </Link>
                    <span>
                      {' '}
                      in{' '}
                      <Link href={gardenPath} external={false}>
                        {isAddress(gardenLabel)
                          ? shortenAddress(gardenLabel)
                          : gardenLabel}
                      </Link>
                    </span>
                  </div>
                  <div
                    css={`
                      color: ${theme.contentSecondary};
                      ${textStyle('body3')};
                    `}
                  >
                    {dateFormat(createdAt, 'custom')}
                  </div>
                </div>
              )
            })
          ) : (
            <span>No recent activity</span>
          )}
        </div>
      </div>
    </Box>
  )
}

export default Activity
