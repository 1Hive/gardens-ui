import React, { useCallback, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import VoteOnDecision from './VoteOnDecision'

import useActions from '@hooks/useActions'

function VoteOnDecisionScreens({
  proposal,
  principals,
  supports,
  userBalance,
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
      if (userBalance > 0) {
        await vote(proposal.number, supports)
      }

      if (principals?.length > 0) {
        await voteOnBehalfOf(proposal.number, supports, principals)
      }

      setTransactions(temporatyTrx.current)
      onComplete()
    },
    [principals, proposal, supports, userBalance, vote, voteOnBehalfOf]
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
