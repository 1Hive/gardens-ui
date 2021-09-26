import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { Button } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'

import { buildGardenPath } from '@utils/routing-utils'

function SignAgreementScreens({ versionId, agreementActions }) {
  const [transactions, setTransactions] = useState([])

  const history = useHistory()

  const handleCreateProposal = useCallback(() => {
    const path = buildGardenPath(history.location, 'create')
    history.push(path)
  }, [history])

  const onCompleteActions = useMemo(() => {
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
      await agreementActions.signAgreement({ versionId }, intent => {
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [agreementActions, versionId]
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
      onCompleteActions={onCompleteActions}
    />
  )
}

SignAgreementScreens.propTypes = {
  versionId: PropTypes.string,
}

export default SignAgreementScreens
