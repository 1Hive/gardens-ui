import {
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_DISPUTED_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
  PROPOSAL_STATUS_SETTLED_STRING,
  PROPOSAL_SUPPORT_NOT_SUPPORTED,
  PROPOSAL_SUPPORT_SUPPORTED,
} from '../constants'

export function getProposalSupportStatus(stakes, proposal) {
  if (stakes.find(stake => stake.proposalId === proposal.id)) {
    return PROPOSAL_SUPPORT_SUPPORTED
  }

  return PROPOSAL_SUPPORT_NOT_SUPPORTED
}

export function hasProposalEnded(status, challengeEndDate) {
  return (
    status === PROPOSAL_STATUS_EXECUTED_STRING ||
    status === PROPOSAL_STATUS_CANCELLED_STRING ||
    status === PROPOSAL_STATUS_SETTLED_STRING ||
    (status === PROPOSAL_STATUS_CHALLENGED_STRING &&
      Date.now() > challengeEndDate)
  )
}

export function getProposalStatusData(proposal) {
  const statusData = {}
  if (proposal.status === PROPOSAL_STATUS_EXECUTED_STRING) {
    statusData.executed = true
  } else if (proposal.status === PROPOSAL_STATUS_CANCELLED_STRING) {
    statusData.cancelled = true
  } else if (
    proposal.status === PROPOSAL_STATUS_SETTLED_STRING ||
    (proposal.status === PROPOSAL_STATUS_CHALLENGED_STRING &&
      Date.now() > proposal.challengeEndDate)
  ) {
    statusData.settled = true
  } else if (proposal.status === PROPOSAL_STATUS_CHALLENGED_STRING) {
    statusData.challenged = true
  } else if (proposal.status === PROPOSAL_STATUS_DISPUTED_STRING) {
    statusData.disputed = true
  } else {
    statusData.open = true
  }

  return statusData
}
