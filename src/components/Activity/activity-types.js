import actions from '../../actions/garden-action-types'

import GARDEN_LOGO from '../../assets/gardensLogo.svg' // WE NEED SOME ICONS FOR DIFERENT ACTIONS

// The different types of activity
const ACTIVITY_TYPES = {
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
  [actions.DISPUTE_ACTION]: {
    title: 'Dispute proposal',
    icon: GARDEN_LOGO,
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
    title: 'Exeute proposal',
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
    title: 'Accept settlement',
    icon: GARDEN_LOGO,
  },
  [actions.SIGN_AGREEMENT]: {
    title: 'Sign agreement',
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
  [actions.VOTE_ON_DECISION]: {
    icon: GARDEN_LOGO,
    title: 'Vote on decision',
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
