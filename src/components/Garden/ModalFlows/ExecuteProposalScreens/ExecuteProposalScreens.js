import React, { useCallback, useMemo, useState } from 'react'

import useActions from '@hooks/useActions'

import ModalFlowBase from '../ModalFlowBase'
import ExecuteProposal from './ExecuteProposal'

function ExecuteProposalScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])
  const { convictionActions } = useActions()

  const { id: proposalId } = proposal

  const getTransactions = useCallback(
    async (onComplete) => {
      await convictionActions.executeProposal(proposalId, (intent) => {
        setTransactions(intent)
        onComplete()
      })
    },
    [convictionActions, proposalId]
  )

  const screens = useMemo(() => {
    return [
      {
        title: 'Are you sure you want to execute this proposal?',
        graphicHeader: false,
        content: <ExecuteProposal getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Execute Proposal"
      screens={screens}
    />
  )
}

export default ExecuteProposalScreens
