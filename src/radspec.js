import { shortenAddress } from '@1hive/1hive-ui'
import { GardenActionTypes as actions } from '@/actions/garden-action-types'
import { ZERO_ADDR } from './constants'

export default {
  [actions.ADD_FUNDS]: () => {
    return `Add funds to deposit manager`
  },
  [actions.ALLOW_MANAGER]: () => {
    return `Allow manager to lock funds`
  },
  [actions.APPROVE_TOKEN]: ({ tokenSymbol }) => {
    return `Approve ${tokenSymbol}`
  },
  [actions.CANCEL_PROPOSAL]: ({ proposalId }) => {
    return `Cancel proposal: ${proposalId}`
  },
  [actions.CHALLENGE_ACTION]: ({ actionId }) => {
    return `Challenge proposal: ${actionId}`
  },
  [actions.CLAIM_REWARDS]: () => {
    return `Claim earned rewards`
  },
  [actions.DELEGATE_VOTING]: ({ representative }) => {
    return `${
      representative !== ZERO_ADDR
        ? `Delegate votes to: ${shortenAddress(representative)}`
        : `Remove delegate`
    }`
  },
  [actions.DISPUTE_ACTION]: ({ actionId }) => {
    return `Dispute proposal: ${actionId}`
  },
  [actions.EXECUTE_ADJUSTMENT]: () => {
    return `Execute issuance`
  },
  [actions.EXECUTE_DECISION]: ({ voteId }) => {
    return `Execute decision: ${voteId}`
  },
  [actions.EXECUTE_PROPOSAL]: ({ proposalId }) => {
    return `Execute proposal: ${proposalId}`
  },
  [actions.NEW_DECISION]: () => {
    return `Create new protocol decision`
  },
  [actions.NEW_PROPOSAL]: () => {
    return `Create new funding proposal`
  },
  [actions.NEW_SIGNALING_PROPOSAL]: () => {
    return `Create new signaling proposal`
  },
  [actions.RESOLVE_ACTION]: ({ disputeId }) => {
    return `Resolve dispute: ${disputeId}`
  },
  [actions.SETTLE_ACTION]: ({ actionId }) => {
    return `Settle action: ${actionId}`
  },
  [actions.SIGN_AGREEMENT]: () => {
    return `Sign Covenant`
  },
  [actions.STAKE_TO_PROPOSAL]: ({ proposalId }) => {
    return `Support proposal: ${proposalId}`
  },
  [actions.UNWRAP_TOKEN]: () => {
    return `Unwrap token`
  },
  [actions.VOTE_ON_DECISION]: ({ voteId, supports }) => {
    return `Vote ${supports ? 'Yes' : 'No'} on decision: #${voteId}`
  },
  [actions.VOTE_ON_BEHALF_OF]: ({ voteId, supports }) => {
    return `Vote ${
      supports ? 'Yes' : 'No'
    } on behalf of principals on decision: #${voteId}`
  },
  [actions.WITHDRAW_FUNDS]: () => {
    return `Withdraw funds from deposit manager`
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: ({ proposalId }) => {
    return `Withdraw support from proposal: ${proposalId}`
  },
  [actions.WRAP_TOKEN]: () => {
    return `Wrap token`
  },
  [actions.UPDATE_PRICE_ORACLE]: () => {
    return `Update price oracle`
  },
}
