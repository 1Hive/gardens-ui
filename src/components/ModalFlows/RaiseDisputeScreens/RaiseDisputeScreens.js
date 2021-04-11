import React, { useState, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import RaiseDisputeRequirements from './RaiseDisputeRequirements'

import useActions from '../../../hooks/useActions'
import { useAppState } from '../../../providers/AppState'
import { useDisputeFees } from '../../../hooks/useDispute'
import { useCelesteSynced } from '../../../hooks/useCeleste'
import BigNumber from '../../../lib/bigNumber'

const ZERO_BN = new BigNumber('0')

function RaiseDisputeScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])
  const { accountBalance } = useAppState()
  const [celesteSynced, celesteSyncLoading] = useCelesteSynced()
  const disputeFees = useDisputeFees()
  const { agreementActions } = useActions()

  const temporatyTrx = useRef([])

  const disputeBN = useMemo(() => {
    if (disputeFees.loading) {
      return
    }
    return new BigNumber(disputeFees.amount.toString())
  }, [disputeFees])

  const getTransactions = useCallback(
    async onComplete => {
      const allowance = await agreementActions.getAllowance()
      if (allowance.lt(disputeBN)) {
        if (!allowance.eq(0)) {
          await agreementActions.approveChallengeTokenAmount(
            ZERO_BN,
            intent => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            }
          )
        }
        await agreementActions.approveChallengeTokenAmount(
          disputeBN.toString(),
          intent => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )
      }

      await agreementActions.disputeAction(
        { actionId: proposal.actionId, submitterFinishedEvidence: true },
        intent => {
          const trxList = temporatyTrx.current.concat(intent)
          setTransactions(trxList)
          onComplete()
        }
      )
    },
    [proposal, agreementActions, disputeBN]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Raise dispute to Celeste',
        content: (
          <RaiseDisputeRequirements
            accountBalance={accountBalance}
            celesteSynced={celesteSynced}
            disputeFees={disputeFees}
            getTransactions={getTransactions}
          />
        ),
      },
    ],
    [accountBalance, celesteSynced, disputeFees, getTransactions]
  )

  return (
    <ModalFlowBase
      loading={disputeFees.loading || celesteSyncLoading}
      screens={screens}
      transactions={transactions}
      transactionTitle="Raise to Celeste"
    />
  )
}

RaiseDisputeScreens.propTypes = {
  actionId: PropTypes.string,
}

export default RaiseDisputeScreens
