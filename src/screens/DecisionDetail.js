import React from 'react'
import { GU } from '@1hive/1hive-ui'

import useProposalLogic from '../logic/proposal-logic'

function DecisionDetail({ match }) {
  const { proposal } = useProposalLogic(match)
  console.log('INSIDE DETAIL ', proposal)

  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      s
    </div>
  )
}

export default DecisionDetail
