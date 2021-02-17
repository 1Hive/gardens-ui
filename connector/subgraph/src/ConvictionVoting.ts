/* eslint-disable @typescript-eslint/no-use-before-define */
import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  ContractPaused as ContractPausedEvent,
  ConvictionVoting as ConvictionVotingContract,
  ConvictionSettingsChanged as ConvictionSettingsChangedEvent,
  ProposalAdded as ProposalAddedEvent,
  ProposalCancelled as ProposalCancelledEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalPaused as ProposalPausedEvent,
  ProposalResumed as ProposalResumedEvent,
  ProposalRejected as ProposalRejectedEvent,
  StakeAdded as StakeAddedEvent,
  StakeWithdrawn as StakeWithdrawnEvent,
} from '../generated/templates/ConvictionVoting/ConvictionVoting'
import { Agreement as AgreementContract } from '../generated/templates/Agreement/Agreement'
import { Proposal as ProposalEntity } from '../generated/schema'
import {
  getConvictionConfigEntity,
  getProposalEntity,
  getStakeEntity,
  getStakeHistoryEntity,
  loadOrCreateSupporter,
  populateCollateralData,
  populateProposalDataFromEvent,
} from './helpers'
import {
  STATUS_ACTIVE,
  STATUS_ACTIVE_NUM,
  STATUS_CANCELLED,
  STATUS_CANCELLED_NUM,
  STATUS_CHALLENGED,
  STATUS_CHALLENGED_NUM,
  STATUS_EXECUTED,
  STATUS_EXECUTED_NUM,
} from './statuses'
import {
  PROPOSAL_TYPE_PROPOSAL,
  PROPOSAL_TYPE_PROPOSAL_NUM,
  PROPOSAL_TYPE_SUGGESTION,
  PROPOSAL_TYPE_SUGGESTION_NUM,
  STAKE_TYPE_ADD,
  STAKE_TYPE_WITHDRAW,
} from './types'

export function handleConfigChanged(
  event: ConvictionSettingsChangedEvent
): void {
  const convictionConfig = getConvictionConfigEntity(event.address)
  convictionConfig.decay = event.params.decay
  convictionConfig.maxRatio = event.params.maxRatio
  convictionConfig.weight = event.params.weight
  convictionConfig.minThresholdStakePercentage =
    event.params.minThresholdStakePercentage

  convictionConfig.save()
}

export function handleProposalAdded(event: ProposalAddedEvent): void {
  const proposal = getProposalEntity(event.address, event.params.id)

  populateProposalDataFromEvent(proposal, event)

  if (event.params.amount.gt(BigInt.fromI32(0))) {
    proposal.type = PROPOSAL_TYPE_PROPOSAL
    proposal.typeInt = PROPOSAL_TYPE_PROPOSAL_NUM
  } else {
    proposal.type = PROPOSAL_TYPE_SUGGESTION
    proposal.typeInt = PROPOSAL_TYPE_SUGGESTION_NUM
  }

  proposal.save()

  populateCollateralData(proposal, event)
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
  const proposal = getProposalEntity(event.address, event.params.id)
  proposal.status = STATUS_EXECUTED
  proposal.statusInt = STATUS_EXECUTED_NUM
  proposal.executedAt = event.block.timestamp

  proposal.save()
}

export function handleProposalCancelled(event: ProposalCancelledEvent): void {
  const proposal = getProposalEntity(event.address, event.params.proposalId)
  proposal.status = STATUS_CANCELLED
  proposal.statusInt = STATUS_CANCELLED_NUM

  proposal.save()
}

export function handleProposalPaused(event: ProposalPausedEvent): void {
  _onProposalPaused(
    event.address,
    event.params.challengeId,
    event.params.proposalId
  )
}

export function handleProposalResumed(event: ProposalResumedEvent): void {
  _onProposalResumed(event.address, event.params.proposalId)
}

export function handleProposalRejected(event: ProposalRejectedEvent): void {
  _onProposalRejected(event.address, event.params.proposalId)
}

export function handleContractPaused(event: ContractPausedEvent): void {
  const convictionConfig = getConvictionConfigEntity(event.address)

  convictionConfig.contractPaused = event.params.pauseEnabled

  convictionConfig.save()
}

function _onProposalPaused(
  appAddress: Address,
  challengeId: BigInt,
  proposalId: BigInt
): void {
  const convictionVotingApp = ConvictionVotingContract.bind(appAddress)
  const agreementApp = AgreementContract.bind(
    convictionVotingApp.getAgreement()
  )
  const challengeData = agreementApp.getChallenge(challengeId)
  const proposal = getProposalEntity(appAddress, proposalId)
  proposal.challenger = challengeData.value1
  proposal.challengeId = challengeId
  proposal.challengeEndDate = challengeData.value2
  proposal.status = STATUS_CHALLENGED
  proposal.statusInt = STATUS_CHALLENGED_NUM
  proposal.save()
}

function _onProposalRejected(appAddress: Address, proposalId: BigInt): void {
  const proposal = getProposalEntity(appAddress, proposalId)
  proposal.status = STATUS_CANCELLED
  proposal.statusInt = STATUS_CANCELLED_NUM

  proposal.save()
}

function _onProposalResumed(appAddress: Address, proposalId: BigInt): void {
  const proposal = getProposalEntity(appAddress, proposalId)
  proposal.status = STATUS_ACTIVE
  proposal.statusInt = STATUS_ACTIVE_NUM

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
  const proposal = getProposalEntity(appAddress, proposalId)

  // Hotfix: Orgs managed to stake to non existing proposals
  if (!proposal.creator) {
    return
  }

  // Update totalStaked
  const convictionConfig = getConvictionConfigEntity(appAddress)
  if (type === STAKE_TYPE_ADD) {
    convictionConfig.totalStaked = convictionConfig.totalStaked.plus(amount)
  } else {
    convictionConfig.totalStaked = convictionConfig.totalStaked.minus(amount)
  }
  convictionConfig.save()

  proposal.totalTokensStaked = totalTokensStaked
  proposal.convictionLast = conviction
  proposal.weight = conviction

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

  proposal.save()
}

function _updateProposalStakes(
  proposal: ProposalEntity | null,
  type: string,
  entity: Address,
  tokensStaked: BigInt,
  timestamp: BigInt
): void {
  const supporter = loadOrCreateSupporter(entity)
  supporter.proposal = proposal.id
  supporter.save()

  const stake = getStakeEntity(proposal, entity)
  stake.amount = tokensStaked
  stake.createdAt = timestamp
  stake.type = type
  stake.save()
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
  const stakeHistory = getStakeHistoryEntity(proposal, entity, blockNumber)
  stakeHistory.type = type
  stakeHistory.tokensStaked = tokensStaked
  stakeHistory.totalTokensStaked = totalTokensStaked
  stakeHistory.conviction = conviction
  stakeHistory.createdAt = timestamp
  stakeHistory.save()
}
