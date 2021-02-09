import React from 'react'
import styled from 'styled-components'
import { IconCheck, IconCross, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import {
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_REJECTED,
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_ENACTED,
  VOTE_STATUS_PENDING_ENACTMENT,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_SETTLED,
  VOTE_STATUS_CANCELLED,
} from '../../constants'

import celesteIconSvg from '../../assets/celeste-icon.svg'
import challengeIconSvg from '../../assets/challenge-icon.svg'

export const getStatusAttributes = (vote, theme) => {
  const { isAccepted, voteStatus } = vote
  if (voteStatus === VOTE_STATUS_ONGOING) {
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
  if (voteStatus === VOTE_STATUS_CANCELLED) {
    return {
      label: 'Cancelled',
      Icon: IconCross,
      color: theme.negative,
      background: '#FFF8F8',
      borderColor: theme.negative,
    }
  }
  if (voteStatus === VOTE_STATUS_REJECTED) {
    return {
      label: 'Rejected',
      Icon: IconCross,
      color: theme.negative,
    }
  }
  if (voteStatus === VOTE_STATUS_ACCEPTED) {
    return {
      label: 'Passed',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (voteStatus === VOTE_STATUS_PENDING_ENACTMENT) {
    return {
      label: 'Passed (pending)',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (voteStatus === VOTE_STATUS_ENACTED) {
    return {
      label: 'Passed (enacted)',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (voteStatus === VOTE_STATUS_DISPUTED) {
    return {
      label: 'Waiting for celeste',
      iconSrc: celesteIconSvg,
      color: '#8253A8',
      background: '#FCFAFF',
      borderColor: '#8253A8',
    }
  }
  if (voteStatus === VOTE_STATUS_CHALLENGED) {
    return {
      label: 'Challenged',
      iconSrc: challengeIconSvg,
      color: '#F5A623',
      background: '#FFFDFA',
      borderColor: '#F5A623',
    }
  }
  if (voteStatus === VOTE_STATUS_SETTLED) {
    return {
      label: 'Settled',
      Icon: IconCross,
      color: theme.contentSecondary,
      background: theme.background,
    }
  }
}

const VoteStatus = ({ vote }) => {
  const theme = useTheme()

  const { Icon, iconSrc, color, label } = getStatusAttributes(vote, theme)

  return (
    <Main
      css={`
        ${textStyle('body2')};
        color: ${color || theme.surfaceContentSecondary};
      `}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          width="24"
          height="24"
          css={`
            display: block;
            margin-right: ${0.5 * GU}px;
          `}
        />
      ) : (
        Icon && <Icon />
      )}
      <StatusLabel spaced={Boolean(Icon)}>{label}</StatusLabel>
    </Main>
  )
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

const StatusLabel = styled.span`
  margin-left: ${({ spaced }) => (spaced ? `${0.5 * GU}px` : '0')};
  text-transform: uppercase;
`

export default VoteStatus
