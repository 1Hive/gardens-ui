import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  Proposal as ProposalEntity,
} from '../../generated/schema'
import { STATUS_ACTIVE } from '../proposal-statuses'

export function getProposalEntityId(
  appAddress: Address,
  proposalId: BigInt
): string {
  return (
    'appAddress:' +
    appAddress.toHexString() +
    '-proposalId:' +
    proposalId.toHexString()
  )
}

export function getProposalEntity(
  appAddress: Address,
  proposalId: BigInt
): ProposalEntity | null {
  const proposalEntityId = getProposalEntityId(appAddress, proposalId)

  let proposal = ProposalEntity.load(proposalEntityId)
  if (!proposal) {
    proposal = new ProposalEntity(proposalEntityId)
    proposal.number = proposalId
    proposal.stakes = []
    proposal.status = STATUS_ACTIVE
    proposal.totalTokensStaked = BigInt.fromI32(0)
    proposal.creator = Bytes.fromHexString('0x') as Bytes

  }

  return proposal
}

export * from './conviction'
export * from './voting'