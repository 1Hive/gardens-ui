import { StakeData, SupporterData } from '../types'

export default class Stake implements StakeData {
  readonly id: string
  readonly type: string
  readonly entity: SupporterData
  readonly amount: string
  readonly createdAt: string

  constructor(data: StakeData) {
    this.id = data.id
    this.type = data.type
    this.entity = data.entity
    this.amount = data.amount
    this.createdAt = data.createdAt
  }
}
