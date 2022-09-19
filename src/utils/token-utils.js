import { addressesEqual } from '@1hive/1hive-ui'
import { useAppTheme } from '@/providers/AppTheme'
import { round } from './math-utils'

const LOCAL_STABLE_ICONS = ['DAI', 'XDAI', 'WXDAI', 'USDC', 'USDT', 'LUSD']

const LOCAL_TOKEN_ICONS = new Map([
  ['HNY', '/icons/base/honey.svg'],
  ['HNYT', '/icons/base/honey.svg'],
  ['DAI', '/icons/base/stable-token.svg'],
  ['XDAI', '/icons/base/stable-token.svg'],
  ['WXDAI', '/icons/base/stable-token.svg'],
])

export function getGardenTokenIcon(garden, token, appearance) {
  const tokenLogo =
    appearance === 'light'
      ? garden.token.logo
      : garden.token.logoDark || garden.token.logo

  if (garden) {
    if (addressesEqual(garden.token.id, token.id)) {
      // return garden.token.logo || '/defaultTokenLogo.svg'
      return tokenLogo || defaultTokenSvg
    }

    if (addressesEqual(garden.wrappableToken?.id, token.id)) {
      return garden.wrappableToken.logo || '/defaultTokenLogo.svg'
    }
  }

  // Look up in the local mapping
  return getLocalTokenIconBySymbol(token.symbol)
}

export function isStableToken(token) {
  return LOCAL_STABLE_ICONS.includes(token.symbol)
}

export function getLocalTokenIconBySymbol(symbol) {
  return LOCAL_TOKEN_ICONS.get(symbol) || '/defaultTokenLogo.svg'
}

export function formatDecimals(value, digits) {
  try {
    return value.toLocaleString('en-US', {
      style: 'decimal',
      maximumFractionDigits: digits,
    })
  } catch (err) {
    if (err.name === 'RangeError') {
      // Fallback to Number.prototype.toString()
      // if the language tag is not supported.
      return value.toString()
    }
    throw err
  }
}

export function formatTokenAmount(
  amount,
  decimals = 0,
  isIncoming,
  displaySign = false,
  { rounding = 2, commas = true, replaceZeroBy = '0' } = {}
) {
  const roundedAmount = round(amount / Math.pow(10, decimals), rounding)
  const formattedAmount = formatDecimals(roundedAmount, 18)

  if (formattedAmount === '0') {
    return replaceZeroBy
  }

  return (
    (displaySign ? (isIncoming ? '+' : '-') : '') +
    (commas ? formattedAmount : formattedAmount.replace(',', ''))
  )
}

export async function getUserBalanceAt(
  connectedAccount,
  snapshotBlock,
  tokenContract,
  tokenDecimals
) {
  if (!tokenContract || !connectedAccount) {
    return -1
  }

  const balance = await tokenContract.balanceOfAt(
    connectedAccount,
    snapshotBlock
  )

  return Math.floor(parseInt(balance, 10) / Math.pow(10, tokenDecimals))
}

export async function getUserBalanceNow(
  connectedAccount,
  tokenContract,
  tokenDecimals
) {
  if (!tokenContract || !connectedAccount) {
    return -1
  }

  const balance = await tokenContract.balanceOf(connectedAccount)

  return Math.floor(parseInt(balance, 10) / Math.pow(10, tokenDecimals))
}
