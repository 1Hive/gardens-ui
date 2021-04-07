import {
  PROPOSAL_SUPPORT_NOT_SUPPORTED,
  PROPOSAL_SUPPORT_SUPPORTED,
} from '../constants'

export const NULL_FILTER_STATE = 0
export const STATUS_FILTER_OPEN = 1
export const STATUS_FILTER_COMPLETED = 2
export const STATUS_FILTER_REMOVED = 3
export const SUPPORT_FILTER_SUPPORTED = 1
export const SUPPORT_FILTER_NOT_SUPPORTED = 2
export const TYPE_FILTER_SUGGESTION = 1
export const TYPE_FILTER_PROPOSAL = 2
export const TYPE_FILTER_DECISION = 3
export const RANKING_FILTER_TOP = 0
export const RANKING_FILTER_NEW = 1

export const filterArgsMapping = {
  name: {
    queryKey: 'metadata',
  },
  ranking: {
    queryKey: 'orderBy',
    [RANKING_FILTER_TOP]: 'weight',
    [RANKING_FILTER_NEW]: 'createdAt',
  },
  status: {
    queryKey: 'statuses',
    [STATUS_FILTER_OPEN]: [0, 3, 4], // Active, Challenged, Disputed
    [STATUS_FILTER_COMPLETED]: [0, 2], // Active, Executed (Active could actually be accepted based on time for votes that are not executable)
    [STATUS_FILTER_REMOVED]: [0, 1, 3, 5, 6], // Cancelled, Challenged, Settled, Rejected (Active and Challenged could actually be rejected/Settled respectively based on time)
  },
  type: {
    queryKey: 'types',
    [TYPE_FILTER_SUGGESTION]: [0],
    [TYPE_FILTER_PROPOSAL]: [1],
    [TYPE_FILTER_DECISION]: [2],
  },
}

export const FILTER_KEY_COUNT = 'count'
export const FILTER_KEY_NAME = 'name'
export const FILTER_KEY_RANKING = 'ranking'
export const FILTER_KEY_STATUS = 'status'
export const FILTER_KEY_SUPPORT = 'support'
export const FILTER_KEY_TYPE = 'type'

export const STATUS_ITEMS = ['All', 'Open', 'Completed', 'Removed']
export const SUPPORT_ITEMS = ['All', 'Supported', 'Not Supported']
export const TYPE_ITEMS = ['All', 'Suggestion', 'Funding', 'Decision']
export const RANKING_ITEMS = ['top', 'new']

export function testSupportFilter(filter, proposalSupportStatus) {
  return (
    filter === NULL_FILTER_STATE ||
    (filter === SUPPORT_FILTER_SUPPORTED &&
      proposalSupportStatus === PROPOSAL_SUPPORT_SUPPORTED) ||
    (filter === SUPPORT_FILTER_NOT_SUPPORTED &&
      proposalSupportStatus === PROPOSAL_SUPPORT_NOT_SUPPORTED)
  )
}

export function testStatusFilter(filter, proposal) {
  if (filter === NULL_FILTER_STATE) {
    return true
  }
  const { statusData } = proposal

  // Open
  if (
    filter === STATUS_FILTER_OPEN &&
    (statusData.open ||
      statusData.pendingExecution ||
      statusData.challenged ||
      statusData.disputed)
  ) {
    return true
  }

  // Completed
  if (
    filter === STATUS_FILTER_COMPLETED &&
    (statusData.accepted || statusData.executed)
  ) {
    return true
  }

  // Removed
  if (
    filter === STATUS_FILTER_REMOVED &&
    (statusData.settled || statusData.rejected || statusData.cancelled)
  ) {
    return true
  }

  return false
}

export function sortProposals(filters, proposals) {
  // When sorting by top we are sorting by lastConviction which is not entirely accurate
  // as conviction on proposals can accrue at different speeds
  if (filters.ranking.filter === RANKING_FILTER_TOP) {
    return proposals.sort(
      (p1, p2) => p2.currentConviction - p1.currentConviction
    )
  }

  return proposals
}
