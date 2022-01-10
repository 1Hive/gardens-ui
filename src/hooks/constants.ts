import { ConnectionContext } from '@1hive/connect-react'
import BigNumber from '@lib/bigNumber'

type TokenType = {
  decimals: number
  id: string
  name: string
  symbol: string
  __typename: string
}

type ConfigType = {
  conviction: {
    alpha: BigNumber
    contractPaused: boolean
    decay: string
    effectiveSupply: BigNumber
    fundsManager: string
    id: string
    maxRatio: BigNumber
    maxStakedProposals: number
    minThresholdStakePercentage: string
    pctBase: BigNumber
    requestToken: TokenType
    stableToken: TokenType
    stableTokenOracle: string
    stakeToken: TokenType
    totalStaked: BigNumber
    weight: BigNumber
  }
  id: string
  voting: {
    createdAt: number
    delegatedVotingPeriod: number
    executionDelay: number
    id: string
    minAcceptQuorumPct: BigNumber
    minimumAcceptanceQuorumPct: string
    quietEndingExtension: number
    quietEndingPeriod: number
    settingId: string
    supportRequiredPct: BigNumber
    token: TokenType
    voteTime: number
  }
}

type FiltersType = {
  count: {
    filter: number
    onChange: () => void
  }
  isActive: boolean
  name: {
    filter: string
    queryArgs: {
      metadata: string
    }
    onChange: (name: string) => void
  }
  onClear: () => void
  ranking: {
    items: Array<string>
    filter: number
    queryArgs: { orderBy: string }
    onChange: (index: any) => void
  }
  status: {
    items: Array<string>
    filter: number
    queryArgs: {
      statuses: Array<number>
    }
    onChange: (index: any) => void
  }
  support: {
    items: Array<string>
    filter: number
    onChange: () => void
  }
  type: {
    items: Array<string>
    filter: number
    queryArgs: any
    onChange: (index: any) => void
  }
  proposalCount?: any
}

type AppType = {
  appName: string
  address: string
  appId: string
  codeAddress: string
  contentUri: string
  isForwarder: boolean
  isUpgradeable: boolean
  kernelAddress: string
  name: string
  manifest: {
    name: string
    icons: Array<{
      src: string
    }>
  }
  organization: {
    connection: ConnectionContext
  }
  registry: string
  registryAddress: string
  repoAddress: string
  version: string
}

type StakeType = {
  amount: BigNumber
  createdAt: number
  id: string
  proposal: any
  supporter: {
    organization: Array<{
      id: string
      __typename: string
    }>

    user: {
      id: string
      address: string
    }
  }
  type: string
}

type StakeHistoryType = {
  conviction: BigNumber
  createdAt: number
  id: string
  proposal: ProposalType
  supporter: {
    organization: Array<{
      id: string
      __typename: string
    }>

    user: {
      id: string
      address: string
    }
  }
  time: string
  tokensStaked: BigNumber
  totalTokensStaked: BigNumber
}

type ProposalType = {
  actionId: string
  beneficiary: string
  casts: Array<any>
  challengeEndDate: number
  challengeId: string
  challenger: string
  challengerArbitratorFee: any
  challengerArbitratorFeeId: any
  collateralRequirement: {
    actionAmount: BigNumber
    challengeAmount: BigNumber
    challengeDuration: string
    id: string
    proposalId: string
    tokenDecimals: number
    tokenId: string
    tokenSymbol: string
  }
  convictionTrend: BigNumber
  createdAt: number
  creator: string
  currentConviction: BigNumber
  disputeId: any
  disputedAt: number
  executedAt: number
  futureConviction: BigNumber
  futureStakedConviction: BigNumber
  hasEnded: boolean
  id: number
  isAccepted: any
  link: string
  maxConviction: BigNumber
  metadata: string
  minTokensNeeded: BigNumber
  name: string
  nays: any
  neededConviction: BigNumber
  neededTokens: BigNumber
  number: string | number
  organization: {
    id: string
    __typename: string
  }
  pauseDuration: number
  pausedAt: number
  quietEndingExtensionDuration: any
  quietEndingSnapshotSupport: any
  remainingBlocksToPass: number
  requestedAmount: BigNumber
  requestedAmountConverted: BigNumber
  script: any
  setting: any
  settledAt: 0
  settlementOffer: any
  snapshotBlock: string
  stable: boolean
  stakedConviction: BigNumber
  stakes: Array<StakeType>
  stakesHistory: Array<StakeHistoryType>
  startDate: any
  status: string
  statusData: {
    open: boolean
    rejected: boolean
    cancelled: boolean
    settled: boolean
    challenged: boolean
    disputed: boolean
  }
  submitterArbitratorFee: any
  submitterArbitratorFeeId: any
  threshold: BigNumber
  totalPower: any
  totalTokensStaked: BigNumber
  txHash: string
  type: string
  userConviction: BigNumber
  userStakedConviction: BigNumber
  yeas: any
}

export type { ConfigType, FiltersType, TokenType, AppType, ProposalType }
