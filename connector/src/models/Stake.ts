import { ProposalData, StakeData, SupporterData } from '../types'

export default class Stake implements StakeData {
  readonly id: string
  readonly type: string
  readonly entity: SupporterData
  readonly proposal: ProposalData
  readonly amount: string
  readonly createdAt: string

  constructor(data: StakeData) {
    this.id = data.id
    this.type = data.type
    this.entity = data.entity
    this.proposal = data.proposal
    this.amount = data.amount
    this.createdAt = data.createdAt
  }
}
