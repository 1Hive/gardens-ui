import { useEffect, useState } from 'react'
import { getMarketDetails, getTokenReserves } from '@1hive/uniswap-sdk'
import { useWallet } from '../providers/Wallet'
import BigNumber from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'

const UNISWAP_PRECISION = 18
const UNISWAP_MARKET_RETRY_EVERY = 1000

async function getTokenMarketDetails(tokenAddress, provider) {
  const tokenReserves = await getTokenReserves(tokenAddress, provider)

  // For XDAI we must pass undefined
  return getMarketDetails(undefined, tokenReserves)
}

/**
 * @dev Tokens can only be bought in Uniswap for now so we'll get the Token <> XDAI market details
 * Convert Token amount into USD price
 * @param {BigNum} amount The amount to convert to USD
 * @param {Object} token The token in question
 * @returns {String} The amount value in USD
 */
export function useTokenBalanceToUsd(amount, token) {
  const { ethers } = useWallet()
  const [convertedAmount, setConvertedAmount] = useState('-')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!amount || amount.eq(0)) {
      return
    }

    const updateConvertedAmount = async () => {
      try {
        const { marketRate } = await getTokenMarketDetails(token.id, ethers)

        const precision = new BigNumber(10).pow(UNISWAP_PRECISION)

        const rate = new BigNumber(
          marketRate.rateInverted.times(precision).toFixed(0)
        )

        const convertedAmount = formatTokenAmount(
          amount.times(rate).div(precision),
          token.decimals
        )

        if (!cancelled) {
          setConvertedAmount(convertedAmount)
        }
      } catch (err) {
        console.error(`Could not fetch Uniswap price for ${token.name}`, err)
        if (!cancelled) {
          retryTimer = setTimeout(
            updateConvertedAmount,
            UNISWAP_MARKET_RETRY_EVERY
          )
        }
      }
    }

    updateConvertedAmount()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [amount, ethers, token])

  return convertedAmount
}
