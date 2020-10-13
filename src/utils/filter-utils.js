import {
  PROPOSAL_SUPPORT_NOT_SUPPORTED,
  PROPOSAL_SUPPORT_SUPPORTED,
} from '../constants'

export const NULL_FILTER_STATE = 0
export const STATUS_FILTER_OPEN = 1
export const STATUS_FILTER_CLOSED = 2
export const STATUS_FILTER_REMOVED = 3
export const SUPPORT_FILTER_SUPPORTED = 1
export const SUPPORT_FILTER_NOT_SUPPORTED = 2
export const TYPE_FILTER_SUGGESTION = 1
export const TYPE_FILTER_PROPOSAL = 2
export const TYPE_FILTER_DECISION = 3
export const RANKING_FILTER_TOP = 0
export const RANKING_FILTER_NEW = 1

export const filterArgsMapping = {
  ranking: {
    queryKey: 'orderBy',
    [RANKING_FILTER_TOP]: 'convictionLast',
    [RANKING_FILTER_NEW]: 'createdAt',
  },
  status: {
    queryKey: 'statuses',
    [STATUS_FILTER_OPEN]: [0],
    [STATUS_FILTER_CLOSED]: [2],
    [STATUS_FILTER_REMOVED]: [1],
  },
  type: {
    queryKey: 'types',
    [TYPE_FILTER_SUGGESTION]: [0],
    [TYPE_FILTER_PROPOSAL]: [1],
    [TYPE_FILTER_DECISION]: [2],
  },
}

export const STATUS_ITEMS = ['All', 'Open', 'Closed', 'Removed']
export const SUPPORT_ITEMS = ['All', 'Supported', 'Not Supported']
export const TYPE_ITEMS = ['All', 'Suggestion', 'Proposal', 'Decision']
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
