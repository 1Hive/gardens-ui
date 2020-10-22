import {
  CastData,
  IHoneypotConnector,
  StakeData,
  StakeHistoryData,
  ProposalData,
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
  
  // proposal data
  readonly name?: string
  readonly link?: string
  readonly stakes?: StakeData[]
  readonly stakesHistory?: StakeHistoryData[]
  readonly beneficiary?: string
  readonly requestedAmount?: string
  readonly totalTokensStaked?: string

  // Voting data
  readonly metadata?: string
  readonly startBlock?: string
  readonly executionBlock?: string
  readonly snapshotBlock?: string
  readonly supportRequiredPct?: string
  readonly minAcceptQuorum?: string
  readonly yea?: string
  readonly nay?: string
  readonly votingPower?: string
  readonly script?: string
  readonly casts?: CastData[] 

  constructor(data: ProposalData, connector: IHoneypotConnector) {
    this.#connector = connector

    this.id = data.id
    this.number = data.number
    this.creator = data.creator
    this.status = data.status
    this.type = data.type
    this.createdAt = data.createdAt
    this.executedAt = data.executedAt


    // proposal data
    this.name = data.name
    this.link = data.link
    this.stakes = data.stakes
    this.stakesHistory = data.stakesHistory
    this.beneficiary = data.beneficiary
    this.requestedAmount = data.requestedAmount
    this.totalTokensStaked = data.totalTokensStaked

    // voting data
    this.metadata = data.metadata
    this.startBlock = data.startBlock
    this.executionBlock = data.executionBlock
    this.snapshotBlock = data.snapshotBlock
    this.supportRequiredPct = data.supportRequiredPct
    this.minAcceptQuorum = data.minAcceptQuorum
    this.yea = data.yea
    this.nay = data.nay
    this.votingPower = data.votingPower
    this.script = data.script
    this.casts = data.casts
  }
}
