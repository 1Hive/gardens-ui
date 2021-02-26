import React, { useCallback, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ChallengeRequirements from './ChallengeRequirements'
import ChallengeForm from './ChallengeForm'
import { useAppState } from '../../../providers/AppState'
import { useDisputeFees } from '../../../hooks/useDispute'
import { useAgreement } from '../../../hooks/useAgreement'
import BigNumber from '../../../lib/bigNumber'
import { toDecimals } from '../../../utils/math-utils'

const ZERO_BN = new BigNumber(toDecimals('0', 18))

function ChallengeProposalScreens({ agreementActions, proposal }) {
  const [transactions, setTransactions] = useState([])
  const [agreement, loading] = useAgreement()
  const { accountBalance } = useAppState()
  const disputeFees = useDisputeFees()

  const temporatyTrx = useRef([])

  const depositAmount = useMemo(() => {
    if (disputeFees.loading) {
      return
    }
    return proposal.collateralRequirement.challengeAmount
      .plus(new BigNumber(disputeFees.amount.toString()))
      .toString()
  }, [disputeFees, proposal])

  const getTransactions = useCallback(
    async (
      onComplete,
      actionId,
      settlementOffer,
      challengerFinishedEvidence,
      context
    ) => {
      const allowance = await agreementActions.getAllowance()
      if (allowance.lt(depositAmount)) {
        if (!allowance.eq(0)) {
          await agreementActions.approveChallengeTokenAmount(
            ZERO_BN,
            intent => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            }
          )
        }
        await agreementActions.approveChallengeTokenAmount(
          depositAmount,
          intent => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )
      }
      await agreementActions.challengeAction(
        { actionId, settlementOffer, challengerFinishedEvidence, context },
        intent => {
          const trxList = temporatyTrx.current.concat(intent)
          setTransactions(trxList)
          onComplete()
        }
      )
    },
    [agreementActions, depositAmount]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Challenge action requirements',
        content: (
          <ChallengeRequirements
            agreement={agreement}
            accountBalance={accountBalance}
            disputeFees={disputeFees}
          />
        ),
      },
      {
        title: 'Challenge action requirements',
        content: (
          <ChallengeForm
            getTransactions={getTransactions}
            onChallengeAction={agreementActions.challengeAction}
            proposal={proposal}
          />
        ),
      },
    ],
    [
      accountBalance,
      agreement,
      disputeFees,
      getTransactions,
      agreementActions,
      proposal,
    ]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={
        !disputeFees.token || loading || disputeFees.loading || !depositAmount
      }
      transactions={transactions}
      transactionTitle="Challenge proposal"
      screens={screens}
    />
  )
}

export default ChallengeProposalScreens
