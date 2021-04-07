import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import SettlementDetails from './SettlementDetails'

import useActions from '../../../hooks/useActions'
import { hexToUtf8 } from 'web3-utils'

function SettleProposalScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])
  const [challengeContext, setChallengeContext] = useState()
  const { agreementActions } = useActions()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // we need to do this contract call here to get the challenge because in the agreement connector we don't have a challenge entity
    // at some point for gardens we might want to have that done on the connector
    async function getChallengeData() {
      const challengeData = await agreementActions.getChallenge(
        proposal.challengeId
      )
      setChallengeContext(hexToUtf8(challengeData.context))
      setLoading(false)
    }
    getChallengeData()
  }, [agreementActions, proposal])

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
        title: 'Accept settlement offer',
        content: (
          <SettlementDetails
            proposal={proposal}
            getTransactions={getTransactions}
            challengeContext={challengeContext}
          />
        ),
      },
    ],
    [getTransactions, proposal, challengeContext]
  )

  return (
    <ModalFlowBase
      screens={screens}
      loading={loading}
      transactions={transactions}
      transactionTitle="Accept settlement"
    />
  )
}

export default SettleProposalScreens
