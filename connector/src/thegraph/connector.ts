import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'

import { IHoneypotConnector, SubscriptionHandler } from '../types'
import ArbitratorFee from '../models/ArbitratorFee'
import CollateralRequirement from '../models/CollateralRequirement'
import Config from '../models/Config'
import Proposal from '../models/Proposal'
import Supporter from '../models/Supporter'
import * as queries from './queries'
import { parseArbitratorFee, parseCollateralRequirement, parseConfig, parseProposal, parseProposals, parseSupporter  } from './parsers'

const BLOCK_TIMES = new Map([
  [1, 13],  // mainnet
  [4, 14],  // rinkeby
  [100, 5], // xdai 
])

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot'
  }
  return null
}

export function pollIntervalFromChainId(chainId: number) {
  const blockTime = BLOCK_TIMES.get(chainId)
  return blockTime ? blockTime * 1000 : null
}

type HoneypotConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}


export default class HoneypotConnectorTheGraph
  implements IHoneypotConnector {
  #gql: GraphQLWrapper

  constructor(config: HoneypotConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error(
        'Honeypot connector requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect() {
    this.#gql.close()
  }

  
  async config(id: string): Promise<Config> {
    return this.#gql.performQueryWithParser(
      queries.CONFIG('query'),
      { id },
      (result: QueryResult) => parseConfig(result, this)
    )
  }

  onConfig(id: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.CONFIG('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseConfig(result, this)
    )
  }

  async proposal(
    id: string,
  ): Promise<Proposal> {
    return this.#gql.performQueryWithParser(
      queries.PROPOSAL('query'),
      { id },
      (result: QueryResult) => parseProposal(result, this)
    )
  }

  onProposal(
    id: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.PROPOSAL('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseProposal(result, this)
    )
  }
  
  async proposals(
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string
  ): Promise<Proposal[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_PROPOSALS('query'),
      { first, skip, orderBy, orderDirection, proposalTypes: types, statuses, metadata },
      (result: QueryResult) => parseProposals(result, this)
    )
  }

  onProposals(
    first: number,
    skip: number,
    orderBy: string, 
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_PROPOSALS('subscription'),
      { first, skip, orderBy, orderDirection, proposalTypes: types, statuses, metadata },
      callback,
      (result: QueryResult) => parseProposals(result, this)
    )
  }

  async supporter(id: string): Promise<Supporter> {
    return this.#gql.performQueryWithParser(
      queries.SUPPORTER('query'),
      { id },
      (result: QueryResult) => parseSupporter(result, this)
    )
  }

  onSupporter(
    id: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.SUPPORTER('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseSupporter(result, this)
    )
  }

  async collateralRequirement(proposalId: string): Promise<CollateralRequirement> {
    return this.#gql.performQueryWithParser<CollateralRequirement>(
      queries.COLLATERAL_REQUIREMENT('query'),
      { proposalId },
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  onCollateralRequirement(
    proposalId: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<CollateralRequirement>(
      queries.COLLATERAL_REQUIREMENT('subscription'),
      { proposalId },
      callback,
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  async arbitratorFee(arbitratorFeeId: string): Promise<ArbitratorFee | null> {
    return this.#gql.performQueryWithParser<ArbitratorFee | null>(
      queries.ARBITRATOR_FEE('query'),
      { arbitratorFeeId },
      (result: QueryResult) => parseArbitratorFee(result, this)
    )
  }

  onArbitratorFee(
    arbitratorFeeId: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<ArbitratorFee | null>(
      queries.ARBITRATOR_FEE('subscription'),
      { arbitratorFeeId },
      callback,
      (result: QueryResult) => parseArbitratorFee(result, this)
    )
  }
}
