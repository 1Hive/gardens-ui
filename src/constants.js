import { bigNum } from './lib/bigNumber'

export const PROPOSAL_STATUS_ACTIVE_STRING = 'Active'
export const PROPOSAL_STATUS_CANCELLED_STRING = 'Cancelled'
export const PROPOSAL_STATUS_EXECUTED_STRING = 'Executed'

export const PROPOSAL_STATUS_CANCELLED = 3

export const PROPOSAL_SUPPORT_SUPPORTED = 1
export const PROPOSAL_SUPPORT_NOT_SUPPORTED = 2

export const STAKE_PCT_BASE = bigNum(1)
export const QUICK_STAKE_PCT = bigNum(5, 16)

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'
