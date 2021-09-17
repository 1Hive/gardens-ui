import actions from './actions/garden-action-types'

export default {
  [actions.APPROVE_TOKEN]: ({ amount }) => {
    return `Approve token amount: ${amount} HNY`
  },
  [actions.CANCEL_PROPOSAL]: ({ proposalId }) => {
    return `Cancel proposal: ${proposalId}`
  },
  [actions.CHALLENGE_ACTION]: ({ actionId }) => {
    return `Challenge proposal: ${actionId}`
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
  [actions.NEW_PROPOSAL]: () => {
    return `New funding proposal creation`
  },
  [actions.NEW_SIGNALING_PROPOSAL]: () => {
    return `New signaling proposal creation`
  },
  [actions.RESOLVE_ACTION]: ({ disputeId }) => {
    return `Resolve dispute: ${disputeId}`
  },
  [actions.SETTLE_ACTION]: ({ actionId }) => {
    return `Accept settlement for action: ${actionId}`
  },
  [actions.SIGN_AGREEMENT]: () => {
    return `Sign Agreement`
  },
  [actions.STAKE_TO_PROPOSAL]: ({ proposalId }) => {
    return `Support proposal: ${proposalId}`
  },
  [actions.UNWRAP_TOKEN]: () => {
    return `Unwrap token`
  },
  [actions.VOTE_ON_DECISION]: ({ voteId }) => {
    return `Vote on decision: ${voteId}`
  },
  [actions.WITHDRAW_FROM_PROPOSAL]: ({ proposalId }) => {
    return `Withdraw support from proposal: ${proposalId}`
  },
  [actions.WRAP_TOKEN]: () => {
    return `Wrap token`
  },
}
