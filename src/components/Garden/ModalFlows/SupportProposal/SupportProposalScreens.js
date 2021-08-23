import React, { useMemo, useState, useCallback } from 'react'
import { Button } from '@1hive/1hive-ui'
import { useHistory } from 'react-router'
import { buildGardenPath } from '@utils/routing-utils'
import ModalFlowBase from '../ModalFlowBase'
import ChangeSupport from './ChangeSupport'
import SupportProposal from './SupportProposal'

import useActions from '@hooks/useActions'

function SupportProposalScreens({ proposal, mode }) {
  const history = useHistory()
  const [transactions, setTransactions] = useState([])
  const { convictionActions } = useActions()

  const { id: proposalId } = proposal

  const handleViewProposals = useCallback(() => {
    const path = '/profile'
    history.push(path)
  }, [history])

  const handleViewHome = useCallback(() => {
    const path = buildGardenPath(history.location, 'home')
    history.push(path)
  }, [history])

  const renderOnCompleteActions = useCallback(() => {
    if (mode === 'support' ? 'Support this proposal' : 'Change support') {
      return (
        <div
          css={`
            text-align: center;
          `}
        >
          <Button
            label="Supported proposals"
            mode="strong"
            onClick={handleViewProposals}
            wide
            css={`
              width: 40%;
              display: inline;
              margin-right: 0.5rem;
            `}
          />
          <Button
            label="Home"
            mode="strong"
            onClick={handleViewHome}
            wide
            css={`
              width: 40%;
              display: inline;
              margin-left: 0.5rem;
            `}
          />
        </div>
      )
    }
    return null
  }, [handleViewHome, handleViewProposals, mode])

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
