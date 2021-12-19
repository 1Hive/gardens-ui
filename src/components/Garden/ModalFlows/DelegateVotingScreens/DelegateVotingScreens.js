import React, { useCallback, useMemo, useState } from 'react'

import useActions from '@hooks/useActions'

import ModalFlowBase from '../ModalFlowBase'
import DelegateVoting from './DelegateVoting'
import RemoveDelegate from './RemoveDelegate'

function DelegateVotingScreens({ mode }) {
  const [transactions, setTransactions] = useState([])
  const { votingActions } = useActions() // TODO: Move to parent or create and use the actions provider

  const getTransactions = useCallback(
    async (onComplete, representative) => {
      await votingActions.delegateVoting(representative, (intent) => {
        setTransactions(intent)
        onComplete()
      })
    },
    [votingActions]
  )

  const screens = useMemo(() => {
    return [
      mode === 'delegate'
        ? {
            title: 'Delegate votes',
            graphicHeader: false,
            content: <DelegateVoting getTransactions={getTransactions} />,
          }
        : {
            title: 'Remove delegate',
            graphicHeader: false,
            content: <RemoveDelegate getTransactions={getTransactions} />,
          },
    ]
  }, [getTransactions, mode])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle={
        mode === 'delegate' ? 'Delegate votes' : 'Remove delegate'
      }
      screens={screens}
    />
  )
}

export default DelegateVotingScreens
