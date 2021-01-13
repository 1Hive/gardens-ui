import React, { useMemo } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import CreateProposalRequirements from './CreateProposalRequirements'
// import useActions from '../../../hooks/useActions'
import { useAgreement } from '../../../hooks/useAgreement'
import { useAppState } from '../../../providers/AppState'

function CreateProposalScreens({ versionId }) {
  const [agreement, loading] = useAgreement()

  // TODO- for now just using the token from conviction that is going to be the same than the agreement one, we might want to change this
  const { accountBalance } = useAppState()

  const screens = useMemo(
    () => [
      {
        title: 'Submit action requirements',
        graphicHeader: false,
        content: (
          <CreateProposalRequirements
            agreement={agreement}
            accountBalance={accountBalance}
          />
        ),
      },
    ],
    [agreement, accountBalance]
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
