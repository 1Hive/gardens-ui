import React from 'react'
import BalanceToken from './BalanceToken'

function Balance({
  amount = 0,
  decimals,
  symbol,
  icon,
  verified,
  color,
  size,
}) {
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
