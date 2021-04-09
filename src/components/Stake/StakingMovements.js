import React, { useCallback } from 'react'
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
import { useAppState } from '../../providers/AppState'
import {
  STAKING_SCHEDULED,
  STAKING_CHALLENGED,
  STAKING_COMPLETED,
  STAKING_CANCELLED,
  STAKING_SETTLED,
  COLLATERAL_LOCKED,
  COLLATERAL_CHALLENGED,
  COLLATERAL_AVAILABLE,
  COLLATERAL_SLASHED,
  STAKING_STATUSES,
  COLLATERAL_STATUSES,
} from './staking-management-statuses'
import { dateFormat, toMs } from '../../utils/date-utils'
import noDataIllustration from './assets/no-dataview-data.svg'

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
      icon: (
        <IconLock
          size="small"
          css={`
            margin-right: ${1 * GU}px;
          `}
        />
      ),
    },
    [COLLATERAL_CHALLENGED]: {
      color: theme.surfaceOpened,
      icon: (
        <IconLock
          size="small"
          css={`
            margin-right: ${1 * GU}px;
          `}
        />
      ),
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
  const { config } = useAppState()
  const theme = useTheme()
  const history = useHistory()

  const handleGoToProposal = useCallback(
    (disputableActionId, disputableAddress) => {
      const proposalType =
        disputableAddress === config.voting.id ? 'vote' : 'proposal'
      history.push(`/${proposalType}/${disputableActionId}`)
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
          <span
            css={`
              font-weight: 600;
              color: ${amountAttributes.color};
              display: flex;
              align-items: center;
            `}
          >
            {amountAttributes.icon}
            {formatTokenAmount(amount, tokenDecimals, { symbol: token.symbol })}
          </span>,
        ]
      }}
    />
  )
}

export default StakingMovements
