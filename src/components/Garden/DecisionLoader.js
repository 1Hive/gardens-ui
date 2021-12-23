import React from 'react'

import useProposalLogic from '../../logic/proposal-logic'
import { GardenLoader } from '../Loader'
import DecisionDetail from './DecisionDetail/DecisionDetail'

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
