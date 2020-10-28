import Config from './models/Config'
import Proposal from './models/Proposal'
import Supporter from './models/Supporter'

export const ALL_PROPOSAL_TYPES = [0, 1, 2]     // [Suggestion, Proposal, Decision]
export const ALL_PROPOSAL_STATUSES = [0, 1, 2]  // [Active, Cancelled, Executed]

export type SubscriptionHandler = { unsubscribe: () => void }

export type Address = string

export interface TokenData {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface ConfigData {
  id: string
  conviction: ConvictionConfigData
  voting: VotingConfigData
}

export interface ConvictionConfigData {
  decay: string
  weight: string
  maxRatio: string
  pctBase: string
  stakeToken: TokenData
  requestToken: TokenData
  maxStakedProposals: number
  minThresholdStakePercentage: string
  totalStaked: string
}

export interface VotingConfigData {
  id: string
  token: TokenData
  supportRequiredPct: string
  minAcceptQuorumPct: string
  durationBlocks: string
  bufferBlocks: string
  executionDelayBlocks: string
}

export interface StakeData {
  id: string
  type: string
  entity: SupporterData
  proposal: ProposalData
  amount: string
  createdAt: string
}

export interface StakeHistoryData {
  id: string
  type: string
  entity: SupporterData
  proposal: ProposalData
  tokensStaked: string
  totalTokensStaked: string
  conviction: string
  time: string
  createdAt: string
}

export interface CastData {
  id: string
  entity: SupporterData
  supports: boolean
  stake: string
  createdAt: string
}

export interface ProposalData {
  id: string
  number: string
  creator: string
  status: string
  type: string
  createdAt: string
  executedAt: string

  // proposal data
  name?: string
  link?: string
  stakes?: StakeData[]
  stakesHistory?: StakeHistoryData[]
  beneficiary?: string
  requestedAmount?: string
  totalTokensStaked?: string

  // Voting data
  metadata?: string
  startBlock?: string
  executionBlock?: string
  snapshotBlock?: string
  supportRequiredPct?: string
  minAcceptQuorum?: string
  yea?: string
  nay?: string
  votingPower?: string
  script?: string
  casts?: CastData[] 
}

export interface SupporterData {
  id: string
  address: string
  casts: CastData[]
  stakes: StakeData[]
  stakesHistory: StakeHistoryData[]
}

export interface IHoneypotConnector {
  disconnect(): Promise<void>
  config(
    id: string
  ): Promise<Config>
  onConfig(
    id: string, 
    callback: Function
  ): SubscriptionHandler
  proposal(
    id: string
  ): Promise<Proposal>
  onProposal(
    id: string,
    callback: Function
  ): SubscriptionHandler
  proposals(
    first: number,
    skip: number,
    orderBy: string, 
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string,
  ): Promise<Proposal[]>
  onProposals(
    first: number,
    skip: number,
    orderBy: string, 
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string,
    callback: Function
  ): SubscriptionHandler
  supporter(
    address: string
  ): Promise<Supporter>
  onSupporter(
    address: string,
    callback: Function
  ): SubscriptionHandler
}
