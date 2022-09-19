// TODO: We could improve this types in the future

import { ConnectionContext } from '@1hive/connect-react'
import BigNumber from '@lib/bigNumber'

type TokenType = {
  decimals?: number
  id: string
  name?: string
  symbol: string
  __typename?: string
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
  loading?: boolean
  actionId: string
  beneficiary: string
  casts: Array<any>
  endDate: number
  challengeEndDate: number
  minAcceptQuorum: BigNumber
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
  nay: any
  yea: any
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
    executed: boolean
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

type ActionsType = {
  agreementActions: {
    approveTokenAmount: (
      tokenAddress: string,
      depositAmount: any,
      onDone?: () => void
    ) => Promise<void>
    challengeAction: (
      { actionId, settlementOffer, challengerFinishedEvidence, context }: any,
      onDone?: () => void
    ) => Promise<void>
    disputeAction: (
      { actionId, settlementOffer, challengerFinishedEvidence, context }: any,
      onDone?: () => void
    ) => Promise<void>
    getAllowance: (
      tokenAddress: string
    ) => Promise<BigNumber | undefined> | undefined
    resolveAction: (disputeId: number) => void
    settleAction: (
      { actionId }: { actionId: number },
      onDone?: () => void
    ) => Promise<void>
    signAgreement: (
      { versionId }: { versionId: number },
      onDone?: () => void
    ) => Promise<void>
  }
  convictionActions: {
    executeProposal: (proposalId: any, onDone?: any) => Promise<void>
    cancelProposal: (proposalId: any, onDone?: any) => Promise<void>
    newProposal: (
      { title, link, amount, stableRequestAmount, beneficiary }: any,
      onDone?: any
    ) => Promise<void>
    newSignalingProposal: ({ title, link }: any, onDone?: any) => Promise<void>
    stakeToProposal: (
      { proposalId, amount }: any,
      onDone?: any
    ) => Promise<void>
    withdrawFromProposal: (
      { proposalId, amount }: any,
      onDone?: any
    ) => Promise<void>
  }
  hookedTokenManagerActions: {
    approveWrappableTokenAmount: (amount: any, onDone?: () => void) => void
    getAllowance: () => void
    wrap: ({ amount }: any, onDone?: () => void) => Promise<void>
    unwrap: ({ amount }: any, onDone?: () => void) => Promise<void>
  }
  issuanceActions: { executeIssuance: () => void }
  priceOracleActions: { updatePriceOracle: () => void }
  unipoolActions: { claimRewards: () => void }
  votingActions: {
    delegateVoting: (representative: any, onDone?: () => void) => Promise<void>
    executeDecision: (voteId: number, script: any) => void
    voteOnDecision: (
      voteId: number,
      supports: any,
      onDone?: any
    ) => Promise<void>
    voteOnBehalfOf: (
      voteId: number,
      supports: any,
      voters: any,
      onDone?: () => void
    ) => Promise<void>
  }
}

type TransactionType = {
  data: any
  from: string | undefined
  to: string | undefined
  description?: string
  type?: string
  gasLimit?: number
}

type IntentType = {
  transactions: Array<TransactionType>
}

export type {
  ConfigType,
  FiltersType,
  TokenType,
  AppType,
  ProposalType,
  ActionsType,
  TransactionType,
  IntentType,
}
