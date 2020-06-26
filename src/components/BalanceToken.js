import React from 'react'
import styled from 'styled-components'

import { GU, tokenIconUrl } from '@1hive/1hive-ui'

import { formatTokenAmount } from '../lib/token-utils'
import { ETHER_TOKEN_VERIFIED_BY_SYMBOL } from '../lib/verified-tokens'
import { getNetwork } from '../networks'

const splitAmount = amount => {
  const [integer, fractional] = formatTokenAmount(amount).split('.')
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

const BalanceToken = ({ amount, symbol, color, size, icon }) => {
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
      {amount !== undefined ? splitAmount(amount.toFixed(3)) : ' - '}
      {symbol || ''}
    </div>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '20', height: '20' })`
  margin-right: ${1 * GU}px;
`

export default BalanceToken
