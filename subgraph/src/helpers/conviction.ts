import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ConvictionConfig as ConvictionConfigEntity,
  Proposal as ProposalEntity,
  Stake as StakeEntity,
  StakeHistory as StakeHistoryEntity,
  Token as TokenEntity,
} from '../../generated/schema'
import { MiniMeToken as MiniMeTokenContract } from '../../generated/templates/ConvictionVoting/MiniMeToken'
import { ConvictionVoting as ConvictionVotingContract } from '../../generated/templates/ConvictionVoting/ConvictionVoting'


function loadTokenData(address: Address): boolean {
  const tokenContract = MiniMeTokenContract.bind(address)
  const token = new TokenEntity(address.toHexString())

  // App could be instantiated without a vault which means request token could be invalid
  const symbol = tokenContract.try_symbol()
  if (symbol.reverted) {
    return false
  }

  token.symbol = symbol.value
  token.name = tokenContract.name()
  token.decimals = tokenContract.decimals()

  token.save()

  return true
}

function getConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getConfigEntity(appAddress: Address): ConvictionConfigEntity | null {
  const configEntityId = getConfigEntityId(appAddress)

  let config = ConvictionConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConvictionConfigEntity(configEntityId)
  }

  return config
}

export function loadAppConfig(appAddress: Address): void {
  const config = getConfigEntity(appAddress)
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  // Load tokens data
  const stakeToken = convictionVoting.stakeToken()
  let success = loadTokenData(stakeToken)
  if (success) {
    config.stakeToken = stakeToken.toHexString()
  }

  const requestToken = convictionVoting.requestToken()
  // App could be instantiated without a vault
  success = loadTokenData(requestToken)
  if (success) {
    config.requestToken = requestToken.toHexString()
  }

  // Load conviction params
  config.decay = convictionVoting.decay()
  config.weight = convictionVoting.weight()
  config.maxRatio = convictionVoting.maxRatio()
  config.pctBase = convictionVoting.D()
  config.totalStaked = convictionVoting.totalStaked()
  config.maxStakedProposals = convictionVoting.MAX_STAKED_PROPOSALS().toI32()
  config.minThresholdStakePercentage = convictionVoting.minThresholdStakePercentage()

  config.appAddress = appAddress
  config.orgAddress = convictionVoting.kernel()

  config.save()
}

export function getStakeEntityId(proposalId: BigInt, entity: Bytes): string {
  return proposalId.toHexString() + '-entity:' + entity.toHexString()
}

export function getStakeEntity(
  proposal: ProposalEntity | null,
  entity: Bytes
): StakeEntity | null {
  const stakeId = getStakeEntityId(proposal.number, entity)

  let stake = StakeEntity.load(stakeId)
  if (!stake) {
    stake = new StakeEntity(stakeId)
    stake.entity = entity
    stake.proposal = proposal.id
  }

  return stake
}
export function getStakeHistoryEntityId(
  proposalId: BigInt,
  entity: Bytes,
  timestamp: BigInt
): string {
  return (
    proposalId.toHexString() +
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
    proposal.number,
    entity,
    blockNumber
  )

  const stakeHistory = new StakeHistoryEntity(stakeHistoryId)
  stakeHistory.proposalId = proposal.number
  stakeHistory.entity = entity
  stakeHistory.time = blockNumber

  return stakeHistory
}

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  return convictionVoting.kernel()
}
