import actions from '../../actions/garden-action-types'

import GARDEN_LOGO from '@assets/gardensLogo.svg' // WE NEED SOME ICONS FOR DIFERENT ACTIONS

// The different types of activity
const ACTIVITY_TYPES = {
  [actions.ADD_FUNDS]: {
    icon: GARDEN_LOGO,
    title: 'Add funds to deposit manager',
  },
  [actions.APPROVE_TOKEN]: {
    icon: GARDEN_LOGO,
    title: 'Approve token amount',
  },
  [actions.CANCEL_PROPOSAL]: {
    icon: GARDEN_LOGO,
    title: 'Cancel proposal',
  },
  [actions.CHALLENGE_ACTION]: {
    icon: GARDEN_LOGO,
    title: 'Challenge proposal',
  },
  [actions.CLAIM_REWARDS]: {
    icon: GARDEN_LOGO,
    title: 'Claim earned rewards',
  },
  [actions.DISPUTE_ACTION]: {
    icon: GARDEN_LOGO,
    title: 'Dispute proposal',
  },
  [actions.EXECUTE_ADJUSTMENT]: {
    title: 'Execute issuance',
    icon: GARDEN_LOGO,
  },
  [actions.EXECUTE_DECISION]: {
    title: 'Execute decision',
    icon: GARDEN_LOGO,
  },
  [actions.EXECUTE_PROPOSAL]: {
    title: 'Execute proposal',
    icon: GARDEN_LOGO,
  },
  [actions.NEW_DECISION]: {
    title: 'New decision creation',
    icon: GARDEN_LOGO,
  },
  [actions.NEW_PROPOSAL]: {
    title: 'New proposal creation',
    icon: GARDEN_LOGO,
  },
  [actions.NEW_SIGNALING_PROPOSAL]: {
    icon: GARDEN_LOGO,
    title: 'New signaling proposal creation',
  },
  [actions.RESOLVE_ACTION]: {
    title: 'Resolve dispute',
    icon: GARDEN_LOGO,
  },
  [actions.SETTLE_ACTION]: {
    title: 'Settle challenge',
    icon: GARDEN_LOGO,
  },
  [actions.SIGN_AGREEMENT]: {
    title: 'Sign covenant',
    icon: GARDEN_LOGO,
  },
  [actions.STAKE_TO_PROPOSAL]: {
    title: 'Support proposal',
    icon: GARDEN_LOGO,
  },
  [actions.UNWRAP_TOKEN]: {
    title: 'Unwrap token',
    icon: GARDEN_LOGO,
  },
  [actions.UPDATE_PRICE_ORACLE]: {
    icon: GARDEN_LOGO,
    title: 'Update Price Oracle',
  },
  [actions.VOTE_ON_DECISION]: {
    icon: GARDEN_LOGO,
    title: 'Vote on decision',
  },
  [actions.WITHDRAW_FUNDS]: {
    icon: GARDEN_LOGO,
    title: 'Withdraw funds from deposit manager',
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: {
    icon: GARDEN_LOGO,
    title: 'Withdraw support from proposal',
  },
  [actions.WRAP_TOKEN]: {
    icon: GARDEN_LOGO,
    title: 'Wrap token',
  },
}

export function getActivityData(type) {
  return ACTIVITY_TYPES[type]
}
