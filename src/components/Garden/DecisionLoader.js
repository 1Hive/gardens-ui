import React from 'react'
import DecisionDetail from './DecisionDetail/DecisionDetail'
import Loader from '../Loader'
import useProposalLogic from '../../logic/proposal-logic'

function DecisionLoader({ match }) {
  const {
    actions: { agreementActions, votingActions },
    proposal,
    loading,
  } = useProposalLogic(match)

  if (!proposal || loading) {
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
