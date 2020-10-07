import Config from './Config'
import Proposal from './Proposal'
import Supporter from './Supporter'
import {
  Address,
  ALL_PROPOSAL_STATUSES,
  ALL_PROPOSAL_TYPES,
  IHoneypotConnector,
  SubscriptionHandler, 
} from '../types'
import { buildProposalId } from '../helpers'

export default class Honeypot {
  #address: Address
  #connector: IHoneypotConnector

  constructor(connector: IHoneypotConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  config(): Promise<Config> {
    return this.#connector.config(this.#address)
  } 
  
  onConfig(callback: Function): SubscriptionHandler {
    return this.#connector.onConfig(this.#address, callback)
  }

  async proposal({ number = '', appAddress = '' } = {}): Promise<Proposal> {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.proposal(proposalId)
  }

  onProposal({ number = '', appAddress = ''  } = {}, callback: Function): SubscriptionHandler {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.onProposal(number, callback)
  }
  
  async proposals(
    { 
      first = 1000,
      skip = 0,
      orderBy = 'createdAt',
      orderDirection = 'desc',
      types = ALL_PROPOSAL_TYPES,
      statuses = ALL_PROPOSAL_STATUSES
    } = {}): Promise<Proposal[]> {
    return this.#connector.proposals(first, skip, orderBy, orderDirection, types, statuses)
  }

  onProposals(
    { 
      first = 1000,
      skip = 0, 
      orderBy = 'createdAt', 
      orderDirection = 'desc', 
      types = ALL_PROPOSAL_TYPES, 
      statuses = ALL_PROPOSAL_STATUSES
    } = {},
    callback: Function
  ): SubscriptionHandler {
    return this.#connector.onProposals(first, skip, orderBy, orderDirection, types, statuses, callback)
  }
  
  async supporter({ id = '' } = {}): Promise<Supporter> {
    return this.#connector.supporter(id)
  }

  onSupporter(
    { id = '' } = {},
    callback: Function
  ): SubscriptionHandler {
    return this.#connector.onSupporter(id, callback)
  }
}
