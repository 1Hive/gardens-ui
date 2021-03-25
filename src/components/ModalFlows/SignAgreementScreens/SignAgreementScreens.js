import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { Button } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'
import useActions from '../../../hooks/useActions'

function SignAgreementScreens({ versionId }) {
  const actions = useActions()
  const [transactions, setTransactions] = useState([])

  const history = useHistory()

  const handleCreateProposal = useCallback(() => {
    history.push('/home/create')
  }, [history])

  const renderOnCompleteActions = useCallback(() => {
    return (
      <Button
        label="Create proposal"
        mode="strong"
        onClick={handleCreateProposal}
        wide
      />
    )
  }, [handleCreateProposal])

  const getTransactions = useCallback(
    async onComplete => {
      await actions.agreementActions.signAgreement({ versionId }, intent => {
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [actions, versionId]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Sign Covenant',
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
      transactionTitle="Sign Covenant"
      screens={screens}
      onCompleteActions={renderOnCompleteActions}
    />
  )
}

SignAgreementScreens.propTypes = {
  versionId: PropTypes.string,
}

export default SignAgreementScreens
