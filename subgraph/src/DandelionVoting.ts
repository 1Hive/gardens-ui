import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
} from '../generated/templates/DandelionVoting/DandelionVoting'
import { 
  getCastEntity, 
  getProposalEntity, 
  populateCastDataFromEvent, 
  populateVotingDataFromContract,
  populateVotingDataFromEvent
} from './helpers'
import { STATUS_EXECUTED } from './statuses'
import { PROPOSAL_TYPE_DECISION } from './types'

export function handleStartVote(event: StartVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)

  populateVotingDataFromEvent(proposal, event)
  populateVotingDataFromContract(proposal, event.address, proposal.number)

  proposal.type = PROPOSAL_TYPE_DECISION

  proposal.save()
}

export function handleCastVote(event: CastVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)

  let cast = getCastEntity(proposal)

  populateCastDataFromEvent(cast, event)

  if (event.params.supports == true) {
    proposal.yea = proposal.yea.plus(event.params.stake)
  } else {
    proposal.nay = proposal.nay.plus(event.params.stake)
  }

  proposal.save()
  cast.save()
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  let proposal = getProposalEntity(event.address, event.params.voteId)

  proposal.status = STATUS_EXECUTED

  proposal.save()
}


