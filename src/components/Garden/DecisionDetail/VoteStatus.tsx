import React from 'react'
import styled from 'styled-components'
import { IconCheck, IconCross, GU, textStyle, useTheme } from '@1hive/1hive-ui'

import {
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_SETTLED_STRING,
  PROPOSAL_STATUS_VOIDED_STRING,
} from '@/constants'

type AttributesProps = {
  label: string
  Icon?: React.ReactNode
  iconSrc?: any
  color: string
  background?: string
  borderColor?: string
}

type VoteType = {
  isAccepted: boolean
  isDelayed: boolean
  statusData: {
    open: boolean
    cancelled: boolean
    rejected: boolean
    accepted: boolean
    pendingExecution: boolean
    executed: boolean
    challenged: boolean
    settled: boolean
    disputed: boolean
  }
}

export const getStatusAttributes = (
  vote: any,
  theme: any
): AttributesProps | undefined => {
  const { isAccepted, statusData } = vote
  if (statusData.open) {
    if (isAccepted) {
      return {
        label: 'Will pass',
        Icon: IconCheck,
        color: theme.positive,
      }
    }

    return {
      label: "Won't pass",
      Icon: IconCross,
      color: theme.negative,
    }
  }
  if (statusData.cancelled) {
    return {
      label: PROPOSAL_STATUS_CANCELLED_STRING,
      Icon: IconCross,
      color: theme.negative,
      background: '#FFF8F8',
      borderColor: theme.negative,
    }
  }
  if (statusData.rejected) {
    return {
      label: 'Rejected',
      Icon: IconCross,
      color: theme.negative,
    }
  }
  if (statusData.accepted) {
    return {
      label: 'Passed',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (statusData.pendingExecution) {
    const subStatus = vote.isDelayed ? 'delayed' : 'pending'
    return {
      label: `Passed (${subStatus})`,
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (statusData.executed) {
    return {
      label: 'Passed (enacted)',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (statusData.disputed) {
    return {
      label: 'Waiting for celeste',
      iconSrc: '/icons/base/celeste-icon.svg',
      color: '#8253A8',
      background: '#FCFAFF',
      borderColor: '#8253A8',
    }
  }
  if (statusData.challenged) {
    return {
      label: PROPOSAL_STATUS_CHALLENGED_STRING,
      iconSrc: '/icons/base/challenge-icon.svg', //challengeIconSvg, TODO FIXME
      color: theme.challenge,
      background: theme.challengeSurface,
      borderColor: theme.challengeBorder,
    }
  }
  if (statusData.settled) {
    return {
      label: PROPOSAL_STATUS_SETTLED_STRING,
      Icon: IconCross,
      color: theme.contentSecondary,
      background: theme.background,
    }
  }
  if (statusData.voided) {
    return {
      label: PROPOSAL_STATUS_VOIDED_STRING,
      Icon: IconCross,
      color: theme.negative,
      background: '#FFF8F8',
      borderColor: theme.negative,
    }
  }
}

type VoteStatus = {
  vote: VoteType
}

const VoteStatus = ({ vote }: VoteStatus) => {
  const theme = useTheme()

  const statusAttributes = getStatusAttributes(vote, theme)
  const Icon = statusAttributes?.Icon !== undefined && statusAttributes?.Icon

  return (
    <Main
      css={`
        ${textStyle('body2')};
        color: ${statusAttributes?.color || theme.surfaceContentSecondary};
      `}
    >
      {statusAttributes?.iconSrc ? (
        <img
          src={statusAttributes?.iconSrc}
          alt=""
          width="24"
          height="24"
          css={`
            display: block;
            margin-right: ${0.5 * GU}px;
          `}
        />
      ) : (
        Icon
      )}
      <StatusLabel spaced={Boolean(statusAttributes?.Icon)}>
        {statusAttributes?.label}
      </StatusLabel>
    </Main>
  )
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

const StatusLabel = styled.span<{
  spaced: boolean
}>`
  margin-left: ${({ spaced }) => (spaced ? `${0.5 * GU}px` : '0')};
  text-transform: uppercase;
`

export default VoteStatus
