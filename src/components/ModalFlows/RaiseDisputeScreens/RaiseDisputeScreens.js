import React, { useState, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import RaiseDisputeRequirements from './RaiseDisputeRequirements'
import useActions from '../../../hooks/useActions'
import { useDisputeFees } from '../../../hooks/useDispute'
import { useAppState } from '../../../providers/AppState'
import BigNumber from '../../../lib/bigNumber'
import { toDecimals } from '../../../utils/math-utils'

const ZERO_BN = new BigNumber(toDecimals('0', 18))

function RaiseDisputeScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])
  const { accountBalance } = useAppState()
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
        { actionId: proposal.actionId, finishedEvidence: true },
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
            disputeFees={disputeFees}
            getTransactions={getTransactions}
          />
        ),
      },
    ],
    [accountBalance, disputeFees, getTransactions]
  )

  return (
    <ModalFlowBase
      loading={disputeFees.loading}
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
