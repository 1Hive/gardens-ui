import React from 'react'
import styled from 'styled-components'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@1hive/1hive-ui'

import celesteIconSvg from '../../assets/celeste-icon.svg'
import challengeIconSvg from '../../assets/challenge-icon.svg'

export function getStatusAttributes(proposal, theme) {
  if (proposal.statusData.open) {
    return {
      label: 'Open',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
  if (proposal.statusData.cancelled) {
    return {
      label: 'Cancelled',
      Icon: IconCross,
      color: theme.negative,
      background: '#FFF8F8',
      borderColor: theme.negative,
    }
  }
  if (proposal.statusData.disputed) {
    return {
      label: 'Waiting for celeste',
      iconSrc: celesteIconSvg,
      color: '#8253A8',
      background: '#FCFAFF',
      borderColor: '#8253A8',
    }
  }
  if (proposal.statusData.challenged) {
    return {
      label: 'Challenged',
      iconSrc: challengeIconSvg,
      color: '#F5A623',
      background: '#FFFDFA',
      borderColor: '#F5A623',
    }
  }
  if (proposal.statusData.settled) {
    return {
      label: 'Settled',
      Icon: IconCross,
      color: theme.contentSecondary,
      background: theme.background,
    }
  }
  if (proposal.statusData.executed) {
    return {
      label: 'Executed',
      Icon: IconCheck,
      color: theme.positive,
    }
  }
}

const ProposalStatus = ({ proposal }) => {
  const theme = useTheme()

  const { Icon, iconSrc, color, label } = getStatusAttributes(proposal, theme)

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

export default ProposalStatus
