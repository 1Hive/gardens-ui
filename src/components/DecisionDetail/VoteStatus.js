import React from 'react'
import styled from 'styled-components'
import {
  IconCheck,
  IconCross,
  IconTime,
  GU,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import {
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_REJECTED,
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_ENACTED,
  VOTE_STATUS_PENDING_ENACTMENT,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_SETTLED,
} from '../../constants'

export const getStatusAttributes = (status, theme) => {
  if (status === VOTE_STATUS_ONGOING) {
    return {
      label: 'Ongoing',
      Icon: IconTime,
      color: null,
    }
  }
  if (status === VOTE_STATUS_REJECTED) {
    return {
      label: 'Rejected',
      Icon: IconCross,
      color: theme.negative,
    }
  }
  if (status === VOTE_STATUS_ACCEPTED) {
    return {
      label: 'Passed',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (status === VOTE_STATUS_PENDING_ENACTMENT) {
    return {
      label: 'Passed (pending)',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (status === VOTE_STATUS_ENACTED) {
    return {
      label: 'Passed (enacted)',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (status === VOTE_STATUS_DISPUTED) {
    // TODO: update
    return {
      label: 'Disputed',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (status === VOTE_STATUS_CHALLENGED) {
    return {
      label: 'Challenged',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (status === VOTE_STATUS_SETTLED) {
    return {
      label: 'Settled',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
}

const VoteStatus = ({ vote }) => {
  const theme = useTheme()

  const { Icon, color, label } = getStatusAttributes(vote.status, theme)

  return (
    <Main
      css={`
        ${textStyle('body2')};
        color: ${color || theme.surfaceContentSecondary};
      `}
    >
      {Icon && <Icon size="small" />}
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
`

export default VoteStatus
