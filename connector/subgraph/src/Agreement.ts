import { Proposal as ProposalEntity } from '../generated/schema'
import {
  Agreement as AgreementContract,
  ActionDisputed as ActionDisputedEvent,
} from '../generated/templates/Agreement/Agreement'
import { getProposalEntity } from './helpers/index'
import { STATUS_DISPUTED, STATUS_DISPUTED_NUM } from './statuses'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleActionDisputed(event: ActionDisputedEvent): void {
  const agreementApp = AgreementContract.bind(event.address)
  const actionData = agreementApp.getAction(event.params.actionId)
  const challengeData = agreementApp.getChallenge(event.params.challengeId)

  const proposal = getProposalEntity(actionData.value0, actionData.value1)
  proposal.status = STATUS_DISPUTED
  proposal.statusInt = STATUS_DISPUTED_NUM
  proposal.disputeId = challengeData.value8
  proposal.save()
}
