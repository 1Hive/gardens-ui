import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import SupportProposal from './SupportProposal'

function SupportProposalScreens({ onStakeToProposal, id }) {
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async (onComplete, proposalId, amount) => {
      await onStakeToProposal({ proposalId, amount }, intent => {
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [onStakeToProposal]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Support this proposal',
        graphicHeader: false,
        content: <SupportProposal id={id} getTransactions={getTransactions} />,
      },
    ],
    [getTransactions, id]
  )
  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Support this proposal"
      screens={screens}
    />
  )
}

export default SupportProposalScreens
