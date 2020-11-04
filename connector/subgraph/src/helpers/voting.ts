import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  CastVote as CastVoteEvent,
  DandelionVoting as DandelionVotingContract,
  StartVote as StartVoteEvent,
} from '../../generated/templates/DandelionVoting/DandelionVoting'
import {
  Cast as CastEntity,
  Proposal as ProposalEntity,
  VotingConfig as VotingConfigEntity,
} from '../../generated/schema'
import { loadOrCreateConfig, loadTokenData } from '.'
import {
  STATUS_ACTIVE,
  STATUS_ACTIVE_NUM,
  STATUS_EXECUTED,
  STATUS_EXECUTED_NUM,
} from '../statuses'

/// ///  Voting config entity //////
function getVotingConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getVotingConfigEntity(
  appAddress: Address
): VotingConfigEntity | null {
  const configEntityId = getVotingConfigEntityId(appAddress)

  let config = VotingConfigEntity.load(configEntityId)

  if (!config) {
    config = new VotingConfigEntity(configEntityId)
  }

  return config
}

export function loadVotingConfig(
  orgAddress: Address,
  appAddress: Address
): void {
  // General org config
  const config = loadOrCreateConfig(orgAddress)

  // Dandelion Voting config
  const votingConfig = getVotingConfigEntity(appAddress)
  const dandelionVoting = DandelionVotingContract.bind(appAddress)
  // Load token data
  const token = dandelionVoting.token()
  const tokenId = loadTokenData(token)
  if (tokenId) {
    votingConfig.token = token.toHexString()
  }

  // Load conviction params
  votingConfig.supportRequiredPct = dandelionVoting.supportRequiredPct()
  votingConfig.minAcceptQuorumPct = dandelionVoting.minAcceptQuorumPct()
  votingConfig.durationBlocks = dandelionVoting.durationBlocks()
  votingConfig.bufferBlocks = dandelionVoting.bufferBlocks()
  votingConfig.executionDelayBlocks = dandelionVoting.executionDelayBlocks()

  votingConfig.save()

  config.voting = votingConfig.id
  config.save()
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
): CastEntity | null {
  const castId = getCastEntityId(proposal, voter)

  const cast = new CastEntity(castId)
  cast.proposal = proposal.id

  return cast
}

export function populateCastDataFromEvent(
  cast: CastEntity | null,
  event: CastVoteEvent
): void {
  cast.entity = event.params.voter.toHexString()
  cast.supports = event.params.supports
  cast.stake = event.params.stake
  cast.createdAt = event.block.timestamp
}

/// /// Proposal Entity //////
export function populateVotingDataFromEvent(
  proposal: ProposalEntity | null,
  event: StartVoteEvent
): void {
  proposal.creator = event.params.creator
  proposal.metadata = event.params.metadata
  proposal.createdAt = event.block.timestamp
}

export function populateVotingDataFromContract(
  proposal: ProposalEntity | null,
  appAddress: Address,
  voteNum: BigInt
): void {
  const dandelionVoting = DandelionVotingContract.bind(appAddress)
  const voteData = dandelionVoting.getVote(voteNum)

  proposal.status = voteData.value1 ? STATUS_EXECUTED : STATUS_ACTIVE
  proposal.statusInt = voteData.value1 ? STATUS_EXECUTED_NUM : STATUS_ACTIVE_NUM
  proposal.startBlock = voteData.value2
  proposal.executionBlock = voteData.value3
  proposal.snapshotBlock = voteData.value4
  proposal.supportRequiredPct = voteData.value5
  proposal.minAcceptQuorum = voteData.value6
  proposal.yea = voteData.value8
  proposal.nay = voteData.value9
  proposal.votingPower = voteData.value7
  proposal.script = voteData.value10
}
