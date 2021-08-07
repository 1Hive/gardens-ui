import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { addressesEqual } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
import SettlementDetails from './SettlementDetails'
import useActions from '@hooks/useActions'
import { useWallet } from '@providers/Wallet'

import { hexToUtf8 } from 'web3-utils'

function SettleProposalScreens({ proposal }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [challengeContext, setChallengeContext] = useState()

  const { account } = useWallet()
  const { agreementActions } = useActions()

  const isChallenger = addressesEqual(account, proposal.challenger)

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
        title: isChallenger ? 'Claim collateral' : 'Accept settlement offer',
        content: (
          <SettlementDetails
            challengeContext={challengeContext}
            getTransactions={getTransactions}
            isChallenger={isChallenger}
            proposal={proposal}
          />
        ),
      },
    ],
    [challengeContext, getTransactions, isChallenger, proposal]
  )

  return (
    <ModalFlowBase
      screens={screens}
      loading={loading}
      transactions={transactions}
      transactionTitle={isChallenger ? 'Claim collateral' : 'Accept settlement'}
    />
  )
}

export default SettleProposalScreens
