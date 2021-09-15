// import actions from './actions/court-action-types'

// export default {
//   [actions.APPROVE_TOKEN]: ({ amount }) => {
//     return `Approve token amount: ${amount} HNY`
//   },
//   [actions.CANCEL_PROPOSAL]: ({ proposalId }) => {
//     return `Cancel proposal: ${proposalId}`
//   },
//   [actions.CHALLENGE_ACTION]: ({ actionId }) => {
//     return `Challenge proposal: ${actionId}`
//   },
//   [actions.DISPUTE_ACTION]: ({ actionId }) => {
//     return `Dispute proposal: ${actionId}`
//   },
//   [actions.EXECUTE_ADJUSTMENT]: () => {
//     return `Execute issuance`
//   },
//   [actions.EXECUTE_DECISION]: ({ voteId }) => {
//     return `Execute decision: ${voteId}`
//   },
//   [actions.EXECUTE_PROPOSAL]: ({ proposalId }) => {
//     return `Execute proposal: ${proposalId}`
//   },
//   [actions.NEW_PROPOSAL]: () => {
//     return `New funding proposal creation`
//   },
//   [actions.NEW_SIGNALING_PROPOSAL]: () => {
//     return `New signaling proposal creation`
//   },
//   [actions.RESOLVE_ACTION]: ({ disputeId }) => {
//     return `Resolve dispute: ${disputeId}`
//   },
//   [actions.SETTLE_ACTION]: ({ actionId }) => {
//     return `Accept settlement for action: ${actionId}`
//   },
//   [actions.SIGN_AGREEMENT]: () => {
//     return `Sign Agreement`
//   },
//   [actions.LEAK_VOTE]: ({ voteId, voter }) => {
//     return `Report code leaked by ${voter} for vote #${voteId}`
//   },
//   [actions.REVEAL_VOTE]: ({ disputeId, roundId }) => {
//     return `Reveal vote on round ${numberToWord(
//       roundId
//     )} for dispute #${disputeId}`
//   },
//   [actions.SETTLE_REWARD]: ({ roundId, disputeId }) => {
//     return `Settle reward for round ${numberToWord(
//       roundId
//     )} of dispute #${disputeId}`
//   },
//   [actions.SETTLE_APPEAL_DEPOSIT]: ({ roundId, disputeId }) => {
//     return `Settle appeal deposit for round ${numberToWord(
//       roundId
//     )} of dispute #${disputeId}`
//   },
//   [actions.WITHDRAW_HNY]: ({ amount }) => {
//     return `Withdraw the total amount of ${amount} HNY`
//   },
// }
