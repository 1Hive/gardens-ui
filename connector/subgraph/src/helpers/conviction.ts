import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ConvictionConfig as ConvictionConfigEntity,
  Proposal as ProposalEntity,
  Stake as StakeEntity,
  StakeHistory as StakeHistoryEntity,
} from '../../generated/schema'
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
} from '../../generated/templates/ConvictionVoting/ConvictionVoting'
import { loadOrCreateConfig, loadTokenData } from '.'

/// /// Conviction config entity //////
function getConvictionConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getConvictionConfigEntity(
  appAddress: Address
): ConvictionConfigEntity | null {
  const configEntityId = getConvictionConfigEntityId(appAddress)

  let config = ConvictionConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConvictionConfigEntity(configEntityId)
  }

  return config
}

export function loadConvictionConfig(
  orgAddress: Address,
  appAddress: Address
): void {
  // General org config
  const config = loadOrCreateConfig(orgAddress)

  // Conviction voting config
  const convictionConfig = getConvictionConfigEntity(appAddress)
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  // Load tokens data
  const stakeToken = convictionVoting.stakeToken()
  const stableToken = convictionVoting.stableToken()
  const stakeTokenId = loadTokenData(stakeToken)
  if (stakeTokenId) {
    convictionConfig.stakeToken = stakeToken.toHexString()
  }
  const stableTokenId = loadTokenData(stableToken)
  if (stableTokenId) {
    convictionConfig.stableToken = stableToken.toHexString()
  }

  const requestToken = convictionVoting.requestToken()
  // App could be instantiated without a vault
  const requestTokenId = loadTokenData(requestToken)
  if (requestTokenId) {
    convictionConfig.requestToken = requestToken.toHexString()
  }

  // Load conviction params
  convictionConfig.decay = convictionVoting.decay()
  convictionConfig.weight = convictionVoting.weight()
  convictionConfig.maxRatio = convictionVoting.maxRatio()
  convictionConfig.pctBase = convictionVoting.D()
  convictionConfig.totalStaked = convictionVoting.totalStaked()
  convictionConfig.maxStakedProposals = convictionVoting
    .MAX_STAKED_PROPOSALS()
    .toI32()
  convictionConfig.minThresholdStakePercentage = convictionVoting.minThresholdStakePercentage()
  convictionConfig.contractPaused = false
  convictionConfig.stableTokenOracle = convictionVoting.stableTokenOracle()

  convictionConfig.save()

  config.conviction = convictionConfig.id
  config.save()
}

/// /// Stake entity //////
export function getStakeEntityId(proposalId: string, entity: Bytes): string {
  return proposalId + '-entity:' + entity.toHexString()
}

export function getStakeEntity(
  proposal: ProposalEntity | null,
  entity: Bytes
): StakeEntity | null {
  const stakeId = getStakeEntityId(proposal.id, entity)

  let stake = StakeEntity.load(stakeId)
  if (!stake) {
    stake = new StakeEntity(stakeId)
    stake.entity = entity.toHexString()
    stake.proposal = proposal.id
  }

  return stake
}

/// /// Stake History entity //////
export function getStakeHistoryEntityId(
  proposalId: string,
  entity: Bytes,
  timestamp: BigInt
): string {
  return (
    proposalId +
    '-entity:' +
    entity.toHexString() +
    '-time:' +
    timestamp.toString()
  )
}

export function getStakeHistoryEntity(
  proposal: ProposalEntity | null,
  entity: Bytes,
  blockNumber: BigInt
): StakeHistoryEntity | null {
  const stakeHistoryId = getStakeHistoryEntityId(
    proposal.id,
    entity,
    blockNumber
  )

  const stakeHistory = new StakeHistoryEntity(stakeHistoryId)
  stakeHistory.proposal = proposal.id
  stakeHistory.entity = entity.toHexString()
  stakeHistory.time = blockNumber

  return stakeHistory
}

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  return convictionVoting.kernel()
}

/// /// Proposal entity //////
export function populateProposalDataFromEvent(
  proposal: ProposalEntity | null,
  event: ProposalAddedEvent
): void {
  proposal.metadata = event.params.title
  proposal.link = event.params.link.toString()
  proposal.requestedAmount = event.params.amount
  proposal.creator = event.params.entity
  proposal.createdAt = event.block.timestamp
  proposal.beneficiary = event.params.beneficiary
  proposal.actionId = event.params.actionId
  proposal.stable = event.params.stable
}
