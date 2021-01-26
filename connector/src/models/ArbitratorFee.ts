import { formatBn } from '../helpers'
import { ArbitratorFeeData, IHoneypotConnector } from '../types'

export default class ArbitratorFee {
  #connector: IHoneypotConnector

  readonly id: string
  readonly tokenId: string
  readonly tokenDecimals: string
  readonly tokenSymbol: string
  readonly amount: string

  constructor(
    data: ArbitratorFeeData,
    connector: IHoneypotConnector
  ) {
    this.#connector = connector

    this.id = data.id
    this.tokenId = data.tokenId
    this.tokenDecimals = data.tokenDecimals
    this.tokenSymbol = data.tokenSymbol
    this.amount = data.amount
  }

  get formattedAmount(): string {
    return formatBn(this.amount, this.tokenDecimals)
  }
}
