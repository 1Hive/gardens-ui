import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
// import ChangeSupport from './ChangeSupport'
import SupportProposal from './SupportProposal'

import useActions from '../../../hooks/useActions'

function SupportProposalScreens({ proposal, mode, onStakeToProposal }) {
  const [transactions, setTransactions] = useState([])
  const { convictionActions } = useActions()

  const { id: proposalId } = proposal

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      if (mode === 'support') {
        await convictionActions.stakeToProposal(
          { proposalId, amount },
          intent => {
            setTransactions(intent)
            onComplete()
          }
        )
      }
    },
    [convictionActions, mode, proposalId]
  )

  const screens = useMemo(() => {
    if (mode === 'support') {
      return [
        {
          title: 'Support this proposal',
          graphicHeader: false,
          content: <SupportProposal getTransactions={getTransactions} />,
        },
      ]
    }
  }, [getTransactions, mode])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle={
        mode === 'support' ? 'Support this proposal' : 'Change support'
      }
      screens={screens}
    />
  )
}

export default SupportProposalScreens
