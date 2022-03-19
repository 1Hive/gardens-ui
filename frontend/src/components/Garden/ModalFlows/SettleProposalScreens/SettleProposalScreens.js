import React, { useState, useCallback, useMemo } from 'react'
import { addressesEqual } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
import SettlementDetails from './SettlementDetails'
import useActions from '@hooks/useActions'
import { useWallet } from '@providers/Wallet'

function SettleProposalScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])

  const { account } = useWallet()
  const { agreementActions } = useActions()

  const isChallenger = addressesEqual(account, proposal.challenger)

  const getTransactions = useCallback(
    async onComplete => {
      await agreementActions.settleAction(
        { actionId: proposal.actionId },
        intent => {
          setTransactions(intent)
          onComplete()
        }
      )
    },
    [proposal, agreementActions]
  )

  const screens = useMemo(
    () => [
      {
        title: isChallenger ? 'Claim collateral' : 'Accept settlement offer',
        content: (
          <SettlementDetails
            getTransactions={getTransactions}
            isChallenger={isChallenger}
            proposal={proposal}
          />
        ),
      },
    ],
    [getTransactions, isChallenger, proposal]
  )

  return (
    <ModalFlowBase
      screens={screens}
      transactions={transactions}
      transactionTitle={isChallenger ? 'Claim collateral' : 'Accept settlement'}
    />
  )
}

export default SettleProposalScreens
