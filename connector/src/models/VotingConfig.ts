import { VotingConfigData } from '../types'
import { formatBn, PCT_DECIMALS } from '../helpers'

export default class Setting {
  readonly id: string | null
  readonly token: string | null
  readonly configId: string | null
  readonly voteTime: string | null
  readonly supportRequiredPct: string | null
  readonly minimumAcceptanceQuorumPct: string | null
  readonly delegatedVotingPeriod: string | null
  readonly quietEndingPeriod: string | null
  readonly quietEndingExtension: string | null
  readonly executionDelay: string | null
  readonly createdAt: string | null

  constructor(data: VotingConfigData | null) {
    this.id = data?.id ? data.id : null
    this.token = data?.token.id ? data?.token.id : null
    this.configId = data?.configId ? data.configId : null
    this.voteTime = data?.voteTime ? data.voteTime : null
    this.supportRequiredPct = data?.supportRequiredPct ? data?.supportRequiredPct : null
    this.minimumAcceptanceQuorumPct = data?.minimumAcceptanceQuorumPct ? data.minimumAcceptanceQuorumPct : null
    this.delegatedVotingPeriod = data?.delegatedVotingPeriod ? data.delegatedVotingPeriod : null
    this.quietEndingPeriod = data?.quietEndingPeriod ? data.quietEndingPeriod : null
    this.quietEndingExtension = data?.quietEndingExtension ? data.quietEndingExtension : null
    this.executionDelay = data?.executionDelay ? data.executionDelay : null
    this.createdAt = data?.createdAt ? data.createdAt : null
  }

  get formattedSupportRequiredPct(): string | null {

    return this.supportRequiredPct ? formatBn(this.supportRequiredPct, PCT_DECIMALS) : null
  }

  get formattedMinimumAcceptanceQuorumPct(): string | null {
    return this.minimumAcceptanceQuorumPct ? formatBn(this.minimumAcceptanceQuorumPct, PCT_DECIMALS) : null
  }
}
