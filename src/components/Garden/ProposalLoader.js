import React from 'react'

import { useProposalWithThreshold } from '@hooks/useProposals'

import { ProposalTypes } from '@/types'

import useProposalLogic from '../../logic/proposal-logic'
import { GardenLoader } from '../Loader'
import ProposalDetail from './ProposalDetail/ProposalDetail'

function ProposalLoader({ match }) {
  const {
    actions: { agreementActions, convictionActions },
    commonPool,
    loading,
    permissions,
    proposal,
    requestToken,
    stableToken,
  } = useProposalLogic(match)

  if (!proposal || loading) {
    return <GardenLoader />
  }

  return proposal.type === ProposalTypes.Proposal ? (
    <WithThreshold
      proposal={proposal}
      actions={{ ...agreementActions, ...convictionActions }}
      permissions={permissions}
      requestToken={requestToken}
      stableToken={stableToken}
      commonPool={commonPool}
    />
  ) : (
    <ProposalDetail
      proposal={proposal}
      actions={{ ...agreementActions, ...convictionActions }}
      permissions={permissions}
      requestToken={requestToken}
      stableToken={stableToken}
      commonPool={commonPool}
    />
  )
}

function WithThreshold({ proposal, ...props }) {
  const [proposalWithThreshold, loading] = useProposalWithThreshold(proposal)

  if (loading) {
    return <GardenLoader />
  }

  return <ProposalDetail proposal={proposalWithThreshold} {...props} />
}

export default ProposalLoader
