import React from 'react'
import DecisionDetail from '../screens/DecisionDetail'
import Loader from './Loader'
import useProposalLogic from '../logic/proposal-logic'

function DecisionLoader({ match }) {
  const {
    actions: { agreementActions, votingActions },
    proposal,
    isLoading,
  } = useProposalLogic(match)

  if (!proposal || isLoading) {
    return <Loader />
  }

  return (
    <DecisionDetail
      proposal={proposal}
      actions={{ ...agreementActions, ...votingActions }}
    />
  )
}

export default DecisionLoader
