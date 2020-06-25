import React from 'react'
import BalanceToken from './BalanceToken'
import { round } from '../lib/math-utils'

function Balance(props) {
  const { amount = 0, decimals, symbol, icon, verified, color, size } = props

  const adjustedAmount = amount / Math.pow(10, decimals)

  return (
    <section>
      <BalanceToken
        amount={round(parseFloat(adjustedAmount), 5)}
        symbol={symbol}
        verified={verified}
        color={color}
        size={size}
        icon={icon}
      />
    </section>
  )
}

export default Balance
