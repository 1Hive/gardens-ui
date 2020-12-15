import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'
import useActions from '../../../hooks/useActions'

function SignAgreementScreens({ versionId }) {
  const actions = useActions()

  console.log('ACTIons ', actions)
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async onComplete => {
      await actions.agreementActions.signAgreement({ versionId }, intent => {
        console.log('intent.transactions ', intent.transactions)
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [actions, versionId]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Sign Agreement',
        graphicHeader: true,
        content: <SignOverview getTransactions={getTransactions} />,
      },
    ],
    [getTransactions]
  )
  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Sign Agreement"
      screens={screens}
    />
  )
}

SignAgreementScreens.propTypes = {
  versionId: PropTypes.string,
}

export default SignAgreementScreens
