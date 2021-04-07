import { QueryResult } from '@aragon/connect-thegraph'

import ArbitratorFee from '../../models/ArbitratorFee'

export function parseArbitratorFee(
  result: QueryResult,
  connector: any
): ArbitratorFee | null {
  const arbitratorFee = result.data.arbitratorFee

  if (!arbitratorFee) {
    return null
  }

  return new ArbitratorFee(
    {
      id: arbitratorFee.id,
      proposalId: arbitratorFee.proposal.id,
      tokenId: arbitratorFee.token.id,
      tokenDecimals: arbitratorFee.token.decimals,
      tokenSymbol: arbitratorFee.token.symbol,
      amount: arbitratorFee.amount
    },
    connector
  )
}
