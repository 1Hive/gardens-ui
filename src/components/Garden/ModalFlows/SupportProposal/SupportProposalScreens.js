import React, { useMemo, useState, useCallback } from 'react'
// import { useHistory } from 'react-router'
import { Button } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
// import { MultiModalProvider, useMultiModal } from '../../../MultiModal/MultiModalProvider'
import ChangeSupport from './ChangeSupport'
import SupportProposal from './SupportProposal'

// import { buildGardenPath } from '@utils/routing-utils'
import useActions from '@hooks/useActions'

function SupportProposalScreens({ proposal, mode }) {
  const [transactions, setTransactions] = useState([])
  const { convictionActions } = useActions()

  const { id: proposalId } = proposal

  const refresh = () => {
    window.location.reload()
  }

  const renderOnCompleteActions = useCallback(() => {
    if (mode === 'support' ? 'Support this proposal' : 'Change support') {
      return (
        <Button label="View proposal" mode="strong" onClick={refresh} wide />
      )
    }
    return null
  }, [mode])

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      await convictionActions.stakeToProposal(
        { proposalId, amount },
        intent => {
          setTransactions(intent)
          onComplete()
        }
      )
    },
    [convictionActions, proposalId]
  )

  const getChangeSupportTransactions = useCallback(
    async (onComplete, changeMode, amount) => {
      if (changeMode === 'stake') {
        await convictionActions.stakeToProposal(
          { proposalId, amount },
          intent => {
            setTransactions(intent)
            onComplete()
          }
        )
      }
      if (changeMode === 'withdraw') {
        await convictionActions.withdrawFromProposal(
          { proposalId, amount },
          intent => {
            setTransactions(intent)
            onComplete()
          }
        )
      }
    },
    [convictionActions, proposalId]
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
      onCompleteActions={renderOnCompleteActions}
    />
  )
}

export default SupportProposalScreens
