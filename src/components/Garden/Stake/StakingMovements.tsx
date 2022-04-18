import {
  GU,
  Tag,
  Link,
  IconLock,
  useTheme,
  DataView,
  IconCheck,
  IconClock,
  IconCross,
  IconAttention,
  formatTokenAmount,
} from '@1hive/1hive-ui'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'

import {
  StakingType,
  StakingCollateralType,
  StakingStatusesMap,
  CollateralStatusesMap,
} from './staking-management-statuses'
import { TokenType } from '@/types/app'
import { dateFormat, toMs } from '@utils/date-utils'
import { buildGardenPath } from '@utils/routing-utils'
import { useGardenState } from '@providers/GardenState'

const getActionAttributes = (status: StakingType, theme: any): ActionType => {
  const actionAttributes: Record<StakingType, ActionType> = {
    [StakingType.Scheduled]: {
      background: theme.infoSurface,
      color: theme.tagIndicatorContent,
      icon: <IconClock size="small" />,
    },
    [StakingType.Challenged]: {
      background: theme.warningSurface,
      color: theme.warningSurfaceContent,
      icon: <IconAttention size="small" />,
    },
    [StakingType.Completed]: {
      background: theme.positiveSurface,
      color: theme.positiveSurfaceContent,
      icon: <IconCheck size="small" />,
    },
    [StakingType.Cancelled]: {
      background: theme.surfaceUnder,
      color: theme.contentSecondary,
      icon: <IconCross size="small" />,
    },
    [StakingType.Settled]: {
      background: theme.surfaceUnder,
      color: theme.contentSecondary,
      icon: <IconCross size="small" />,
    },
  }

  return actionAttributes[status]
}

const getCollateralAttributes = (
  status: StakingCollateralType,
  theme: any
): CollateralType => {
  const collateralAttributes: Record<StakingCollateralType, CollateralType> = {
    [StakingCollateralType.Locked]: {
      color: theme.surfaceOpened,
      icon: <IconLock size="small" />,
    },
    [StakingCollateralType.Challenged]: {
      color: theme.surfaceOpened,
      icon: <IconLock size="small" />,
    },
    [StakingCollateralType.Available]: {
      color: theme.content,
    },
    [StakingCollateralType.Slashed]: {
      color: theme.negative,
    },
  }

  return collateralAttributes[status]
}

type StakingMovementsProps = {
  stakingMovements: Array<StakeMovement>
  token: TokenType
}

function StakingMovements({ stakingMovements, token }: StakingMovementsProps) {
  const { config } = useGardenState()
  const theme = useTheme()
  const router = useRouter()

  const [selectedPage, setSelectedPage] = useState(0)

  const handlePageChange = useCallback((page) => {
    setSelectedPage(page)
  }, [])

  const getProposalType = (disputableAddress: string) =>
    disputableAddress === config.voting.id ? 'Decision' : 'Proposal'

  const handleGoToProposal = useCallback(
    (disputableActionId, disputableAddress) => {
      const proposalType =
        disputableAddress === config.voting.id ? 'vote' : 'proposal'

      const path = buildGardenPath(
        router,
        `${proposalType}/${disputableActionId}`
      )
      router.push(path)
    },
    [config, router]
  )

  return (
    <DataView
      fields={[
        { label: 'Date' },
        { label: 'Status' },
        { label: 'Action' },
        { label: 'Collateral state', align: 'end' },
        { label: 'Amount', align: 'end' },
      ]}
      entries={stakingMovements}
      emptyState={{
        default: {
          illustration: (
            <img src={'/icons/stake/no-dataview-data.svg'} alt="" />
          ),
          subtitle: "You haven't locked any collateral yet",
        },
      }}
      renderEntry={({
        amount,
        createdAt,
        actionState,
        collateralState,
        tokenDecimals,
        disputableActionId,
        disputableAddress,
      }: StakeMovement) => {
        const stakingStatus = StakingStatusesMap.get(actionState)
        const actionAttributes =
          stakingStatus && getActionAttributes(stakingStatus, theme)

        const collateralStatus = CollateralStatusesMap.get(collateralState)
        const amountAttributes =
          collateralStatus && getCollateralAttributes(collateralStatus, theme)

        return [
          <time
            dateTime={dateFormat(toMs(createdAt), 'standard')}
            title={dateFormat(toMs(createdAt), 'standard')}
            key="StakingMovements-date"
          >
            {dateFormat(toMs(createdAt), 'onlyDate')}
          </time>,
          <div key="StakingMovements-tag">
            <Tag
              background={`${actionAttributes?.background}`}
              color={`${actionAttributes?.color}`}
              icon={actionAttributes?.icon}
              mode="indicator"
              label={actionState}
            />
          </div>,
          <div key="StakingMovements-link">
            <Link
              onClick={() =>
                handleGoToProposal(disputableActionId, disputableAddress)
              }
            >
              {`${getProposalType(disputableAddress)} #${disputableActionId}`}
            </Link>
          </div>,
          <div key="StakingMovements-state">{collateralState}</div>,
          <div
            css={`
              font-weight: 600;
              color: ${amountAttributes?.color};
              display: flex;
              align-items: center;
            `}
            key="StakingMovements-amount"
          >
            {amountAttributes?.icon}
            <span
              css={`
                margin-left: ${1 * GU}px;
              `}
            >
              {formatTokenAmount(amount, tokenDecimals, {
                symbol: token.symbol,
              })}
            </span>
          </div>,
        ]
      }}
      onPageChange={handlePageChange}
      page={selectedPage}
    />
  )
}

export default StakingMovements
