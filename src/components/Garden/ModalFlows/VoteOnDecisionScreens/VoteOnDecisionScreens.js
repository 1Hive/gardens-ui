import React, { useCallback, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import VoteOnDecision from './VoteOnDecision'

import useActions from '@hooks/useActions'
import { VOTE_YEA } from '@/constants'

function VoteOnDecisionScreens({ proposal, voteType }) {
  const { votingActions } = useActions()
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async onComplete => {
      await votingActions.voteOnDecision(proposal.number, voteType, intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [proposal, voteType, votingActions]
  )

  const screens = useMemo(() => {
    return [
      {
        title: `Vote ${voteType === VOTE_YEA ? 'Yes' : 'No'} on decision`,
        graphicHeader: false,
        content: <VoteOnDecision getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions, voteType])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Vote on decision"
      screens={screens}
    />
  )
}

export default VoteOnDecisionScreens
