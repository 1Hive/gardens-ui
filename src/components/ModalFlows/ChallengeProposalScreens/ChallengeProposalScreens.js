import React, { useCallback, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ChallengeRequirements from './ChallengeRequirements'
import ChallengeForm from './ChallengeForm'
import { useAppState } from '../../../providers/AppState'
import { useDisputeFees } from '../../../hooks/useDispute'
import { useAgreement } from '../../../hooks/useAgreement'

function ChallengeProposalScreens({ onChallengeAction, proposal }) {
  const [transactions, setTransactions] = useState([])
  const [agreement, loading] = useAgreement()
  const { accountBalance } = useAppState()
  const disputeFees = useDisputeFees()

  const handleSetTransactions = useCallback(transactions => {
    setTransactions(transactions)
  }, [])

  const screens = useMemo(
    () => [
      {
        title: 'Challenge action requirements',
        content: (
          <ChallengeRequirements
            agreement={agreement}
            accountBalance={accountBalance}
            disputeFees={disputeFees}
          />
        ),
      },
      {
        title: 'Challenge action requirements',
        content: (
          <ChallengeForm
            handleSetTransactions={handleSetTransactions}
            onChallengeAction={onChallengeAction}
            proposal={proposal}
          />
        ),
      },
    ],
    [
      accountBalance,
      agreement,
      disputeFees,
      handleSetTransactions,
      onChallengeAction,
      proposal,
    ]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={!disputeFees.token || loading}
      transactions={transactions}
      transactionTitle="Challenge proposal"
      screens={screens}
    />
  )
}

export default ChallengeProposalScreens
