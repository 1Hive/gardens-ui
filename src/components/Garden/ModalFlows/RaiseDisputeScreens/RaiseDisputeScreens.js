import React, { useState, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import RaiseDisputeRequirements from './RaiseDisputeRequirements'

import useActions from '@hooks/useActions'
import { useCelesteSynced } from '@hooks/useCeleste'
import { useDisputeFees } from '@hooks/useDispute'
import BigNumber from '@lib/bigNumber'

const ZERO_BN = new BigNumber('0')

function RaiseDisputeScreens({ proposal }) {
  const [transactions, setTransactions] = useState([])
  const [celesteSynced, celesteSyncLoading] = useCelesteSynced()
  const disputeFees = useDisputeFees()
  const { agreementActions } = useActions()

  const temporatyTrx = useRef([])

  const approveTokenAmount = useCallback(
    async (tokenAddress, amount) => {
      const tokenAllowance = await agreementActions.getAllowance(tokenAddress)
      if (tokenAllowance.lt(amount)) {
        if (!tokenAllowance.eq(0)) {
          await agreementActions.approveTokenAmount(
            tokenAddress,
            ZERO_BN,
            intent => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            }
          )
        }
        await agreementActions.approveTokenAmount(
          tokenAddress,
          amount,
          intent => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )
      }
    },
    [agreementActions]
  )

  const getTransactions = useCallback(
    async onComplete => {
      await approveTokenAmount(disputeFees.token, disputeFees.amount)

      await agreementActions.disputeAction(
        { actionId: proposal.actionId, submitterFinishedEvidence: true },
        intent => {
          const trxList = temporatyTrx.current.concat(intent)
          setTransactions(trxList)
          onComplete()
        }
      )
    },
    [agreementActions, approveTokenAmount, disputeFees, proposal]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Raise dispute to Celeste',
        content: (
          <RaiseDisputeRequirements
            celesteSynced={celesteSynced}
            disputeFees={disputeFees}
            getTransactions={getTransactions}
          />
        ),
      },
    ],
    [celesteSynced, disputeFees, getTransactions]
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
