import React from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'
import { ProposalTypes } from '@/types'
import { css, jsx } from '@emotion/react'

function ProposalIcon({ type }) {
  const theme = useTheme()
  let color
  if (type === ProposalTypes.Decision) {
    color = '#FFC3AB'
  } else {
    color =
      type === ProposalTypes.Proposal
        ? theme.yellow.toString()
        : theme.green.toString()
  }

  return (
    <div
      css={css`
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
