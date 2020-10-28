import { ConfigData, ConvictionConfigData, IHoneypotConnector, VotingConfigData } from '../types'

export default class Config {
  #connector: IHoneypotConnector

  readonly id: string
  readonly conviction: ConvictionConfigData
  readonly voting: VotingConfigData


  constructor(data: ConfigData, connector: IHoneypotConnector) {
    this.#connector = connector

    this.id = data.id
    this.conviction = data.conviction
    this.voting = data.voting
  }
}