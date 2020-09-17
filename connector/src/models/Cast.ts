import { CastData, SupporterData } from '../types'

export default class Cast implements CastData {
  readonly id: string
  readonly entity: SupporterData
  readonly supports: boolean
  readonly stake: string
  readonly createdAt: string

  constructor(data: CastData) {
    this.id = data.id
    this.entity = data.entity
    this.supports = data.supports
    this.stake = data.stake
    this.createdAt = data.createdAt
  }
}
