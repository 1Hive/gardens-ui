import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, Help, textStyle, useTheme, useViewport } from '@1hive/1hive-ui'
import { buildGardenPath } from '@utils/routing-utils'
import { ProposalType } from '@/hooks/constants'
import styled from 'styled-components'
import AbstainIcon from '@assets/abstain-icon.svg'
import ProposalSupport from './ProposalSupport'

type AbstainCardProps = {
  proposal: ProposalType
}

function AbstainCard({ proposal }: AbstainCardProps) {
  const theme = useTheme()
  const history = useHistory()

  const { below } = useViewport()

  const handleSelectProposal = useCallback(() => {
    const path = buildGardenPath(
      history.location,
      `proposal/${proposal.number}`
    )
    history.push(path)
  }, [history, proposal.number])

  return (
    <div
      css={`
        border: 1px solid #71eeb8;
        background: ${theme.surface};
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px;
        border-radius: ${2 * GU}px;
        cursor: pointer;

        ${below('medium') &&
        `
          padding-left: ${2 * GU}px;
          padding-right: ${2 * GU}px;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        `}
      `}
    >
      <AbstainCardHeader
        proposal={proposal}
        handleSelectProposal={handleSelectProposal}
      />
      <div onClick={handleSelectProposal} style={{ marginTop: '16px' }}>
        <ProposalSupport proposal={proposal} isAbstainProposal={true} />
      </div>
    </div>
  )
}

type AbstainCardHeaderProps = {
  proposal: ProposalType
  handleSelectProposal?: () => void
}

export const AbstainCardHeader = ({
  proposal,
  handleSelectProposal,
}: AbstainCardHeaderProps) => {
  return (
    <HeaderCard>
      <HeaderCardInfo onClick={handleSelectProposal}>
        <img src={AbstainIcon} alt="" height="14" width="14" />
        <span
          css={`
            ${textStyle('body3')}
          `}
        >
          {proposal.name}
        </span>
      </HeaderCardInfo>
      <Help hint="">111</Help>
    </HeaderCard>
  )
}

const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const HeaderCardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export default AbstainCard
