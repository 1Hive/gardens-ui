import { GardenActionTypes as actions } from '@/actions/garden-action-types'

type ActivityData = {
  icon: actions
  title: string
}

// The different types of activity
const ACTIVITY_TYPES: {
  [key in actions]: ActivityData
} = {
  [actions.ADD_FUNDS]: {
    icon: actions.ADD_FUNDS,
    title: 'Add funds to deposit manager',
  },
  [actions.ALLOW_MANAGER]: {
    icon: actions.ALLOW_MANAGER,
    title: 'Allow manager to lock funds',
  },
  [actions.APPROVE_TOKEN]: {
    icon: actions.APPROVE_TOKEN,
    title: 'Approve token amount',
  },
  [actions.CANCEL_PROPOSAL]: {
    icon: actions.CANCEL_PROPOSAL,
    title: 'Cancel proposal',
  },
  [actions.CHALLENGE_ACTION]: {
    icon: actions.CHALLENGE_ACTION,
    title: 'Challenge proposal',
  },
  [actions.CLAIM_REWARDS]: {
    icon: actions.CLAIM_REWARDS,
    title: 'Claim earned rewards',
  },
  [actions.DELEGATE_VOTING]: {
    icon: actions.DELEGATE_VOTING,
    title: 'Update delegate',
  },
  [actions.DISPUTE_ACTION]: {
    icon: actions.DISPUTE_ACTION,
    title: 'Dispute proposal',
  },
  [actions.EXECUTE_ADJUSTMENT]: {
    icon: actions.EXECUTE_ADJUSTMENT,
    title: 'Execute issuance',
  },
  [actions.EXECUTE_DECISION]: {
    icon: actions.EXECUTE_DECISION,
    title: 'Execute decision',
  },
  [actions.EXECUTE_PROPOSAL]: {
    icon: actions.EXECUTE_PROPOSAL,
    title: 'Execute proposal',
  },
  [actions.NEW_DECISION]: {
    icon: actions.NEW_DECISION,
    title: 'New decision creation',
  },
  [actions.NEW_PROPOSAL]: {
    icon: actions.NEW_PROPOSAL,
    title: 'New proposal creation',
  },
  [actions.NEW_SIGNALING_PROPOSAL]: {
    icon: actions.NEW_SIGNALING_PROPOSAL,
    title: 'New signaling proposal creation',
  },
  [actions.RESOLVE_ACTION]: {
    icon: actions.RESOLVE_ACTION,
    title: 'Resolve dispute',
  },
  [actions.SETTLE_ACTION]: {
    icon: actions.SETTLE_ACTION,
    title: 'Settle challenge',
  },
  [actions.SIGN_AGREEMENT]: {
    icon: actions.SIGN_AGREEMENT,
    title: 'Sign covenant',
  },
  [actions.STAKE_TO_PROPOSAL]: {
    icon: actions.STAKE_TO_PROPOSAL,
    title: 'Support proposal',
  },
  [actions.UNWRAP_TOKEN]: {
    icon: actions.UNWRAP_TOKEN,
    title: 'Unwrap token',
  },
  [actions.UPDATE_PRICE_ORACLE]: {
    icon: actions.UPDATE_PRICE_ORACLE,
    title: 'Update Price Oracle',
  },
  [actions.VOTE_ON_DECISION]: {
    icon: actions.VOTE_ON_DECISION,
    title: 'Vote on decision',
  },
  [actions.VOTE_ON_BEHALF_OF]: {
    icon: actions.VOTE_ON_BEHALF_OF,
    title: 'Vote on decision on behalf of principals',
  },
  [actions.WITHDRAW_FUNDS]: {
    icon: actions.WITHDRAW_FUNDS,
    title: 'Withdraw funds from deposit manager',
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: {
    icon: actions.WITHDRAW_FROM_PROPOSAL,
    title: 'Withdraw support from proposal',
  },
  [actions.WRAP_TOKEN]: {
    icon: actions.WRAP_TOKEN,
    title: 'Wrap token',
  },
  [actions.ACTIVATE_STREAM_PROPOSAL]: {
    // TODO: add new icon
    icon: actions.NEW_SIGNALING_PROPOSAL,
    title: 'Activate stream proposal',
  },
  [actions.REGISTER_STREAM_PROPOSAL]: {
    // TODO: add new icon
    icon: actions.NEW_SIGNALING_PROPOSAL,
    title: 'Register stream proposal',
  },
}

export function getActivityData(type: actions): ActivityData {
  return ACTIVITY_TYPES[type]
}
