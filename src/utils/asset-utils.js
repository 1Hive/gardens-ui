import AddFundsLight from '@assets/activity/light/addFunds.svg'
import ApproveTokenLight from '@assets/activity/light/approveToken.svg'
import CancelProposalLight from '@assets/activity/light/cancelProposal.svg'
import ChallengeActionLight from '@assets/activity/light/challengeAction.svg'
import ClaimRewardsLight from '@assets/activity/light/claimRewards.svg'
import DisputeActionLight from '@assets/activity/light/disputeAction.svg'
import ExecuteAdjustmentLight from '@assets/activity/light/executeAdjustment.svg'
import ExecuteDecisionLight from '@assets/activity/light/executeDecision.svg'
import ExecuteProposalLight from '@assets/activity/light/executeProposal.svg'
import NewDecisionLight from '@assets/activity/light/newDecision.svg'
import NewProposalLight from '@assets/activity/light/newProposal.svg'
import NewSignalingProposalLight from '@assets/activity/light/newSignalingProposal.svg'
import ResolveActionLight from '@assets/activity/light/resolveAction.svg'
import SettleActionLight from '@assets/activity/light/settleAction.svg'
import SignAgreementLight from '@assets/activity/light/signAgreement.svg'
import StakeToProposalLight from '@assets/activity/light/stakeToProposal.svg'
import UnwrapTokenLigh from '@assets/activity/light/unwrapToken.svg'
import UpdateOracleLight from '@assets/activity/light/updateOracle.svg'
import VoteOnDecisionLight from '@assets/activity/light/voteOnDecision.svg'
import WithdrawFromProposalLight from '@assets/activity/light/withdrawFromProposal.svg'
import WithdrawFundsLight from '@assets/activity/light/withdrawFunds.svg'
import WrapTokenLigh from '@assets/activity/light/wrapToken.svg'

import actions from '@/actions/garden-action-types'

export default {
  [actions.ADD_FUNDS]: {
    light: AddFundsLight,
    dark: null,
  },
  [actions.ALLOW_MANAGER]: {
    light: ApproveTokenLight,
    dark: null,
  },
  [actions.APPROVE_TOKEN]: {
    light: ApproveTokenLight,
    dark: null,
  },
  [actions.CANCEL_PROPOSAL]: {
    light: CancelProposalLight,
    dark: null,
  },
  [actions.CHALLENGE_ACTION]: {
    light: ChallengeActionLight,
    dark: null,
  },
  [actions.CLAIM_REWARDS]: {
    light: ClaimRewardsLight,
    dark: null,
  },
  [actions.DISPUTE_ACTION]: {
    light: DisputeActionLight,
    dark: null,
  },
  [actions.EXECUTE_ADJUSTMENT]: {
    light: ExecuteAdjustmentLight,
    dark: null,
  },
  [actions.EXECUTE_DECISION]: {
    light: ExecuteDecisionLight,
    dark: null,
  },
  [actions.EXECUTE_PROPOSAL]: {
    light: ExecuteProposalLight,
    dark: null,
  },
  [actions.NEW_DECISION]: {
    light: NewDecisionLight,
    dark: null,
  },
  [actions.NEW_PROPOSAL]: {
    light: NewProposalLight,
    dark: null,
  },
  [actions.NEW_SIGNALING_PROPOSAL]: {
    light: NewSignalingProposalLight,
    dark: null,
  },
  [actions.RESOLVE_ACTION]: {
    light: ResolveActionLight,
    dark: null,
  },
  [actions.SETTLE_ACTION]: {
    light: SettleActionLight,
    dark: null,
  },
  [actions.SIGN_AGREEMENT]: {
    light: SignAgreementLight,
    dark: null,
  },
  [actions.STAKE_TO_PROPOSAL]: {
    light: StakeToProposalLight,
    dark: null,
  },
  [actions.UNWRAP_TOKEN]: {
    light: UnwrapTokenLigh,
    dark: null,
  },
  [actions.UPDATE_PRICE_ORACLE]: {
    light: UpdateOracleLight,
    dark: null,
  },
  [actions.VOTE_ON_DECISION]: {
    light: VoteOnDecisionLight,
    dark: null,
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: {
    light: WithdrawFromProposalLight,
    dark: null,
  },
  [actions.WITHDRAW_FUNDS]: {
    light: WithdrawFundsLight,
    dark: null,
  },
  [actions.WRAP_TOKEN]: {
    light: WrapTokenLigh,
    dark: null,
  },
}
