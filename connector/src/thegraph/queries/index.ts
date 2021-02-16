import gql from 'graphql-tag'

// TODO: Filters
export const CONFIG = (type: string) => gql`
  ${type} Config($id: ID!) {
    config(id: $id) {
      id

      # conviction voting config
      conviction {
        id
        decay
        weight
        maxRatio
        pctBase
        stakeToken {
          id
          name
          symbol
          decimals
        }
        totalStaked
        maxStakedProposals
        minThresholdStakePercentage
        requestToken {
          id
          name
          symbol
          decimals
        }
        stableToken {
          id
          name
          symbol
          decimals
        }
        stableTokenOracle
        contractPaused
      }

      # voting config
      voting {
        id
        settingId
        token {
          id
          name
          symbol
          decimals
        }
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
    }
  }
`

export const ALL_PROPOSALS = (type: string) => gql`
  ${type} Proposals($first: Int!, $skip: Int!, $proposalTypes: [Int]!, $statuses: [Int]!, $metadata: String! $orderBy: String!, $orderDirection: String!) {
    proposals(where: { typeInt_in: $proposalTypes, statusInt_in: $statuses, metadata_contains: $metadata },  first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      number
      creator
      status
      type
      createdAt
      metadata
      executedAt

      # Proposal / Suggestion data (signaling proposals and proposals requesting funds)
      link
      stakes(where: { amount_gt: 0 }, first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        entity {
          id
        }
        amount
        createdAt
      }
      stakesHistory(first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        entity {
          id
        }
        tokensStaked
        totalTokensStaked
        conviction
        time      # Block at which was created
        createdAt # Timestamp at which was created
      }
      beneficiary
      requestedAmount
      totalTokensStaked
      stable
     
     # Decision data (votes)
      setting { 
        id
        token {
          id
        }
        settingId
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      isAccepted
      castVotes {
        id
        entity {
          id
        }
        caster
        supports
        stake
        createdAt
      }

      # Disputable data
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      settledAt
      settlementOffer
      disputedAt
      pausedAt
      pauseDuration
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id
      }

      collateralRequirement {
        token {
          id
          symbol
          decimals
        }
        actionAmount
        challengeAmount
        challengeDuration
      }
    }
  }
`

export const PROPOSAL = (type: string) => gql`
  ${type} Proposal($id: ID!) {
    proposal(id: $id) {
      id
      number
      creator
      status
      type
      createdAt
      metadata
      executedAt

      # Proposal / Suggestion data (signaling proposals and proposals requesting funds)
      link
      stakes(where: { amount_gt: 0 }, first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        entity {
          id
        }
        amount
        createdAt
      }
      stakesHistory(first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        entity {
          id
        }
        tokensStaked
        totalTokensStaked
        conviction
        time      # Block at which was created
        createdAt # Timestamp at which was created
      }
      beneficiary
      requestedAmount
      totalTokensStaked
      stable
     
      # Decision data (votes)
      setting { 
        id
        token {
          id
        }
        settingId
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      isAccepted
      castVotes {
        id
        entity {
          id
        }
        caster
        supports
        stake
        createdAt
      }

      # Disputable data
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      settledAt
      settlementOffer
      disputedAt
      pausedAt
      pauseDuration
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id
      }
      collateralRequirement {
        token {
          id
          symbol
          decimals
        }
        actionAmount
        challengeAmount
        challengeDuration
      }
    }
  }
`

export const SUPPORTER = (type: string) => gql`
  ${type} Supporter($id: ID!) {
    supporter(id: $id) {
      id
      address
      representative
      # vote casts
      casts {
        id
        supports
        stake
        proposal {
          id
          number
          status
          metadata
          type
        }
        createdAt

      }
      # proposals stakes
      stakes(orderBy: createdAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          metadata
          type
        }
        amount 
        createdAt
      }
      # proposal stakes history
      stakesHistory(orderBy: createdAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          metadata
          type
        }
        totalTokensStaked
        conviction
        time
        createdAt
      }
    }
  }
`
export const COLLATERAL_REQUIREMENT = (type: string) => gql`
  ${type} CollateralRequirement($proposalId: String!) {
    proposal(id: $proposalId) {
      collateralRequirement {
        id
        actionAmount
        challengeAmount
        challengeDuration
        proposal {
          id
        }
        token {
          id
          decimals
          symbol
        }
      }
    }
  }
`

export const ARBITRATOR_FEE = (type: string) => gql`
  ${type} ArbitratorFee($arbitratorFeeId: String!) {
    arbitratorFee(id: $arbitratorFeeId) {
      id
      amount
      proposal {
        id
      }
      token {
        id
        decimals
        symbol
      }
    }
  }
`