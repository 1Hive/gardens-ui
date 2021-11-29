import React, { useCallback, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import VoteOnDecision from './VoteOnDecision'

import useActions from '@hooks/useActions'

function VoteOnDecisionScreens({
  canUserVote,
  canUserVoteOnBehalfOf,
  proposal,
  principals,
  supports,
}) {
  const { votingActions } = useActions()
  const [transactions, setTransactions] = useState([])

  const temporatyTrx = useRef([])

  const vote = useCallback(
    async (voteId, supports) => {
      await votingActions.voteOnDecision(voteId, supports, intent => {
        temporatyTrx.current = temporatyTrx.current.concat(intent)
      })
    },
    [votingActions]
  )
  const voteOnBehalfOf = useCallback(
    async (voteId, supports, voters) => {
      await votingActions.voteOnBehalfOf(voteId, supports, voters, intent => {
        temporatyTrx.current = temporatyTrx.current.concat(intent)
      })
    },
    [votingActions]
  )

  const getTransactions = useCallback(
    async onComplete => {
      if (canUserVote) {
        await vote(proposal.number, supports)
      }

      if (canUserVoteOnBehalfOf && principals?.length > 0) {
        await voteOnBehalfOf(proposal.number, supports, principals)
      }

      setTransactions(temporatyTrx.current)
      onComplete()
    },
    [
      canUserVote,
      canUserVoteOnBehalfOf,
      principals,
      proposal,
      supports,
      vote,
      voteOnBehalfOf,
    ]
  )

  const screens = useMemo(() => {
    return [
      {
        title: `Vote ${supports ? 'Yes' : 'No'} on decision`,
        graphicHeader: false,
        content: <VoteOnDecision getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions, supports])

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
