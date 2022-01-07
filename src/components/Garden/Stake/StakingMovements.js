/* eslint-disable no-redeclare */
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  GU,
  IconAttention,
  IconCheck,
  IconClock,
  IconCross,
  IconLock,
  formatTokenAmount,
  Link,
  Tag,
  useTheme,
  DataView,
} from '@1hive/1hive-ui'
import { useGardenState } from '@providers/GardenState'
import {
  StakingType,
  StakingCollateralType,
  StakingStatusesMap,
  CollateralStatusesMap,
} from './staking-management-statuses'
import { buildGardenPath } from '@utils/routing-utils'
import { dateFormat, toMs } from '@utils/date-utils'
import noDataIllustration from './assets/no-dataview-data.svg'

function getActionAttributes(status, theme) {
  console.log(`status`, status)

  const actionAttributes = {
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

function getCollateralAttributes(status, theme) {
  const collateralAttributes = {
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

function StakingMovements({ stakingMovements, token }) {
  const { config } = useGardenState()
  const theme = useTheme()
  const history = useHistory()

  const [selectedPage, setSelectedPage] = useState(0)

  const handlePageChange = useCallback((page) => {
    setSelectedPage(page)
  }, [])

  const handleGoToProposal = useCallback(
    (disputableActionId, disputableAddress) => {
      const proposalType =
        disputableAddress === config.voting.id ? 'vote' : 'proposal'

      const path = buildGardenPath(
        history.location,
        `${proposalType}/${disputableActionId}`
      )
      history.push(path)
    },
    [config, history]
  )

  const getTermByStatus = (status, actionId) => {
    switch (status) {
      case `Scheduled`:
        return `c`
      case 'Settled':
        return `b`
      case 'Challenged':
        return `e`
      default:
        return `Proposal #${actionId}`
    }
  }

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
          illustration: <img src={noDataIllustration} alt="" />,
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
      }) => {
        const stakingStatus = StakingStatusesMap.get(actionState)
        const actionAttributes = getActionAttributes(stakingStatus, theme)

        const collateralStatus = CollateralStatusesMap.get(collateralState)
        const amountAttributes = getCollateralAttributes(
          collateralStatus,
          theme
        )

        return [
          <time
            dateTime={dateFormat(toMs(createdAt), 'standard')}
            title={dateFormat(toMs(createdAt), 'standard')}
          >
            {dateFormat(toMs(createdAt), 'onlyDate')}
          </time>,
          <div>
            <Tag
              background={
                actionAttributes.background && `${actionAttributes.background}`
              }
              color={actionAttributes.color && `${actionAttributes.color}`}
              icon={actionAttributes.icon}
              mode="indicator"
              label={actionState}
            />
          </div>,
          <div>
            <Link
              onClick={() =>
                handleGoToProposal(disputableActionId, disputableAddress)
              }
            >
              {getTermByStatus(actionState, disputableActionId)}
            </Link>
          </div>,
          <div>{collateralState}</div>,
          <div
            css={`
              font-weight: 600;
              color: ${amountAttributes.color};
              display: flex;
              align-items: center;
            `}
          >
            {amountAttributes.icon}
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
