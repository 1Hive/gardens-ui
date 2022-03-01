import { GardenActionTypes as actions } from '@/actions/garden-action-types'

export type AssetsType = Record<
  string,
  {
    light?: string | null
    dark?: string | null
  }
>

const assets: AssetsType = {
  [actions.ADD_FUNDS]: {
    light: '/icons/activity/light/addFunds.svg',
    dark: null,
  },
  [actions.ALLOW_MANAGER]: {
    light: '/icons/activity/light/approveToken.svg',
    dark: null,
  },
  [actions.APPROVE_TOKEN]: {
    light: '/icons/activity/light/approveToken.svg',
    dark: null,
  },
  [actions.CANCEL_PROPOSAL]: {
    light: '/icons/activity/light/cancelProposal.svg',
    dark: null,
  },
  [actions.CHALLENGE_ACTION]: {
    light: '/icons/activity/light/challengeAction.svg',
    dark: null,
  },
  [actions.CLAIM_REWARDS]: {
    light: '/icons/activity/light/claimRewards.svg',
    dark: null,
  },
  [actions.DELEGATE_VOTING]: {
    light: '/icons/activity/light/delegateVoting.svg',
    dark: null,
  },
  [actions.DISPUTE_ACTION]: {
    light: '/icons/activity/light/disputeAction.svg',
    dark: null,
  },
  [actions.EXECUTE_ADJUSTMENT]: {
    light: '/icons/activity/light/executeAdjustment.svg',
    dark: null,
  },
  [actions.EXECUTE_DECISION]: {
    light: '/icons/activity/light/executeDecision.svg',
    dark: null,
  },
  [actions.EXECUTE_PROPOSAL]: {
    light: '/icons/activity/light/executeProposal.svg',
    dark: null,
  },
  [actions.NEW_DECISION]: {
    light: '/icons/activity/light/newDecision.svg',
    dark: null,
  },
  [actions.NEW_PROPOSAL]: {
    light: '/icons/activity/light/newProposal.svg',
    dark: null,
  },
  [actions.NEW_SIGNALING_PROPOSAL]: {
    light: '/icons/activity/light/newSignalingProposal.svg',
    dark: null,
  },
  [actions.RESOLVE_ACTION]: {
    light: '/icons/activity/light/resolveAction.svg',
    dark: null,
  },
  [actions.SETTLE_ACTION]: {
    light: '/icons/activity/light/settleAction.svg',
    dark: null,
  },
  [actions.SIGN_AGREEMENT]: {
    light: '/icons/activity/light/signAgreement.svg',
    dark: null,
  },
  [actions.STAKE_TO_PROPOSAL]: {
    light: '/icons/activity/light/stakeToProposal.svg',
    dark: null,
  },
  [actions.UNWRAP_TOKEN]: {
    light: '/icons/activity/light/unwrapToken.svg',
    dark: null,
  },
  [actions.UPDATE_PRICE_ORACLE]: {
    light: '/icons/activity/light/updateOracle.svg',
    dark: null,
  },
  [actions.VOTE_ON_BEHALF_OF]: {
    light: '/icons/activity/light/voteOnBehalfOf.svg',
    dark: null,
  },
  [actions.VOTE_ON_DECISION]: {
    light: '/icons/activity/light/voteOnDecision.svg',
    dark: null,
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: {
    light: '/icons/activity/light/withdrawFromProposal.svg',
    dark: null,
  },
  [actions.WITHDRAW_FUNDS]: {
    light: '/icons/activity/light/withdrawFunds.svg',
    dark: null,
  },
  [actions.WRAP_TOKEN]: {
    light: '/icons/activity/light/wrapToken.svg',
    dark: null,
  },
}

export default assets
