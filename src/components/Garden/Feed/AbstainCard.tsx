import styled from 'styled-components'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { GU, Help, useTheme, useViewport } from '@1hive/1hive-ui'

import { ProposalType } from '@/types/app'

import ProposalSupport from './ProposalSupport'

type AbstainCardProps = {
  proposal: ProposalType
}

function AbstainCard({ proposal }: AbstainCardProps) {
  const theme = useTheme()
  const router = useRouter()
  const query = router.query

  const { below } = useViewport()

  const handleSelectProposal = useCallback(() => {
    router.push(
      `/${query.networkType}/garden/${query.gardenAddress}/proposal/${proposal.number}`
    )
  }, [router, proposal.number])

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
      <AbstainCardHeader handleSelectProposal={handleSelectProposal} />
      <div onClick={handleSelectProposal}>
        <ProposalSupport proposal={proposal} />
      </div>
    </div>
  )
}

type AbstainCardHeaderProps = {
  handleSelectProposal?: () => void
  showHint?: boolean
}

export const AbstainCardHeader = ({
  handleSelectProposal,
  showHint = true,
}: AbstainCardHeaderProps) => {
  return (
    <HeaderCard>
      <HeaderCardInfo onClick={handleSelectProposal}>
        <img
          src={'/icons/base/abstain-icon.svg'}
          alt=""
          height={2.5 * GU}
          width={2.5 * GU}
        />
        <span>Abstain</span>
      </HeaderCardInfo>
      {showHint ? (
        <Help hint="">
          This is a special kind of suggestion proposal that is always
          available. It serves the purpose of regulating the community&apos;s
          expenditure by increasing the amount of support required for all other
          funding proposals to pass.
        </Help>
      ) : null}
    </HeaderCard>
  )
}

const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 16px;
`

const HeaderCardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export default AbstainCard
