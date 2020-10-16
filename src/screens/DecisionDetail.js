import React from 'react'
import { GU } from '@1hive/1hive-ui'

import { useDescribeVote } from '../hooks/useDescribeVote'

function DecisionDetail({ proposal }) {
  const {
    description,
    emptyScript,
    loading: descriptionLoading,
  } = useDescribeVote(proposal?.script, proposal?.id)

  console.log('DESCRIBED ', description, emptyScript, descriptionLoading)

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
