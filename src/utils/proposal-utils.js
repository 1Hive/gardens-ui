import {
  PROPOSAL_SUPPORT_NOT_SUPPORTED,
  PROPOSAL_SUPPORT_SUPPORTED,
} from '../constants'

export function getProposalSupportStatus(stakes, proposal) {
  if (stakes.find(stake => stake.proposalId === proposal.id)) {
    return PROPOSAL_SUPPORT_SUPPORTED
  }

  return PROPOSAL_SUPPORT_NOT_SUPPORTED
}
