import React, { useMemo } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import CreateProposalRequirements from './CreateProposalRequirements'
// import useActions from '../../../hooks/useActions'
import { useAgreement } from '../../../hooks/useAgreement'
import { useStakingState } from '../../../providers/Staking'

function CreateProposalScreens({ versionId }) {
  const [agreement, loading] = useAgreement()
  const { stakeManagement } = useStakingState()

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
    ],
    [agreement, stakeManagement.staking.available]
  )
  return (
    <ModalFlowBase
      frontLoad
      loading={loading}
      //   transactions={transactions}
      transactionTitle="Create transaction"
      screens={screens}
    />
  )
}

export default CreateProposalScreens
