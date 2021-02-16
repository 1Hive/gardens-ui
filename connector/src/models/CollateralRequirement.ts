import { formatBn } from '../helpers'
import { CollateralRequirementData, IHoneypotConnector } from '../types'

export default class CollateralRequirement {
  #connector: IHoneypotConnector

  readonly id: string
  readonly proposalId: string
  readonly tokenId: string
  readonly tokenDecimals: string
  readonly tokenSymbol: string
  readonly actionAmount: string
  readonly challengeAmount: string
  readonly challengeDuration: string

  constructor(
    data: CollateralRequirementData,
    connector: IHoneypotConnector
  ) {
    this.#connector = connector

    this.id = data.id
    this.proposalId = data.proposalId
    this.tokenId = data.tokenId
    this.tokenDecimals = data.tokenDecimals
    this.tokenSymbol = data.tokenSymbol
    this.actionAmount = data.actionAmount
    this.challengeAmount = data.challengeAmount
    this.challengeDuration = data.challengeDuration
  }

  get formattedActionAmount(): string {
    return formatBn(this.actionAmount, this.tokenDecimals)
  }

  get formattedChallengeAmount(): string {
    return formatBn(this.challengeAmount, this.tokenDecimals)
  }
}
