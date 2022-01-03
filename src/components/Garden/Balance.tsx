import React from 'react'
import BalanceToken from '../BalanceToken'
import BigNumber from '@lib/bigNumber'

type BalanceProps = {
  amount: BigNumber
  decimals: number
  symbol: string
  icon: string
  verified: any
  color: any
  size: any
}

function Balance({
  amount,
  decimals,
  symbol,
  icon,
  verified,
  color,
  size,
}: BalanceProps) {
  return (
    <section>
      <BalanceToken
        amount={amount}
        color={color}
        decimals={decimals}
        icon={icon}
        size={size}
        symbol={symbol}
        verified={verified}
      />
    </section>
  )
}

export default Balance
