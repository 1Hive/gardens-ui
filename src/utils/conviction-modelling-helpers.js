import { DAY_IN_HOURS } from '@/utils/kit-utils'

export const toPercentage = value => value * 100

export const fromPercentage = pct => pct / 100

export const calculateDecay = halflifeHours =>
  (1 / 2) ** (1 / (halflifeHours / DAY_IN_HOURS))

export const calculateWeight = (minThreshold, maxRatio) =>
  minThreshold * maxRatio ** 2

export const calculateConviction = (initialConviction, amount, time, decay) =>
  initialConviction * decay ** time +
  (amount * (1 - decay ** time)) / (1 - decay)

export const calculateMaxConviction = (amount, decay) => amount / (1 - decay)

export const calculateThreshold = (weight, maxRatio, requestedAmount) =>
  requestedAmount <= maxRatio
    ? weight / (maxRatio - requestedAmount) ** 2
    : Number.POSITIVE_INFINITY
