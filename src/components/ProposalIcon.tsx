import React from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'
import { ProposalTypes } from '@/types'

function ProposalIcon({ type }: { type: string }) {
  const theme = useTheme()
  let color
  if (type === ProposalTypes.Decision) {
    color = theme.red
  } else {
    color =
      type === ProposalTypes.Proposal
        ? theme.yellow
        : type === ProposalTypes.Suggestion
        ? theme.green
        : theme.blue
  }

  return (
    <div
      css={`
        width: ${1.5 * GU}px;
        height: ${1.5 * GU}px;
        background: ${color};
        transform: rotate(45deg);
        margin: 0 ${0.5 * GU}px;
      `}
    />
  )
}

export default ProposalIcon
