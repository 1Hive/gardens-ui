import actions from '../../actions/garden-action-types'

import {
  ADD_FUNDS,
  APPROVE_TOKEN,
  CANCEL_PROPOSAL,
  CHALLENGE_ACTION,
  CLAIM_REWARDS,
  DISPUTE_ACTION,
  EXECUTE_ADJUSTMENT,
  EXECUTE_DECISION,
  EXECUTE_PROPOSAL,
  NEW_DECISION,
  NEW_PROPOSAL,
  NEW_SIGNALING_PROPOSAL,
  RESOLVE_ACTION,
  SETTLE_ACTION,
  SIGN_AGREEMENT,
  STAKE_TO_PROPOSAL,
  UNWRAP_TOKEN,
  UPDATE_PRICE_ORACLE,
  VOTE_ON_DECISION,
  WITHDRAW_FUNDS,
  WITHDRAW_FROM_PROPOSAL,
  WRAP_TOKEN,
} from '@/utils/asset-utils'

// The different types of activity
const ACTIVITY_TYPES = {
  [actions.ADD_FUNDS]: {
    icon: ADD_FUNDS,
    title: 'Add funds to deposit manager',
  },
  [actions.APPROVE_TOKEN]: {
    icon: APPROVE_TOKEN,
    title: 'Approve token amount',
  },
  [actions.CANCEL_PROPOSAL]: {
    icon: CANCEL_PROPOSAL,
    title: 'Cancel proposal',
  },
  [actions.CHALLENGE_ACTION]: {
    icon: CHALLENGE_ACTION,
    title: 'Challenge proposal',
  },
  [actions.CLAIM_REWARDS]: {
    icon: CLAIM_REWARDS,
    title: 'Claim earned rewards',
  },
  [actions.DISPUTE_ACTION]: {
    icon: DISPUTE_ACTION,
    title: 'Dispute proposal',
  },
  [actions.EXECUTE_ADJUSTMENT]: {
    title: 'Execute issuance',
    icon: EXECUTE_ADJUSTMENT,
  },
  [actions.EXECUTE_DECISION]: {
    title: 'Execute decision',
    icon: EXECUTE_DECISION,
  },
  [actions.EXECUTE_PROPOSAL]: {
    title: 'Execute proposal',
    icon: EXECUTE_PROPOSAL,
  },
  [actions.NEW_DECISION]: {
    title: 'New decision creation',
    icon: NEW_DECISION,
  },
  [actions.NEW_PROPOSAL]: {
    title: 'New proposal creation',
    icon: NEW_PROPOSAL,
  },
  [actions.NEW_SIGNALING_PROPOSAL]: {
    icon: NEW_SIGNALING_PROPOSAL,
    title: 'New signaling proposal creation',
  },
  [actions.RESOLVE_ACTION]: {
    title: 'Resolve dispute',
    icon: RESOLVE_ACTION,
  },
  [actions.SETTLE_ACTION]: {
    title: 'Settle challenge',
    icon: SETTLE_ACTION,
  },
  [actions.SIGN_AGREEMENT]: {
    title: 'Sign covenant',
    icon: SIGN_AGREEMENT,
  },
  [actions.STAKE_TO_PROPOSAL]: {
    title: 'Support proposal',
    icon: STAKE_TO_PROPOSAL,
  },
  [actions.UNWRAP_TOKEN]: {
    title: 'Unwrap token',
    icon: UNWRAP_TOKEN,
  },
  [actions.UPDATE_PRICE_ORACLE]: {
    icon: UPDATE_PRICE_ORACLE,
    title: 'Update Price Oracle',
  },
  [actions.VOTE_ON_DECISION]: {
    icon: VOTE_ON_DECISION,
    title: 'Vote on decision',
  },
  [actions.WITHDRAW_FUNDS]: {
    icon: WITHDRAW_FUNDS,
    title: 'Withdraw funds from deposit manager',
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: {
    icon: WITHDRAW_FROM_PROPOSAL,
    title: 'Withdraw support from proposal',
  },
  [actions.WRAP_TOKEN]: {
    icon: WRAP_TOKEN,
    title: 'Wrap token',
  },
}

export function getActivityData(type) {
  return ACTIVITY_TYPES[type]
}
