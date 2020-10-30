import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { MiniMeToken as MiniMeTokenContract } from '../../generated/templates/ConvictionVoting/MiniMeToken'
import {
  Config as ConfigEntity,
  Proposal as ProposalEntity,
  Supporter as SupporterEntity,
  Token as TokenEntity,
} from '../../generated/schema'
import { STATUS_ACTIVE, STATUS_ACTIVE_NUM } from '../statuses'

/// /// Token Entity //////
export function loadTokenData(address: Address): boolean {
  const id = address.toHexString()
  const token = TokenEntity.load(id)

  if (!token) {
    const token = new TokenEntity(id)
    const tokenContract = MiniMeTokenContract.bind(address)

    // App could be instantiated without a vault which means request token could be invalid
    const symbol = tokenContract.try_symbol()
    if (symbol.reverted) {
      return null
    }

    token.symbol = symbol.value
    token.name = tokenContract.name()
    token.decimals = tokenContract.decimals()
    token.save()
  }

  return token.id
}

/// /// General Config Entity //////
export function loadOrCreateConfig(orgAddress: Address): ConfigEntity | null {
  const id = orgAddress.toHexString()
  let config = ConfigEntity.load(id)

  if (config === null) {
    config = new ConfigEntity(id)
  }

  return config
}

/// /// Supporter Entity //////
export function createSupporter(address: Address): void {
  const id = address.toHexString()
  let supporter = SupporterEntity.load(id)

  if (supporter !== null) {
    return
  }

  supporter = new SupporterEntity(id)
  supporter.address = address
  supporter.save()
}

/// /// Proposal Entity //////
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
    proposal.status = STATUS_ACTIVE
    proposal.statusInt = STATUS_ACTIVE_NUM
    proposal.weight = BigInt.fromI32(0)
    proposal.challengeId = BigInt.fromI32(0)
    proposal.challenger = Address.fromString(
      '0x0000000000000000000000000000000000000000'
    )
    proposal.challengeEndDate = BigInt.fromI32(0)
  }

  return proposal
}

// Export local helpers
export * from './conviction'
export * from './voting'
export * from './agreement'
