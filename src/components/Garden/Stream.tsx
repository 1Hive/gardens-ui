import React from 'react'
import styled from 'styled-components'
import { GU } from '@1hive/1hive-ui'

type StreamProps = {
  flowRateConvertions: {
    daily: string
    weekly: string
    monthly: string
    yearly: string
  }
  decimals: number
  symbol: string
  icon: string
  verified?: any
  color?: any
  size?: any
}

// TODO: allow to chose monthly, daily, etc
function Stream({
  flowRateConvertions,
  decimals,
  symbol,
  icon,
  verified,
  color,
  size,
}: StreamProps) {
  return (
    <section>
      <div
        css={`
          display: flex;
          align-items: center;
          color: ${color};
          ${size}
        `}
      >
        <TokenIcon src={icon} />
        {flowRateConvertions.monthly} {symbol + 'x' || ''} per month
      </div>
    </section>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '24', height: '24' })`
  margin-right: ${1 * GU}px;
`

export default Stream
