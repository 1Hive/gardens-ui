export const toPercentage = value => value * 100

export const fromPercentage = pct => pct / 100

export const calculateDecay = halflifeDays => (1 / 2) ** (1 / halflifeDays)

export const calculateConviction = (initialConviction, amount, time, decay) =>
  initialConviction * decay ** time +
  (amount * (1 - decay ** time)) / (1 - decay)

export const calculateMaxConviction = (amount, decay) => amount / (1 - decay)

export const calculateThreshold = (weight, maxRatioPct, requestedAmountPct) => {
  const maxRatio = fromPercentage(maxRatioPct)
  const requestedAmount = fromPercentage(requestedAmountPct)

  return requestedAmount <= maxRatio
    ? weight / (maxRatio - requestedAmount) ** 2
    : Number.POSITIVE_INFINITY
}

export const calculateWeight = (minThresholdPct, maxRatioPct) => {
  const minThreshold = fromPercentage(minThresholdPct)
  const maxRatio = fromPercentage(maxRatioPct)

  return minThreshold * maxRatio ** 2
}

export const generateElements = (maxElement, increment) =>
  [...Array(parseInt(maxElement / increment) + 1).keys()].map(
    i => i * increment
  )
