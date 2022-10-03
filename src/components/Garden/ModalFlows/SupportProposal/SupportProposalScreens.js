import React, { useMemo, useState, useCallback, useRef } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ChangeSupport from './ChangeSupport'
import SupportProposal from './SupportProposal'

import { useConnectedGarden } from '@/providers/ConnectedGarden'
import useActions from '@hooks/useActions'
import { ProposalTypes } from '@/types'

function SupportProposalScreens({ proposal, mode }) {
  const [transactions, setTransactions] = useState([])
  const { convictionActions, fluidProposalsActions } = useActions()

  const temporatyTrx = useRef([])

  const { id: proposalId, type } = proposal

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      if (type == ProposalTypes.Stream && proposal.canActivate) {
        await fluidProposalsActions.activateProposal(
          { proposalId },
          (intent) => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )
      }

      await convictionActions.stakeToProposal(
        { proposalId, amount },
        (intent) => {
          temporatyTrx.current = temporatyTrx.current.concat(intent)
        }
      )

      setTransactions(temporatyTrx.current)
      onComplete()
    },
    [convictionActions, fluidProposalsActions, proposalId, type]
  )

  const getChangeSupportTransactions = useCallback(
    async (onComplete, changeMode, amount) => {
      if (changeMode === 'stake') {
        if (type == ProposalTypes.Stream && proposal.canActivate) {
          await fluidProposalsActions.activateProposal(
            { proposalId },
            (intent) => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            }
          )
        }

        await convictionActions.stakeToProposal(
          { proposalId, amount },
          (intent) => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )

        setTransactions(temporatyTrx.current)
        onComplete()
      }
      if (changeMode === 'withdraw') {
        await convictionActions.withdrawFromProposal(
          { proposalId, amount },
          (intent) => {
            setTransactions(intent)
            onComplete()
          }
        )
      }
    },
    [convictionActions, fluidProposalsActions, proposalId, type]
  )

  const screens = useMemo(() => {
    if (mode === 'support') {
      return [
        {
          title: 'Support this proposal',
          graphicHeader: false,
          content: <SupportProposal getTransactions={getTransactions} />,
        },
      ]
    }
    if (mode === 'update') {
      return [
        {
          title: 'Change support',
          graphicHeader: false,
          content: (
            <ChangeSupport
              getTransactions={getChangeSupportTransactions}
              proposal={proposal}
            />
          ),
        },
      ]
    }
  }, [getTransactions, getChangeSupportTransactions, mode, proposal])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle={
        mode === 'support' ? 'Support this proposal' : 'Change support'
      }
      screens={screens}
    />
  )
}

export default SupportProposalScreens
