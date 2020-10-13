import React from 'react'

import { ConvictionBar } from '../ConvictionVisuals'
import { ProposalTypes } from '../../types'

import { useAppState } from '../../providers/AppState'

function ProposalSupport({ proposal }) {
  const { requestToken } = useAppState()

  return (
    <div>
      {proposal.type !== ProposalTypes.Decision ? (
        <ProposalInfo proposal={proposal} requestToken={requestToken} />
      ) : (
        <div>Decision support</div> // TODO: Add current votes
      )}
    </div>
  )
}

const ProposalInfo = ({ proposal, requestToken }) => {
  return (
    <div>
      <ConvictionBar
        proposal={proposal}
        withThreshold={Boolean(requestToken)}
      />
    </div>
  )
}

export default ProposalSupport
