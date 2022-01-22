import React from 'react'
import styled from 'styled-components'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@1hive/1hive-ui'
import { Colors } from '@nivo/core'

import celesteIconSvg from '@assets/celeste-icon.svg'
import challengeIconSvg from '@assets/challenge-icon.svg'
import { ProposalType } from '@/hooks/constants'

type StatusAttributes =
  | {
      label: string
      color: Colors
      Icon?: any
      iconSrc?: any
      background?: string
      borderColor?: Colors
    }
  | undefined

export const getStatusAttributes = (
  proposal: ProposalType,
  theme: any
): StatusAttributes => {
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

type ProposalStatusProps = {
  proposal: ProposalType
}

const ProposalStatus = ({ proposal }: ProposalStatusProps) => {
  const theme = useTheme()

  const attributes = getStatusAttributes(proposal, theme)

  return (
    <Main
      css={`
        ${textStyle('body2')};
        color: ${attributes?.color || theme.surfaceContentSecondary};
      `}
    >
      {attributes?.iconSrc ? (
        <img
          src={attributes?.iconSrc}
          alt=""
          width="24"
          height="24"
          css={`
            display: block;
            margin-right: ${0.5 * GU}px;
          `}
        />
      ) : (
        attributes?.Icon !== undefined && <attributes.Icon />
      )}
      <StatusLabel spaced={Boolean(attributes?.Icon)}>
        {attributes?.label}
      </StatusLabel>
    </Main>
  )
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

const StatusLabel = styled.span<{
  spaced?: boolean
}>`
  margin-left: ${({ spaced }) => (spaced ? `${0.5 * GU}px` : '0')};
  text-transform: uppercase;
`

export default ProposalStatus
