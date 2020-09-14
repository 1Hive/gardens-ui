import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  DandelionVoting as DandelionVotingContract
} from '../../generated/templates/DandelionVoting/DandelionVoting'
import {
  Vote as VoteEntity,
  Cast as CastEntity
} from '../../generated/schema'

export function _getCastEntityId(vote: VoteEntity, numCast: number): string {
  return vote.id + '-castNum:' + numCast.toString()
}

export function _getVoteEntityId(appAddress: Address, voteNum: BigInt): string {
  return 'appAddress:' + appAddress.toHexString() + '-voteId:' + voteNum.toHexString()
}

export function _populateVoteDataFromContract(vote: VoteEntity, appAddress: Address, voteNum: BigInt): void {
  let dandelionVoting = DandelionVotingContract.bind(appAddress)

  let voteData = dandelionVoting.getVote(voteNum)

  vote.executed = voteData.value1
  vote.startBlock = voteData.value2
  vote.executionBlock = voteData.value3
  vote.snapshotBlock = voteData.value4
  vote.votingPower = voteData.value5
  vote.supportRequiredPct = voteData.value6
  vote.minAcceptQuorum = voteData.value7
  vote.yea = voteData.value8
  vote.nay = voteData.value9
  vote.script = voteData.value10
  vote.orgAddress = dandelionVoting.kernel()
  vote.appAddress = appAddress
}

export function _populateVoteDataFromEvent(vote: VoteEntity, event: StartVoteEvent): void {
  vote.creator = event.params.creator
  vote.metadata = event.params.metadata
}

export function _populateCastDataFromEvent(cast: CastEntity, event: CastVoteEvent): void {
  cast.voter = event.params.voter
  cast.supports = event.params.supports
  cast.voterStake = event.params.stake
}