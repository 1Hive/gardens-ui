import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import AddProposal from './AddProposal'
import CreateProposalRequirements from './CreateProposalRequirements'
import { useAgreement } from '../../../hooks/useAgreement'
import { useWallet } from '../../../providers/Wallet'
import useActions from '../../../hooks/useActions'
import { useStakingState } from '../../../providers/Staking'

function CreateProposalScreens() {
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

  const handleSetProposalData = useCallback(data => {
    proposalData.current = data
  }, [])

  const getTransactions = useCallback(
    async onComplete => {
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

      await convictionActions[fn](params, intent => {
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
              title: 'Submit proposal requirements',
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
      transactionTitle="Create transaction"
      screens={screens}
    />
  )
}

export default CreateProposalScreens
