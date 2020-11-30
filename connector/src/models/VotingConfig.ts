import { VotingConfigData } from '../types'
import { formatBn, PCT_DECIMALS } from '../helpers'

export default class Setting {
  readonly id: string
  readonly token: string
  readonly configId: string
  readonly voteTime: string
  readonly supportRequiredPct: string
  readonly minimumAcceptanceQuorumPct: string
  readonly delegatedVotingPeriod: string
  readonly quietEndingPeriod: string
  readonly quietEndingExtension: string
  readonly executionDelay: string
  readonly createdAt: string

  constructor(data: VotingConfigData) {
    this.id = data.id
    this.token = data.token.id
    this.configId = data.configId
    this.voteTime = data.voteTime
    this.supportRequiredPct = data.supportRequiredPct
    this.minimumAcceptanceQuorumPct = data.minimumAcceptanceQuorumPct
    this.delegatedVotingPeriod = data.delegatedVotingPeriod
    this.quietEndingPeriod = data.quietEndingPeriod
    this.quietEndingExtension = data.quietEndingExtension
    this.executionDelay = data.executionDelay
    this.createdAt = data.createdAt
  }

  get formattedSupportRequiredPct(): string {
    return formatBn(this.supportRequiredPct, PCT_DECIMALS)
  }

  get formattedMinimumAcceptanceQuorumPct(): string {
    return formatBn(this.minimumAcceptanceQuorumPct, PCT_DECIMALS)
  }
}
