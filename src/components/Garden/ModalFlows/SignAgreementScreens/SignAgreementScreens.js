import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Button } from '@1hive/1hive-ui'
import React, { useCallback, useMemo, useState } from 'react'

import SignOverview from './SignOverview'
import ModalFlowBase from '../ModalFlowBase'

import useActions from '@hooks/useActions'
import { useUserState } from '@providers/User'

function SignAgreementScreens({ versionId }) {
  const router = useRouter()
  const actions = useActions()
  const [transactions, setTransactions] = useState([])
  const { reload } = useUserState()

  const reloadUser = useCallback(() => setTimeout(reload, 4000), [reload])

  const handleCreateProposal = useCallback(() => {
    if (!router.query.create) {
      router.push(`${router.asPath}?create=true`)
    }
  }, [router])

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
    async (onComplete) => {
      await actions.agreementActions.signAgreement(
        { versionId },
        (transactions) => {
          setTransactions(transactions)
          onComplete()
        }
      )
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
      onComplete={reloadUser}
      onCompleteActions={onCompleteActions}
    />
  )
}

SignAgreementScreens.propTypes = {
  versionId: PropTypes.string,
}

export default SignAgreementScreens
