import React from 'react'
import DecisionDetail from './DecisionDetail/DecisionDetail'
import { GardenLoader } from '../Loader'
import useProposalLogic from '../../logic/proposal-logic'

function DecisionLoader({ match }) {
  const {
    actions: { agreementActions, votingActions },
    proposal,
    loading,
  } = useProposalLogic(match)

  if (!proposal || loading) {
    return <GardenLoader />
  }

  return (
    <DecisionDetail
      proposal={proposal}
      actions={{ ...agreementActions, ...votingActions }}
    />
  )
}

export default DecisionLoader
