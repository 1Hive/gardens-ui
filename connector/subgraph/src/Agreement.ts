import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  ArbitratorFee as ArbitratorFeeEntity,
  Proposal as ProposalEntity,
} from '../generated/schema'
import {
  Agreement as AgreementContract,
  ActionDisputed as ActionDisputedEvent,
  ActionSettled as ActionSettledEvent,
  ActionChallenged as ActionChallengedEvent,
} from '../generated/templates/Agreement/Agreement'
import {
  getProposalEntity,
  getProposalEntityId,
  loadTokenData,
} from './helpers/index'
import {
  STATUS_DISPUTED,
  STATUS_DISPUTED_NUM,
  STATUS_SETTLED,
  STATUS_SETTLED_NUM,
} from './statuses'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleActionDisputed(event: ActionDisputedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)

  const proposal = getProposalEntity(actionData.value0, actionData.value1)
  proposal.status = STATUS_DISPUTED
  proposal.statusInt = STATUS_DISPUTED_NUM
  proposal.disputeId = challengeData.value8
  proposal.disputedAt = event.block.timestamp

  const submitterArbitratorFeeId = proposal.id + '-submitter'
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(
    event.params.challengeId
  )
  createArbitratorFee(
    proposal.id,
    submitterArbitratorFeeId,
    challengeArbitratorFeesData.value0,
    challengeArbitratorFeesData.value1
  )

  proposal.submitterArbitratorFee = submitterArbitratorFeeId
  proposal.save()
}

export function handleActionSettled(event: ActionSettledEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const proposal = getProposalEntity(actionData.value0, actionData.value1)

  proposal.status = STATUS_SETTLED
  proposal.statusInt = STATUS_SETTLED_NUM
  proposal.settledAt = event.block.timestamp
  proposal.save()
}

export function handleActionChallenged(event: ActionChallengedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const proposalId = getProposalEntityId(actionData.value0, actionData.value1)

  const challengerArbitratorFeeId = proposalId + '-challenger'
  const challengeArbitratorFeesData = agreementApp.getChallengeArbitratorFees(
    event.params.challengeId
  )
  createArbitratorFee(
    proposalId,
    challengerArbitratorFeeId,
    challengeArbitratorFeesData.value2,
    challengeArbitratorFeesData.value3
  )

  const proposal = ProposalEntity.load(proposalId)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)
  proposal.challengerArbitratorFee = challengerArbitratorFeeId
  proposal.settlementOffer = challengeData.value4
  proposal.pausedAt = event.block.timestamp
  proposal.save()
}

function createArbitratorFee(
  proposalId: string,
  id: string,
  feeToken: Address,
  feeAmount: BigInt
): void {
  const arbitratorFee = new ArbitratorFeeEntity(id)
  arbitratorFee.proposal = proposalId
  arbitratorFee.amount = feeAmount
  arbitratorFee.token = loadTokenData(feeToken)
  arbitratorFee.save()
}
