import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useActions from '@hooks/useActions'
import { useAgreement } from '@hooks/useAgreement'

import { useStakingState } from '@providers/Staking'
import { useWallet } from '@providers/Wallet'

import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import AddProposal from './AddProposal'
import CreateProposalRequirements from './CreateProposalRequirements'

function CreateProposalScreens({ onComplete }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const { account } = useWallet()
  const [agreement, agreementLoading] = useAgreement()
  const { stakeManagement, loading: stakingLoading } = useStakingState()
  const { convictionActions } = useActions()

  const proposalData = useRef()

  useEffect(() => {
    setLoading(true)
    setTransactions([])
    proposalData.current = null
  }, [account])

  useEffect(() => {
    setLoading(agreementLoading || stakingLoading)
  }, [agreementLoading, stakingLoading])

  const handleSetProposalData = useCallback((data) => {
    proposalData.current = data
  }, [])

  const getTransactions = useCallback(
    async (onComplete) => {
      const { amount, beneficiary, link, title } = proposalData.current

      let params
      let fn
      if (amount.valueBN.eq(0)) {
        fn = 'newSignalingProposal'
        params = {
          title,
          link,
        }
      } else {
        const convertedAmount = amount.valueBN.toString(10)
        const stableRequestAmount = amount.stable

        fn = 'newProposal'
        params = {
          title,
          link,
          amount: convertedAmount,
          stableRequestAmount,
          beneficiary,
        }
      }

      await convictionActions[fn](params, (intent) => {
        setTransactions(intent)
        onComplete()
      })
    },
    [convictionActions, proposalData]
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
              title: 'Create proposal',
              graphicHeader: true,
              content: <AddProposal setProposalData={handleSetProposalData} />,
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
    [
      agreement,
      getTransactions,
      handleSetProposalData,
      stakingLoading,
      stakeManagement,
    ]
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

export default CreateProposalScreens
