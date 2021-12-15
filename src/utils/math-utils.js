import BigNumber from '@lib/bigNumber'

/**
 * Generic round function, see:
 *  - https://stackoverflow.com/a/18358056/1375656
 *  - https://stackoverflow.com/a/19722641/1375656
 *
 * Fixed for NaNs on really small values
 *
 * @param {number} num Number to round
 * @param {number} [places=2] Number of places to round to
 * @returns {number} Rounded number
 */
export function round(num, places = 2) {
  const rounded = Number(Math.round(num + 'e+' + places) + 'e-' + places)
  return Number.isNaN(rounded) ? Number(num.toFixed(places)) : rounded
}

/**
 * Get the whole and decimal parts from a number.
 * Trims leading and trailing zeroes.
 *
 * @param {string} num the number
 * @returns {Array<string>} array with the [<whole>, <decimal>] parts of the number
 */
export function splitDecimalNumber(num) {
  const [whole = '', dec = ''] = num.split('.')
  return [
    whole.replace(/^0*/, ''), // trim leading zeroes
    dec.replace(/0*$/, ''), // trim trailing zeroes
  ]
}
/**
 * Format a decimal-based number back to a normal number
 *
 * @param {string} num the number
 * @param {number} decimals number of decimal places
 * @param {Object} [options] options object
 * @param {bool} [options.truncate=true] Should the number be truncated to its decimal base
 * @returns {string} formatted number
 */
export function fromDecimals(num, decimals, { truncate = true } = {}) {
  const [whole, dec] = splitDecimalNumber(num)
  if (!whole && !dec) {
    return '0'
  }

  const paddedWhole = whole.padStart(decimals + 1, '0')
  const decimalIndex = paddedWhole.length - decimals
  const wholeWithoutBase = paddedWhole.slice(0, decimalIndex)
  const decWithoutBase = paddedWhole.slice(decimalIndex)

  if (!truncate && dec) {
    // We need to keep all the zeroes in this case
    return `${wholeWithoutBase}.${decWithoutBase}${dec}`
  }

  // Trim any trailing zeroes from the new decimals
  const decWithoutBaseTrimmed = decWithoutBase.replace(/0*$/, '')
  if (decWithoutBaseTrimmed) {
    return `${wholeWithoutBase}.${decWithoutBaseTrimmed}`
  }

  return wholeWithoutBase
}

/**
 * Format the number to be in a given decimal base
 *
 * @param {string} num the number
 * @param {number} decimals number of decimal places
 * @param {Object} [options] options object
 * @param {bool} [options.truncate=true] Should the number be truncated to its decimal base
 * @returns {string} formatted number
 */
export function toDecimals(num, decimals, { truncate = true } = {}) {
  const [whole, dec] = splitDecimalNumber(num)
  if (!whole && !dec) {
    return '0'
  }

  const wholeLengthWithBase = whole.length + decimals
  const withoutDecimals = (whole + dec).padEnd(wholeLengthWithBase, '0')
  const wholeWithBase = withoutDecimals.slice(0, wholeLengthWithBase)

  if (!truncate && wholeWithBase.length < withoutDecimals.length) {
    return `${wholeWithBase}.${withoutDecimals.slice(wholeLengthWithBase)}`
  }
  return wholeWithBase
}

/**
 * Calculates and returns stakes as percentages, adding a “rest” percentage for
 * values that are not included.
 *
 * @param {Array<BN>} amounts the amounts to be converted in percentages
 * @param {Object} [options] options object
 * @param {BN} [options.total] the total amount, defaults to the sum of the given amounts
 * @param {number} [options.maxIncluded] the max count of items to include in the result, defaults
 *                                       to the length of the given amounts
 * @return {Array<Object>} an array of objects where:
 *   - `index` is the original index in `amounts`, or -1 if it’s the “rest”
 *   - `amount` is the original amount provided
 *   - `percentage` is the calculated percentage, as a number between 0 and 100
 */
export function stakesPercentages(
  amounts,
  { total = new BigNumber(-1), maxIncluded = amounts.length } = {}
) {
  if (total.eq(-1)) {
    total = amounts.reduce(
      (total, value) => total.plus(value),
      new BigNumber(0)
    )
  }

  // percentage + two digits (only to sort them by closest to the next integer)
  const pctPrecision = 10000

  // Calculate the percentages of all the stakes
  const stakes = amounts
    .filter(amount => !amount.isZero())
    .map((amount, index) => ({
      amount,
      index,
      percentage: amount.multipliedBy(pctPrecision).div(total),
    }))
    .sort((a, b) => b.percentage.comparedTo(a.percentage))

  // convert the percentage back to a number
  const stakePercentageAsNumber = stake => ({
    ...stake,
    percentage: parseFloat(
      (stake.percentage.toNumber() / pctPrecision) * 100
    ).toFixed(2),
  })

  // Add the “Rest” item
  const addRest = (stakes, percentage, amount) => [
    ...stakes,
    { index: -1, percentage, amount },
  ]

  const addCalculatedRest = (includedStakes, excludedStakes) =>
    addRest(
      includedStakes,
      excludedStakes.reduce(
        (total, stake) => total.plus(stake.percentage),
        new BigNumber(0)
      ),
      excludedStakes.reduce(
        (total, stake) => total.plus(stake.amount),
        new BigNumber(0)
      )
    )

  const hasRest = amounts.length > maxIncluded

  // the stakes to be included (not adjusted yet)
  const includedStakes = (hasRest
    ? addCalculatedRest(
        stakes.slice(0, maxIncluded - 1),
        stakes.slice(maxIncluded - 1)
      )
    : stakes
  ).map(stakePercentageAsNumber)

  // Check if there is any 0% item in the list
  const firstZeroIndex = includedStakes.findIndex(
    ({ percentage }) => percentage === 0
  )

  if (firstZeroIndex === -1) {
    return includedStakes
  }

  // Remove the 0% items and group them in a “Rest” item.
  return hasRest
    ? // A “Rest” item already exists, we can remove the 0% items.
      includedStakes.slice(0, firstZeroIndex)
    : // A “Rest” item needs to be added and can not be zero,
      // so we replace the first non-zero percentage by “Rest”.
      addRest(
        includedStakes.slice(0, firstZeroIndex - 1),
        includedStakes[firstZeroIndex - 1].percentage,
        includedStakes[firstZeroIndex - 1].amount
      )
}

export function pct(a, b) {
  if (b.eq(new BigNumber(0))) {
    return 0
  }

  return (a * 100) / b
}

// Return 0 if denominator is 0 to avoid NaNs
export function safeDiv(num, denom) {
  return denom ? num / denom : 0
}

export function safeDivBN(num, denom) {
  return denom.gt(0) ? num.div(denom) : new BigNumber(0)
}

/**
 * Normalizes a number from another range into a value between 0 and 1.
 *
 * Identical to map(value, low, high, 0, 1)
 * Numbers outside the range are not clamped to 0 and 1, because out-of-range
 * values are often intentional and useful.
 *
 * From Processing.js
 *
 * @param {Number} aNumber The incoming value to be converted
 * @param {Number} low Lower bound of the value's current range
 * @param {Number} high Upper bound of the value's current range
 * @returns {Number} Normalized number
 */
export function norm(aNumber, low, high) {
  return (aNumber - low) / (high - low)
}
