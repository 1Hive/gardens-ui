import React, { useMemo } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import CreateProposalRequirements from './CreateProposalRequirements'
// import useActions from '../../../hooks/useActions'
import { useAgreement } from '../../../hooks/useAgreement'

function CreateProposalScreens({ versionId }) {
  //   const actions = useActions()
  //   const [transactions, setTransactions] = useState([])

  //   const getTransactions = useCallback(
  //     async onComplete => {
  //       await actions.agreementActions.signAgreement({ versionId }, intent => {
  //         setTransactions(intent.transactions)
  //         onComplete()
  //       })
  //     },
  //     [actions, versionId]
  //   )

  const [agreement, loading] = useAgreement()

  const screens = useMemo(
    () => [
      {
        title: 'Submit action requirements',
        graphicHeader: false,
        content: <CreateProposalRequirements agreement={agreement} />,
      },
    ],
    [agreement]
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
