import { Address, BigInt } from '@graphprotocol/graph-ts'
import { CastVote as CastVoteEvent } from '../../generated/templates/DisputableVoting/DisputableVoting'
import {
  Cast as CastVoteEntity,
  Proposal as ProposalEntity,
  VotingConfig as VotingConfigEntity,
} from '../../generated/schema'
import { getProposalEntityId } from '.'
import {
  STATUS_ACTIVE,
  STATUS_ACTIVE_NUM,
  STATUS_CANCELLED,
  STATUS_CANCELLED_NUM,
  STATUS_CHALLENGED,
  STATUS_CHALLENGED_NUM,
  STATUS_EXECUTED,
  STATUS_EXECUTED_NUM,
  STATUS_UNKNOWN,
  STATUS_UNKNOWN_NUM,
} from '../statuses'

/// ///  Voting config entity //////
export function getVotingConfigEntityId(
  appAddress: Address,
  settingId: BigInt
): string {
  return appAddress.toHexString() + '-setting-' + settingId.toString()
}

export function getVotingConfigEntity(
  appAddress: Address,
  settingId: BigInt
): VotingConfigEntity | null {
  const configEntityId = getVotingConfigEntityId(appAddress, settingId)

  let config = VotingConfigEntity.load(configEntityId)

  if (!config) {
    config = new VotingConfigEntity(configEntityId)
  }

  return config
}

/// /// Cast Entity //////
function getCastEntityId(
  proposal: ProposalEntity | null,
  voter: Address
): string {
  return proposal.id + '-entity:' + voter.toHexString()
}

export function getCastEntity(
  proposal: ProposalEntity | null,
  voter: Address
): CastVoteEntity | null {
  const castId = getCastEntityId(proposal, voter)

  const cast = new CastVoteEntity(castId)
  cast.proposal = proposal.id

  return cast
}

export function populateCastDataFromEvent(
  cast: CastVoteEntity | null,
  event: CastVoteEvent
): void {
  cast.entity = event.params.voter.toHexString()
  cast.supports = event.params.supports
  cast.stake = event.params.stake
  cast.createdAt = event.block.timestamp
}

export function castVoteStatus(state: i32): string {
  switch (state) {
    case 0:
      return STATUS_ACTIVE
    case 1:
      return STATUS_CHALLENGED
    case 2:
      return STATUS_CANCELLED
    case 3:
      return STATUS_EXECUTED
    default:
      return STATUS_UNKNOWN
  }
}

export function castVoteStatusNum(state: i32): i32 {
  switch (state) {
    case 0:
      return STATUS_ACTIVE_NUM
    case 1:
      return STATUS_CHALLENGED_NUM
    case 2:
      return STATUS_CANCELLED_NUM
    case 3:
      return STATUS_EXECUTED_NUM
    default:
      return STATUS_UNKNOWN_NUM
  }
}

export function castVoterState(state: i32): string {
  switch (state) {
    case 0:
      return 'Absent'
    case 1:
      return 'Yea'
    case 2:
      return 'Nay'
    default:
      return 'Unknown'
  }
}

function buildCastVoteId(
  voting: Address,
  voteId: BigInt,
  voter: Address
): string {
  return getProposalEntityId(voting, voteId) + '-cast-' + voter.toHexString()
}

export function loadOrCreateCastVote(
  votingAddress: Address,
  voteId: BigInt,
  voterAddress: Address
): CastVoteEntity {
  const castVoteId = buildCastVoteId(votingAddress, voteId, voterAddress)
  let castVote = CastVoteEntity.load(castVoteId)
  if (castVote === null) {
    castVote = new CastVoteEntity(castVoteId)
    castVote.proposal = getProposalEntityId(votingAddress, voteId)
  }
  return castVote!
}

function hasReachedValuePct(
  value: BigInt,
  total: BigInt,
  pct: BigInt,
  pctBase: BigInt
): boolean {
  return (
    total.notEqual(BigInt.fromI32(0)) &&
    value
      .times(pctBase)
      .div(total)
      .gt(pct)
  )
}

export function isAccepted(
  yeas: BigInt,
  nays: BigInt,
  totalPower: BigInt,
  settingId: string,
  pctBase: BigInt
): boolean {
  const setting = VotingConfigEntity.load(settingId)
  return (
    hasReachedValuePct(
      yeas,
      yeas.plus(nays),
      setting.supportRequiredPct,
      pctBase
    ) &&
    hasReachedValuePct(
      yeas,
      totalPower,
      setting.minimumAcceptanceQuorumPct,
      pctBase
    )
  )
}
