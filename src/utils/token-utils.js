import { round } from './math-utils'
import defaultTokenSvg from '@assets/defaultTokenLogo.svg'
import honeyIconSvg from '@assets/honey.svg'
import stableTokenSvg from '@assets/stable-token.svg'

const ANT_MAINNET_TOKEN_ADDRESS = '0x960b236A07cf122663c4303350609A66A7B288C0'
const DAI_MAINNET_TOKEN_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

// "Important" tokens the Finance app should prioritize
const PRESET_TOKENS = new Map([
  [
    'main',
    [
      ETHER_TOKEN_FAKE_ADDRESS,
      ANT_MAINNET_TOKEN_ADDRESS,
      DAI_MAINNET_TOKEN_ADDRESS,
    ],
  ],
])

// Some known tokens don’t strictly follow ERC-20 and it would be difficult to
// adapt to every situation. The data listed in this map is used as a fallback
// if either some part of their interface doesn't conform to a standard we
// support.
const KNOWN_TOKENS_FALLBACK = new Map([
  [
    'main',
    new Map([
      [
        DAI_MAINNET_TOKEN_ADDRESS,
        { symbol: 'DAI', name: 'Dai Stablecoin v1.0', decimals: '18' },
      ],
    ]),
  ],
])

const LOCAL_TOKEN_ICONS = new Map([
  ['HNY', honeyIconSvg],
  ['HNYT', honeyIconSvg],
  ['DAI', stableTokenSvg],
  ['XDAI', stableTokenSvg],
])

export const tokenDataFallback = (tokenAddress, fieldName, networkType) => {
  // The fallback list is without checksums
  const addressWithoutChecksum = tokenAddress.toLowerCase()

  const fallbacksForNetwork = KNOWN_TOKENS_FALLBACK.get(networkType)
  if (
    fallbacksForNetwork == null ||
    !fallbacksForNetwork.has(addressWithoutChecksum)
  ) {
    return null
  }
  return fallbacksForNetwork.get(addressWithoutChecksum)[fieldName] || null
}

export function getPresetTokens(networkType) {
  return PRESET_TOKENS.get(networkType) || [ETHER_TOKEN_FAKE_ADDRESS]
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

export function getTokenIconBySymbol(symbol) {
  return LOCAL_TOKEN_ICONS.get(symbol) || defaultTokenSvg
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
