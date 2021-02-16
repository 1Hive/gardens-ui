import { subscription } from '@aragon/connect-core'

import ArbitratorFee from './ArbitratorFee'
import CollateralRequirement from './CollateralRequirement'
import {
  CastData,
  IHoneypotConnector,
  StakeData,
  StakeHistoryData,
  ProposalData,
  SubscriptionHandler,
  VotingConfigData
} from '../types'

export default class Proposal {
  #connector: IHoneypotConnector

  readonly id: string
  readonly number: string
  readonly creator: string
  readonly status: string
  readonly type: string
  readonly createdAt: string 
  readonly executedAt: string
  readonly metadata?: string
  
  // proposal data
  readonly link?: string
  readonly stakes?: StakeData[]
  readonly stakesHistory?: StakeHistoryData[]
  readonly beneficiary?: string
  readonly requestedAmount?: string
  readonly totalTokensStaked?: string
  readonly stable?: boolean

  // Voting data
  readonly setting?: VotingConfigData
  readonly startDate?: string
  readonly totalPower?: string
  readonly snapshotBlock?: string
  readonly yeas?: string
  readonly nays?: string
  readonly quietEndingExtensionDuration?: string
  readonly quietEndingSnapshotSupport?: string
  readonly script?: string
  readonly isAccepted?: boolean
  readonly casts?: CastData[] 

  // Dispute data
  readonly actionId?: string
  readonly challengeId?: string
  readonly challenger?: string
  readonly challengeEndDate?: string
  readonly disputeId?: string
  readonly settledAt?: string
  readonly settlementOffer?: string
  readonly disputedAt?: string
  readonly pausedAt?: string
  readonly pauseDuration?: string
  readonly submitterArbitratorFeeId?: string
  readonly challengerArbitratorFeeId?: string
  

  constructor(data: ProposalData, connector: IHoneypotConnector) {
    this.#connector = connector

    this.id = data.id
    this.number = data.number
    this.creator = data.creator
    this.status = data.status
    this.type = data.type
    this.createdAt = data.createdAt
    this.executedAt = data.executedAt
    this.metadata = data.metadata


    // proposal data
    this.link = data.link
    this.stakes = data.stakes
    this.stakesHistory = data.stakesHistory
    this.beneficiary = data.beneficiary
    this.requestedAmount = data.requestedAmount
    this.totalTokensStaked = data.totalTokensStaked
    this.stable = data.stable

    //voting data
    this.setting = data.setting
    this.startDate = data.startDate
    this.totalPower = data.totalPower
    this.snapshotBlock = data.snapshotBlock 
    this.yeas = data.yeas
    this.nays = data.nays
    this.quietEndingExtensionDuration = data.quietEndingExtensionDuration
    this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport
    this.script = data.script
    this.isAccepted = data.isAccepted
    this.casts = data.castVotes

    //dispute data
    this.actionId = data.actionId
    this.challengeId = data.challengeId
    this.challenger = data.challenger
    this.challengeEndDate = data.challengeEndDate
    this.disputeId = data.disputeId
    this.settledAt = data.settledAt
    this.settlementOffer = data.settlementOffer
    this.disputedAt = data.disputedAt
    this.pausedAt = data.pausedAt
    this.pauseDuration = data.pauseDuration
    this.submitterArbitratorFeeId = data.submitterArbitratorFeeId
    this.challengerArbitratorFeeId = data. challengerArbitratorFeeId
  }

  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.id)
  }

  onCollateralRequirement(
    callback?:Function
  ): SubscriptionHandler {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.id, callback)
    )
  }

  async submitterArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.submitterArbitratorFeeId || '')
  }

  onSubmitterArbitratorFee(
    callback?: Function
  ): SubscriptionHandler {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.submitterArbitratorFeeId || '', callback)
    )
  }

  async challengerArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.challengerArbitratorFeeId || '')
  }

  onChallengerArbitratorFee(
    callback?: Function
  ): SubscriptionHandler {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.challengerArbitratorFeeId || '', callback)
    )
  }
}
