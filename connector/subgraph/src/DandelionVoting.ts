import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
} from '../generated/templates/DandelionVoting/DandelionVoting'
import { 
  createSupporter,
  getCastEntity, 
  getProposalEntity, 
  populateCastDataFromEvent, 
  populateVotingDataFromContract,
  populateVotingDataFromEvent
} from './helpers'
import { STATUS_EXECUTED, STATUS_EXECUTED_NUM } from './statuses'
import { PROPOSAL_TYPE_DECISION, PROPOSAL_TYPE_DECISION_NUM } from './types'

export function handleStartVote(event: StartVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)

  populateVotingDataFromEvent(proposal, event)
  populateVotingDataFromContract(proposal, event.address, proposal.number)

  proposal.type = PROPOSAL_TYPE_DECISION
  proposal.typeInt = PROPOSAL_TYPE_DECISION_NUM

  proposal.save()
}

export function handleCastVote(event: CastVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)
  createSupporter(event.params.voter)

  let cast = getCastEntity(proposal, event.params.voter)
  populateCastDataFromEvent(cast, event)

  if (event.params.supports == true) {
    proposal.yea = proposal.yea.plus(event.params.stake)
  } else {
    proposal.nay = proposal.nay.plus(event.params.stake)
  }
  proposal.weight = proposal.yea.minus(proposal.nay)

  proposal.save()
  cast.save()
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)

  proposal.status = STATUS_EXECUTED
  proposal.statusInt = STATUS_EXECUTED_NUM

  proposal.save()
}


