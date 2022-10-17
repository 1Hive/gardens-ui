import React from 'react'
import styled from 'styled-components'
import { GU } from '@1hive/1hive-ui'

type StreamProps = {
  currentRate?: {
    daily: string
    weekly: string
    monthly: string
    yearly: string
  }
  targetRate: {
    daily: string
    weekly: string
    monthly: string
    yearly: string
  }
  decimals: number
  symbol: string
  icon: string
}

// TODO: allow to chose monthly, daily, etc
export function Stream({
  currentRate,
  targetRate,
  decimals,
  symbol,
  icon,
}: StreamProps) {
  return (
    <section>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <TokenIcon src={icon} />
        {currentRate?.monthly} {symbol} per month with a cap of{' '}
        {targetRate?.monthly}
      </div>
    </section>
  )
}

export function StreamRequest({
  targetRate,
  decimals,
  symbol,
  icon,
}: StreamProps) {
  return (
    <section>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <TokenIcon src={icon} />
        {targetRate?.monthly} {symbol} per month
      </div>
    </section>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '24', height: '24' })`
  margin-right: ${1 * GU}px;
`
