import { utils } from 'ethers'

import { bigNum } from '@lib/bigNumber'

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
  if (stakes.find((stake) => stake.proposalId === proposal.id)) {
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

export async function extractProposalId(ethers, txHash, proposalType) {
  const receipt = await ethers.getTransactionReceipt(txHash)
  const iface = new utils.Interface([
    proposalType === 'conviction'
      ? 'event ProposalAdded(address indexed entity, uint256 indexed id, uint256 indexed actionId, string title, bytes link, uint256 amount, bool stable, address beneficiary)'
      : 'event StartVote(uint256 indexed voteId, address indexed creator, bytes context, bytes executionScript)',
  ])

  const logs = receipt.logs

  const log = iface.parseLog(logs[logs.length - 1])

  const proposalId =
    proposalType === 'conviction'
      ? new bigNum(log.args.id)
      : new bigNum(log.args.voteId)

  return proposalId.toNumber()
}
