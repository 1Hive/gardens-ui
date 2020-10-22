import React from 'react'
import styled from 'styled-components'

import { GU, tokenIconUrl } from '@1hive/1hive-ui'

import { formatTokenAmount } from '../utils/token-utils'
import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from '../lib/verified-tokens'
import { getNetwork } from '../networks'

const splitAmount = (amount, decimals) => {
  const [integer, fractional] = formatTokenAmount(amount, decimals).split('.')
  return (
    <span
      css={`
        margin-right: ${0.5 * GU}px;
      `}
    >
      <span>{integer}</span>
      {fractional && <span className="fractional">.{fractional}</span>}
    </span>
  )
}

const BalanceToken = ({ amount, color, decimals, icon, size, symbol }) => {
  const network = getNetwork()
  const tokenAddress =
    symbol && ETHER_TOKEN_VERIFIED_BY_SYMBOL.get(symbol.toUpperCase())
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        color: ${color};
        ${size}
      `}
    >
      <TokenIcon
        src={
          icon || tokenIconUrl(tokenAddress, symbol, network && network.type)
        }
      />
      {amount !== undefined && amount !== null
        ? splitAmount(amount, decimals)
        : ' - '}
      {symbol || ''}
    </div>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '24', height: '24' })`
  margin-right: ${1 * GU}px;
`

export default BalanceToken
