import Config from './Config'
import Proposal from './Proposal'
import Supporter from './Supporter'
import {
  IHoneypotConnector,
  Address,
  SubscriptionHandler,
} from '../types'

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
  
  async proposals({ first = 1000, skip = 0 } = {}): Promise<Proposal[]> {
    return this.#connector.proposals(first, skip)
  }

  onProposals(
    { first = 1000, skip = 0 } = {},
    callback: Function
  ): SubscriptionHandler {
    return this.#connector.onProposals(first, skip, callback)
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
