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

export type {
  ConfigType,
  FiltersType,
  TokenType
}