import React from 'react'
import { GU } from '@1hive/1hive-ui'
import { ProposalTypes } from '../types'

function ProposalIcon({ type }) {
  let color
  if (type === ProposalTypes.Decision) {
    color = '#FFC3AB'
  } else {
    color = type === ProposalTypes.Proposal ? '#ffdd0f' : '#71EEB8'
  }

  return (
    <div
      css={`
        width: ${1.5 * GU}px;
        height: ${1.5 * GU}px;
        background: ${color};
        transform: rotate(45deg);
        margin: 0 ${1 * GU}px;
      `}
    />
  )
}

export default ProposalIcon
