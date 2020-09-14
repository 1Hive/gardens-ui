import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
  DandelionVoting as DandelionVotingContract
} from '../generated/templates/DandelionVoting/DandelionVoting'
import {
  Vote as VoteEntity,
  Cast as CastEntity
} from '../generated/schema'
import { _getCastEntityId, _getVoteEntityId, _populateCastDataFromEvent, _populateVoteDataFromContract, _populateVoteDataFromEvent } from './helpers'

export function handleStartVote(event: StartVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  _populateVoteDataFromEvent(vote, event)
  _populateVoteDataFromContract(vote, event.address, vote.voteNum)

  vote.save()
}

export function handleCastVote(event: CastVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  let numCasts = vote.casts.length

  let castId = _getCastEntityId(vote, numCasts)
  let cast = new CastEntity(castId)

  _populateCastDataFromEvent(cast, event)
  cast.voteNum = vote.voteNum
  cast.voteId = vote.id

  let casts = vote.casts
  casts.push(castId)
  vote.casts = casts

  if (event.params.supports == true) {
    vote.yea = vote.yea.plus(event.params.stake)
  } else {
    vote.nay = vote.nay.plus(event.params.stake)
  }

  vote.save()
  cast.save()
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  let vote = _getVoteEntity(event.address, event.params.voteId)

  vote.executed = true

  vote.save()
}

function _getVoteEntity(appAddress: Address, voteNum: BigInt): VoteEntity {
  let voteEntityId = _getVoteEntityId(appAddress, voteNum)

  let vote = VoteEntity.load(voteEntityId)
  if (!vote) {
    vote = new VoteEntity(voteEntityId)

    vote.voteNum = voteNum
    vote.executed = false
    vote.casts = []
  }

  return vote!
}

