import React from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import ProposalIcon from '@components/ProposalIcon'
import { dateFormat } from '@utils/date-utils'
import { convertToString } from '@/types'
import { ProposalType } from '@/types/app'

type ProposalHeaderProps = {
  proposal: ProposalType
  isPoll: boolean
}

function ProposalHeader({ proposal, isPoll }: ProposalHeaderProps) {
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <ProposalIcon type={proposal.type} />
        <span
          css={`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {isPoll ? 'Poll' : convertToString(proposal.type)}
        </span>
      </div>
      <div
        css={`
          ${textStyle('body3')};
          color: ${theme.contentSecondary};
          margin-left: ${1 * GU}px;
        `}
      >
        {dateFormat(proposal.createdAt, 'custom')}
      </div>
    </div>
  )
}

export default ProposalHeader
