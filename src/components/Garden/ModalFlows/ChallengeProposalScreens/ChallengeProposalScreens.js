import React, { useCallback, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ChallengeRequirements from './ChallengeRequirements'
import ChallengeForm from './ChallengeForm'
import { useGardenState } from '@providers/GardenState'
import { useDisputeFees } from '@hooks/useDispute'
import { useAgreement } from '@hooks/useAgreement'
import BigNumber from '@lib/bigNumber'
import { toDecimals } from '@utils/math-utils'

const ZERO_BN = new BigNumber(toDecimals('0', 18))

function ChallengeProposalScreens({ agreementActions, proposal }) {
  const [transactions, setTransactions] = useState([])
  const [agreement, loading] = useAgreement()
  const { token } = useGardenState()
  const disputeFees = useDisputeFees()

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
    async (
      onComplete,
      actionId,
      settlementOffer,
      challengerFinishedEvidence,
      context
    ) => {
      const collateralToken = proposal.collateralRequirement.tokenId
      const collateralAmount = proposal.collateralRequirement.challengeAmount

      await approveTokenAmount(collateralToken, collateralAmount)
      await approveTokenAmount(disputeFees.token, disputeFees.amount) // TODO: Check if colateralToken and disputeFees.token are the saem then bundle both txs

      await agreementActions.challengeAction(
        { actionId, settlementOffer, challengerFinishedEvidence, context },
        intent => {
          const trxList = temporatyTrx.current.concat(intent)
          setTransactions(trxList)
          onComplete()
        }
      )
    },
    [
      agreementActions,
      approveTokenAmount,
      disputeFees,
      proposal.collateralRequirement,
    ]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Challenge action requirements',
        content: (
          <ChallengeRequirements
            agreement={agreement}
            accountBalance={token.accountBalance}
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
      agreement,
      agreementActions,
      disputeFees,
      getTransactions,
      proposal,
      token.accountBalance,
    ]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={loading || disputeFees.loading}
      transactions={transactions}
      transactionTitle="Challenge proposal"
      screens={screens}
    />
  )
}

export default ChallengeProposalScreens
