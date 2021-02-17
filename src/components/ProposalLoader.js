import React from 'react'
import ProposalDetail from '../screens/ProposalDetail'
import Loader from './Loader'
import useProposalLogic from '../logic/proposal-logic'

function ProposalLoader({ match }) {
  const {
    actions: { agreementActions, convictionActions },
    isLoading,
    permissions,
    proposal,
    requestToken,
    vaultBalance,
  } = useProposalLogic(match)

  if (!proposal || isLoading) {
    return <Loader />
  }

  return (
    <ProposalDetail
      proposal={proposal}
      actions={{ ...agreementActions, ...convictionActions }}
      permissions={permissions}
      requestToken={requestToken}
      vaultBalance={vaultBalance}
    />
  )
}

export default ProposalLoader
