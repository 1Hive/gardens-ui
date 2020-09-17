import gql from 'graphql-tag'

// TODO: Filters
export const CONFIG = (type: string) => gql`
  ${type} Config($id: String!) {
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
      }

      # voting config
      voting {
        id
        token {
          id
          name
          symbol
          decimals
        }
        supportRequiredPct
        minAcceptQuorumPct
        durationBlocks
        bufferBlocks
        executionDelayBlocks
      }
    }
  }
`

export const ALL_PROPOSALS = (type: string) => gql`
  ${type} Proposals($first: Int!, $skip: Int!) {
    proposals(first: $first, skip: $skip) {
      id
      number
      creator
      status
      type
      createdAt

      # Proposal / Suggestion data (signaling proposals and proposals requesting funds)
      name
      link
      stakes {
        id
        type
        entity {
          id
        }
        amount
        createdAt
      }
      stakesHistory {
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
     
      # Decision data (votes)
      metadata
      startBlock
      executionBlock
      snapshotBlock
      supportRequiredPct
      minAcceptQuorum
      yea
      nay
      votingPower
      script
      casts {
        id
        entity {
          id
        }
        supports
        stake
        createdAt
      }
    }
  }
`

export const ALL_STAKE_HISTORY = (type: string) => gql`
  ${type} StakeHistory($first: Int!, $skip: Int!, $entity: Bytes) {
    stakeHistories(where: { entity: $entity }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      type
      entity
      proposal {
        id
        number
        type
        name
        status
        metadata
      }
      tokensStaked
      totalTokensStaked
      conviction
      time      # Block at which was created
      createdAt # Timestamp at which was created
    }
  }
`

export const SUPPORTER = (type: string) => gql`
  ${type} Supporter($id: string) {
    supporter(id: $id) {
      id
      address
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
        }
        createdAt

      }
      # proposals stakes
      stakes(orderBy: cratedAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          name
        }
        amount 
        createdAt
      }
      # proposal stakes history
      stakesHistory(orderBy: cratedAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          name
        }
        totalTokensStaked
        conviction
        time
        createdAt
      }
    }
  }
`
