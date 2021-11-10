import React, { useMemo, useState, useCallback } from 'react'
import DelegateVoting from './DelegateVoting'
import ModalFlowBase from '../ModalFlowBase'
import useActions from '@hooks/useActions'

function DelegateVotingScreens() {
  const [transactions, setTransactions] = useState([])
  const { votingActions } = useActions() // TODO: Move to parent or create and use the actions provider

  const getTransactions = useCallback(
    async (onComplete, representative) => {
      await votingActions.delegateVoting(representative, intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [votingActions]
  )

  const screens = useMemo(() => {
    return [
      {
        title: 'Delegate votes',
        graphicHeader: false,
        content: <DelegateVoting getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Delegate votes"
      screens={screens}
    />
  )
}

export default DelegateVotingScreens
