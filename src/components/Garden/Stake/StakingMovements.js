/* eslint-disable no-redeclare */
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  DataView,
  GU,
  IconAttention,
  IconCheck,
  IconClock,
  IconCross,
  IconLock,
  Link,
  Tag,
  formatTokenAmount,
  useTheme,
} from '@1hive/1hive-ui'

import { dateFormat, toMs } from '@utils/date-utils'
import { buildGardenPath } from '@utils/routing-utils'

import { useGardenState } from '@providers/GardenState'

import noDataIllustration from './assets/no-dataview-data.svg'
import {
  COLLATERAL_AVAILABLE,
  COLLATERAL_CHALLENGED,
  COLLATERAL_LOCKED,
  COLLATERAL_SLASHED,
  COLLATERAL_STATUSES,
  STAKING_CANCELLED,
  STAKING_CHALLENGED,
  STAKING_COMPLETED,
  STAKING_SCHEDULED,
  STAKING_SETTLED,
  STAKING_STATUSES,
} from './staking-management-statuses'

function getActionAttributes(status, theme) {
  const actionAttributes = {
    [STAKING_SCHEDULED]: {
      background: theme.infoSurface,
      color: theme.tagIndicatorContent,
      icon: <IconClock size="small" />,
    },
    [STAKING_CHALLENGED]: {
      background: theme.warningSurface,
      color: theme.warningSurfaceContent,
      icon: <IconAttention size="small" />,
    },
    [STAKING_COMPLETED]: {
      background: theme.positiveSurface,
      color: theme.positiveSurfaceContent,
      icon: <IconCheck size="small" />,
    },
    [STAKING_CANCELLED]: {
      background: theme.surfaceUnder,
      color: theme.contentSecondary,
      icon: <IconCross size="small" />,
    },
    [STAKING_SETTLED]: {
      background: theme.surfaceUnder,
      color: theme.contentSecondary,
      icon: <IconCross size="small" />,
    },
  }

  return actionAttributes[status]
}

function getCollateralAttributes(status, theme) {
  const collateralAttributes = {
    [COLLATERAL_LOCKED]: {
      color: theme.surfaceOpened,
      icon: <IconLock size="small" />,
    },
    [COLLATERAL_CHALLENGED]: {
      color: theme.surfaceOpened,
      icon: <IconLock size="small" />,
    },
    [COLLATERAL_AVAILABLE]: {
      color: theme.content,
    },
    [COLLATERAL_SLASHED]: {
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
        const stakingStatus = STAKING_STATUSES.get(actionState)
        const actionAttributes = getActionAttributes(stakingStatus, theme)

        const collateralStatus = COLLATERAL_STATUSES.get(collateralState)
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
              Proposal #{disputableActionId}
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
