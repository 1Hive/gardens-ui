import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import RemoveProposal from './RemoveProposal'

function RemoveProposalScreens({ proposal, mode, convictionActions }) {
  const [transactions, setTransactions] = useState([])

  const { id: proposalId } = proposal

  const getTransactions = useCallback(
    async onComplete => {
      await convictionActions.cancelProposal(proposalId, intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [convictionActions, proposalId]
  )

  const screens = useMemo(() => {
    return [
      {
        title: 'Are you sure you want to remove this proposal?',
        graphicHeader: false,
        content: <RemoveProposal getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Remove Proposal"
      screens={screens}
    />
  )
}

export default RemoveProposalScreens
