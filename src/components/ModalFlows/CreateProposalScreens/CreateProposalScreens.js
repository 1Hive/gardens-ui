import React, { useCallback, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import AddProposal from './AddProposal'
import CreateProposalRequirements from './CreateProposalRequirements'
// import useActions from '../../../hooks/useActions'
import { useAgreement } from '../../../hooks/useAgreement'
import useActions from '../../../hooks/useActions'
import { useStakingState } from '../../../providers/Staking'
import { ZERO_ADDR } from '../../../constants'

function CreateProposalScreens() {
  const [agreement, loading] = useAgreement()
  const { stakeManagement } = useStakingState()
  const [proposalData, setProposalData] = useState()
  const [transactions, setTransactions] = useState([])
  const { convictionActions } = useActions()

  const getTransactions = useCallback(
    async onComplete => {
      const { amount, beneficiary, link, title } = proposalData
      const convertedAmount = amount.valueBN.toString(10)

      await convictionActions.newProposal(
        {
          title,
          link,
          amount: convertedAmount,
          stableRequestAmount: false,
          beneficiary: beneficiary || ZERO_ADDR,
        },
        intent => {
          setTransactions(intent.transactions)
          onComplete()
        }
      )
    },
    [convictionActions, proposalData]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Submit action requirements',
        graphicHeader: false,
        content: (
          <CreateProposalRequirements
            agreement={agreement}
            availableStaked={stakeManagement.staking.available}
          />
        ),
      },
      {
        title: 'Create post',
        graphicHeader: true,
        content: <AddProposal setProposalData={setProposalData} />,
      },
      {
        title: 'Action Deposit',
        graphicHeader: false,
        content: (
          <ActionFees
            agreement={agreement}
            onCreateTransaction={getTransactions}
          />
        ),
      },
    ],
    [agreement, getTransactions, stakeManagement.staking.available]
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
