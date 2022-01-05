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

export function getProposalSupportStatus(
  stakes: Array<{
    proposalId: number
  }>,
  proposal: {
    id: number
  }
) {
  if (stakes.find((stake) => stake.proposalId === proposal.id)) {
    return PROPOSAL_SUPPORT_SUPPORTED
  }

  return PROPOSAL_SUPPORT_NOT_SUPPORTED
}

export function hasProposalEnded(status: string, challengeEndDate: Date | any) {
  return (
    status === PROPOSAL_STATUS_EXECUTED_STRING ||
    status === PROPOSAL_STATUS_CANCELLED_STRING ||
    status === PROPOSAL_STATUS_SETTLED_STRING ||
    (status === PROPOSAL_STATUS_CHALLENGED_STRING &&
      Date.now() > challengeEndDate)
  )
}

export function getProposalStatusData(proposal: {
  status: string
  challengeEndDate: Date | any
}) {
  switch (proposal.status) {
    case PROPOSAL_STATUS_EXECUTED_STRING:
      return {
        executed: true,
      }
    case PROPOSAL_STATUS_CANCELLED_STRING:
      return {
        cancelled: true,
      }
    case PROPOSAL_STATUS_SETTLED_STRING ||
      (PROPOSAL_STATUS_CHALLENGED_STRING &&
        Date.now() > proposal.challengeEndDate):
      return {
        settled: true,
      }
    case PROPOSAL_STATUS_CHALLENGED_STRING:
      return {
        challenged: true,
      }
    case PROPOSAL_STATUS_DISPUTED_STRING:
      return {
        disputed: true,
      }
    default:
      return {
        open: true,
      }
  }
}

export async function extractProposalId(
  ethers: any,
  txHash: any,
  proposalType: string
) {
  const receipt = await ethers.getTransactionReceipt(txHash)
  const iface = new utils.Interface([
    proposalType === 'conviction'
      ? 'event ProposalAdded(address indexed entity, uint256 indexed id, uint256 indexed actionId, string title, bytes link, uint256 amount, bool stable, address beneficiary)'
      : 'event StartVote(uint256 indexed voteId, address indexed creator, bytes context, bytes executionScript)',
  ])

  const logs = receipt.logs
  const log = iface.parseLog(logs[logs.length - 1])

  const proposalId = bigNum(
    proposalType === 'conviction' ? log.args.id : log.args.voteId
  )

  return proposalId.toNumber()
}
