import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ExecuteProposal from './ExecuteProposal'

function ExecuteProposalScreens({ proposal, convictionActions }) {
  const [transactions, setTransactions] = useState([])

  const { id: proposalId } = proposal

  const getTransactions = useCallback(
    async onComplete => {
      await convictionActions.executeProposal(proposalId, intent => {
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
