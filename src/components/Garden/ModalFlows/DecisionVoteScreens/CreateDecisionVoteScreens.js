import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ActionFees from '../CreateProposalScreens/ActionFees'
import CreateProposalRequirements from '../CreateProposalScreens/CreateProposalRequirements'
import { useAgreement } from '@hooks/useAgreement'
import { useWallet } from '@providers/Wallet'
import { useStakingState } from '@providers/Staking'

function CreateDecisionVoteScreens({ actions, fn, params, onComplete }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const { account } = useWallet()
  const [agreement, agreementLoading] = useAgreement()
  const { stakeManagement, loading: stakingLoading } = useStakingState()

  useEffect(() => {
    setLoading(true)
    setTransactions([])
  }, [account])

  useEffect(() => {
    setLoading(agreementLoading || stakingLoading)
  }, [agreementLoading, stakingLoading])

  const getTransactions = useCallback(
    async onComplete => {
      await actions[fn](params, intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [actions, fn, params]
  )

  const screens = useMemo(
    () =>
      stakingLoading
        ? []
        : [
            {
              title: 'Create proposal requirements',
              graphicHeader: false,
              content: (
                <CreateProposalRequirements
                  agreement={agreement}
                  staking={stakeManagement.staking}
                />
              ),
            },
            {
              title: 'Proposal deposit',
              graphicHeader: false,
              content: (
                <ActionFees
                  agreement={agreement}
                  onCreateTransaction={getTransactions}
                />
              ),
            },
          ],
    [agreement, getTransactions, stakingLoading, stakeManagement]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={loading}
      transactions={transactions}
      transactionTitle="Create proposal"
      screens={screens}
      onComplete={onComplete}
    />
  )
}

export default CreateDecisionVoteScreens
