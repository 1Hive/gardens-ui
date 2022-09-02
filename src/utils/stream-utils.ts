/******* TIME CONSTANTS *******/
export const MONTHS_PER_YEAR = 12
export const DAYS_PER_MONTH = 30
export const DAYS_PER_WEEK = 7
export const HOURS_PER_DAY = 24
export const MINUTES_PER_HOUR = 60
export const MINUTE_IN_SECONDS = 60
export const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * MINUTES_PER_HOUR
export const DAY_IN_SECONDS = HOUR_IN_SECONDS * HOURS_PER_DAY
export const WEEK_IN_SECONDS = DAY_IN_SECONDS * DAYS_PER_WEEK
export const MONTH_IN_SECONDS = DAY_IN_SECONDS * DAYS_PER_MONTH
export const YEAR_IN_SECONDS = MONTH_IN_SECONDS * MONTHS_PER_YEAR // NOTE: Is 360 days (misses 5-6 days)
export const BASE_18 = 1e18

/**
 * Gets daily, weekly, monthly and yearly flowed amounts given a per second flow rate.
 * @param perSecondFlowRate
 * @returns
 */
export const getFlowAmountByPerSecondFlowRate = (perSecondFlowRate: string) => {
  const decimalFlowRate = Number(perSecondFlowRate) / BASE_18
  return {
    daily: Math.round(decimalFlowRate * DAY_IN_SECONDS).toString(),
    weekly: Math.round(decimalFlowRate * WEEK_IN_SECONDS).toString(),
    monthly: Math.round(decimalFlowRate * MONTH_IN_SECONDS).toString(),
    yearly: Math.round(decimalFlowRate * YEAR_IN_SECONDS).toString(),
  }
}
