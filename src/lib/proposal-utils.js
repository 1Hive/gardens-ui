import {
  PROPOSAL_STATUS_ACCEPTED,
  PROPOSAL_STATUS_CANCELLED,
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
  PROPOSAL_STATUS_NOT_SUPPORTED,
  PROPOSAL_STATUS_OPEN,
  PROPOSAL_STATUS_SUPPORTED,
  PROPOSAL_TYPE_FUNDING,
  PROPOSAL_TYPE_SIGNALING,
} from '../constants'

export function getProposalSupportStatus(stakes, proposal) {
  if (stakes.find(stake => stake.proposalId === proposal.id)) {
    return PROPOSAL_STATUS_SUPPORTED
  }

  return PROPOSAL_STATUS_NOT_SUPPORTED
}

export function getProposalExecutionStatus({ status }) {
  if (status === PROPOSAL_STATUS_EXECUTED_STRING) {
    return PROPOSAL_STATUS_ACCEPTED
  }
  if (status === PROPOSAL_STATUS_ACTIVE_STRING) {
    return PROPOSAL_STATUS_OPEN
  }
  return PROPOSAL_STATUS_CANCELLED
}

export function getProposalType({ requestedAmount }) {
  if (requestedAmount.eq(0)) {
    return PROPOSAL_TYPE_SIGNALING
  }
  return PROPOSAL_TYPE_FUNDING
}
