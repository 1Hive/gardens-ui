/* eslint-disable @typescript-eslint/no-use-before-define */
import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  ConvictionSettingsChanged as ConvictionSettingsChangedEvent,
  ProposalAdded as ProposalAddedEvent,
  ProposalCancelled as ProposalCancelledEvent,
  ProposalExecuted as ProposalExecutedEvent,
  StakeAdded as StakeAddedEvent,
  StakeWithdrawn as StakeWithdrawnEvent,
} from '../generated/templates/ConvictionVoting/ConvictionVoting'
import { Proposal as ProposalEntity } from '../generated/schema'
import {
  getConvictionConfigEntity,
  getProposalEntity,
  getStakeEntity,
  getStakeHistoryEntity,
  populateProposalDataFromEvent
} from './helpers'
import { STATUS_CANCELLED, STATUS_EXECUTED } from './statuses'
import { 
  PROPOSAL_TYPE_PROPOSAL, 
  PROPOSAL_TYPE_SUGGESTION, 
  STAKE_TYPE_ADD, 
  STAKE_TYPE_WITHDRAW 
} from './types'

export function handleConfigChange(event: ConvictionSettingsChangedEvent): void {
  let convictionConfig = getConvictionConfigEntity(event.address)
  convictionConfig.decay = event.params.decay
  convictionConfig.maxRatio = event.params.maxRatio
  convictionConfig.weight = event.params.weight
  convictionConfig.minThresholdStakePercentage = event.params.minThresholdStakePercentage

  convictionConfig.save()
}

export function handleProposalAdded(event: ProposalAddedEvent): void {
  let proposal = getProposalEntity(event.address, event.params.id)
  
  populateProposalDataFromEvent(proposal, event)
  
  let proposalType = event.params.amount.gt(BigInt.fromI32(0)) ? PROPOSAL_TYPE_PROPOSAL : PROPOSAL_TYPE_SUGGESTION
  proposal.type = proposalType
  proposal.stakes = []

  proposal.save()
}

export function handleStakeAdded(event: StakeAddedEvent): void {
  _onNewStake(
    event.address,
    STAKE_TYPE_ADD,
    event.params.entity,
    event.params.id,
    event.params.amount,
    event.params.tokensStaked,
    event.params.totalTokensStaked,
    event.params.conviction,
    event.block.number,
    event.block.timestamp
  )
}

export function handleStakeWithdrawn(event: StakeWithdrawnEvent): void {
  _onNewStake(
    event.address,
    STAKE_TYPE_WITHDRAW,
    event.params.entity,
    event.params.id,
    event.params.amount,
    event.params.tokensStaked,
    event.params.totalTokensStaked,
    event.params.conviction,
    event.block.number,
    event.block.timestamp
  )
}


export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let proposal = getProposalEntity(event.address, event.params.id)
  proposal.status = STATUS_EXECUTED
  
  proposal.save()
}

export function handleProposalCancelled(event: ProposalCancelledEvent): void {
  let proposal = getProposalEntity(event.address, event.params.id)
  proposal.status = STATUS_CANCELLED

  proposal.save()
}

function _onNewStake(
  appAddress: Address,
  type: string,
  entity: Address,
  proposalId: BigInt,
  amount: BigInt,
  tokensStaked: BigInt,
  totalTokensStaked: BigInt,
  conviction: BigInt,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let proposal = getProposalEntity(appAddress, proposalId)

  // Hotfix: Orgs managed to stake to non existing proposals 
  if (!proposal.creator) {
    return 
  }

  let convictionConfig = getConvictionConfigEntity(appAddress)

  // If the old totalTokensStaked is less than the new means that is a stake else a withdraw
  if (proposal.totalTokensStaked < totalTokensStaked){
    convictionConfig.totalStaked = convictionConfig.totalStaked.plus(amount)
  } else {
    convictionConfig.totalStaked = convictionConfig.totalStaked.minus(amount)
  }
  convictionConfig.save()

  proposal.totalTokensStaked = totalTokensStaked

  _updateProposalStakes(proposal, type, entity, tokensStaked, timestamp)
  _updateStakeHistory(
    proposal,
    type,
    entity,
    tokensStaked,
    totalTokensStaked,
    conviction,
    blockNumber,
    timestamp
  )
}

function _updateProposalStakes(
  proposal: ProposalEntity | null,
  type: string,
  entity: Address,
  tokensStaked: BigInt,
  timestamp: BigInt
): void {
  let stake = getStakeEntity(proposal, entity)
  stake.amount = tokensStaked
  stake.createdAt = timestamp
  stake.type = type

  stake.save()
  proposal.save()
}

function _updateStakeHistory(
  proposal: ProposalEntity | null,
  type: string,
  entity: Address,
  tokensStaked: BigInt,
  totalTokensStaked: BigInt,
  conviction: BigInt,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let stakeHistory = getStakeHistoryEntity(proposal, entity, blockNumber)

  stakeHistory.type = type
  stakeHistory.tokensStaked = tokensStaked
  stakeHistory.totalTokensStaked = totalTokensStaked
  stakeHistory.conviction = conviction
  stakeHistory.createdAt = timestamp


  stakeHistory.save()
}
