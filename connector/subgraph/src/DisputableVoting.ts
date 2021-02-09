import { BigInt, Address } from '@graphprotocol/graph-ts'
import { MiniMeToken as ERC20Contract } from '../generated/templates/DisputableVoting/MiniMeToken'
import { Agreement as AgreementContract } from '../generated/templates/Agreement/Agreement'
import {
  DisputableVoting as VotingContract,
  NewSetting as NewSettingEvent,
  StartVote as StartVoteEvent,
  CastVote as CastVoteEvent,
  PauseVote as PauseVoteEvent,
  ResumeVote as ResumeVoteEvent,
  CancelVote as CancelVoteEvent,
  ExecuteVote as ExecuteVoteEvent,
  QuietEndingExtendVote as QuietEndingExtendVoteEvent,
  ChangeRepresentative as ChangeRepresentativeEvent,
} from '../generated/templates/DisputableVoting/DisputableVoting'

import {
  castVoterState,
  castVoteStatus,
  castVoteStatusNum,
  getProposalEntity,
  getVotingConfigEntity,
  getVotingConfigEntityId,
  isAccepted,
  loadOrCreateCastVote,
  loadOrCreateConfig,
  loadOrCreateSupporter,
  loadTokenData,
  populateVoteCollateralData,
} from './helpers/index'

import { PROPOSAL_TYPE_DECISION, PROPOSAL_TYPE_DECISION_NUM } from './types'
import { STATUS_SETTLED, STATUS_SETTLED_NUM } from './statuses'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleNewSetting(event: NewSettingEvent): void {
  const votingApp = VotingContract.bind(event.address)
  const settingData = votingApp.getSetting(event.params.settingId)

  const currentSettingId = getVotingConfigEntityId(
    event.address,
    event.params.settingId
  )
  const votingConfig = getVotingConfigEntity(
    event.address,
    event.params.settingId
  )

  const daoAddress = votingApp.kernel()
  const honeyPotConfig = loadOrCreateConfig(daoAddress)

  votingConfig.settingId = event.params.settingId
  votingConfig.voteTime = settingData.value0
  votingConfig.supportRequiredPct = settingData.value1
  votingConfig.minimumAcceptanceQuorumPct = settingData.value2
  votingConfig.delegatedVotingPeriod = settingData.value3
  votingConfig.quietEndingPeriod = settingData.value4
  votingConfig.quietEndingExtension = settingData.value5
  votingConfig.executionDelay = settingData.value6
  votingConfig.createdAt = event.block.timestamp
  const token = votingApp.token()
  const tokenId = loadTokenData(token)
  if (tokenId) {
    votingConfig.token = token.toHexString()
  }
  votingConfig.save()

  honeyPotConfig.voting = currentSettingId
  honeyPotConfig.save()
}

export function handleStartVote(event: StartVoteEvent): void {
  const votingApp = VotingContract.bind(event.address)
  const proposal = getProposalEntity(event.address, event.params.voteId)

  const voteData = votingApp.getVote(event.params.voteId)

  proposal.type = PROPOSAL_TYPE_DECISION
  proposal.typeInt = PROPOSAL_TYPE_DECISION_NUM
  proposal.creator = event.params.creator
  proposal.metadata = event.params.context.toString()
  proposal.yeas = voteData.value0
  proposal.nays = voteData.value1
  proposal.totalPower = voteData.value2
  proposal.startDate = voteData.value3
  proposal.snapshotBlock = voteData.value4
  proposal.status = castVoteStatus(voteData.value5)
  proposal.statusInt = castVoteStatusNum(voteData.value5)
  const settingsId = getVotingConfigEntityId(event.address, voteData.value6)
  proposal.setting = settingsId
  proposal.actionId = voteData.value7
  proposal.challengeId = BigInt.fromI32(0)
  proposal.challenger = Address.fromString(
    '0x0000000000000000000000000000000000000000'
  )
  proposal.challengeEndDate = BigInt.fromI32(0)
  proposal.pausedAt = voteData.value8
  proposal.pauseDuration = voteData.value9
  proposal.quietEndingExtensionDuration = voteData.value10
  proposal.quietEndingSnapshotSupport = castVoterState(voteData.value11)
  proposal.script = event.params.executionScript
  proposal.createdAt = event.block.timestamp
  proposal.settledAt = BigInt.fromI32(0)
  proposal.disputedAt = BigInt.fromI32(0)
  proposal.executedAt = BigInt.fromI32(0)
  proposal.createdAt = event.block.timestamp

  proposal.isAccepted = isAccepted(
    voteData.value0, // yeas (using this instead proposa.yeays because we have the attribute as not required on the proposal entity)
    voteData.value1, // nays
    voteData.value2, // totalPower
    settingsId,
    votingApp.PCT_BASE()
  )
  proposal.save()

  populateVoteCollateralData(proposal, event)
}

export function handleCastVote(event: CastVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const voter = loadOrCreateSupporter(event.params.voter)

  const votingApp = VotingContract.bind(event.address)
  const proposal = getProposalEntity(event.address, event.params.voteId)
  const miniMeToken = ERC20Contract.bind(votingApp.token())

  voter.proposal = proposal.id
  voter.save()

  const stake = miniMeToken.balanceOfAt(
    event.params.voter,
    proposal.snapshotBlock
  )

  const castVote = loadOrCreateCastVote(
    event.address,
    event.params.voteId,
    event.params.voter
  )
  castVote.entity = voter.id
  castVote.stake = stake
  castVote.supports = event.params.supports
  castVote.createdAt = event.block.timestamp
  castVote.caster = event.params.caster
  castVote.save()
}

export function handlePauseVote(event: PauseVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
  const votingApp = VotingContract.bind(event.address)
  const agreementApp = AgreementContract.bind(votingApp.getAgreement())
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  const proposal = getProposalEntity(event.address, event.params.voteId)
  proposal.challenger = challengeData.value1
  proposal.challengeId = event.params.challengeId
  proposal.challengeEndDate = challengeData.value2
  proposal.save()
}

export function handleResumeVote(event: ResumeVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleCancelVote(event: CancelVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleExecuteVote(event: ExecuteVoteEvent): void {
  updateVoteState(event.address, event.params.voteId)

  const proposal = getProposalEntity(event.address, event.params.voteId)
  proposal.executedAt = event.block.timestamp
  proposal.save()
}

export function handleQuietEndingExtendVote(
  event: QuietEndingExtendVoteEvent
): void {
  updateVoteState(event.address, event.params.voteId)
}

export function handleChangeRepresentative(
  event: ChangeRepresentativeEvent
): void {
  const voter = loadOrCreateSupporter(event.params.voter)
  voter.representative = event.params.representative
  voter.save()
}

export function updateVoteState(votingAddress: Address, voteId: BigInt): void {
  const votingApp = VotingContract.bind(votingAddress)
  const voteData = votingApp.getVote(voteId)

  const proposal = getProposalEntity(votingAddress, voteId)
  proposal.yeas = voteData.value0
  proposal.nays = voteData.value1
  proposal.status =
    proposal.status == 'Settled'
      ? STATUS_SETTLED
      : castVoteStatus(voteData.value5)
  proposal.statusInt =
    proposal.statusInt == STATUS_SETTLED_NUM
      ? STATUS_SETTLED_NUM
      : castVoteStatusNum(voteData.value5)
  proposal.pausedAt = voteData.value8
  proposal.pauseDuration = voteData.value9
  proposal.quietEndingExtensionDuration = voteData.value10
  proposal.quietEndingSnapshotSupport = castVoterState(voteData.value11)

  const settingsId = getVotingConfigEntityId(votingAddress, voteData.value6)

  proposal.isAccepted = isAccepted(
    voteData.value0,
    voteData.value1,
    voteData.value2,
    settingsId,
    votingApp.PCT_BASE()
  )

  proposal.save()
}
