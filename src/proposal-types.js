import {
  PROPOSAL_STATUS_ACTIVE as PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_EXECUTED as PROPOSAL_STATUS_EXECUTED_STRING,
} from './constants'

export const PROPOSAL_STATUS_OPEN = 1
export const PROPOSAL_STATUS_ACCEPTED = 2
export const PROPOSAL_STATUS_CANCELLED = 3

export const PROPOSAL_STATUS_SUPPORTED = 1
export const PROPOSAL_STATUS_NOT_SUPPORTED = 2

export const PROPOSAL_TYPE_FUNDING = 1
export const PROPOSAL_TYPE_SIGNALING = 2

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
