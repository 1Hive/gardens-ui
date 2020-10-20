import { addressesEqual } from './web3-utils'
import { VOTE_ABSENT, VOTE_NAY, VOTE_YEA } from '../constants'

const ONE_SECOND = 1000
const EMPTY_SCRIPT = '0x00000001'

export function isVoteAction(vote) {
  return vote.script && vote.data.script !== EMPTY_SCRIPT
}

export function getConnectedAccountVote(vote, account) {
  const userCast = vote.casts.find(cast =>
    addressesEqual(cast.entity.id, account)
  )

  if (userCast) {
    return userCast.supports ? VOTE_YEA : VOTE_NAY
  }
  return VOTE_ABSENT
}

export function getDecisionTransition(
  vote,
  { number: currentBlockNumber, timestamp: currentBlockTimestamp },
  blockTime
) {
  // Check if the latest block has not loaded yet (in that case assumed all closed)
  if (!currentBlockNumber) return { closed: true }

  const { startBlock, endBlock, executionBlock } = vote
  const blockTimestampMiliseconds = currentBlockTimestamp * ONE_SECOND
  const blockTimeMiliseconds = blockTime * ONE_SECOND
  const state = {}

  if (endBlock <= currentBlockNumber) {
    state.closed = true
    // If not delayed, then just return closed
    if (currentBlockNumber < executionBlock) {
      state.delayed = true
    } else {
      return state
    }
  } else if (currentBlockNumber < startBlock) {
    state.upcoming = true
  } else {
    state.open = true
  }

  const remainingBlocks = getVoteRemainingBlocks(
    { ...vote, ...state },
    currentBlockNumber
  )

  // Save the end time for the next state transition
  state.transitionAt = new Date(
    blockTimestampMiliseconds + remainingBlocks * blockTimeMiliseconds
  )

  return state
}

export function getVoteRemainingBlocks(voteData, currentBlockNumber) {
  const { startBlock, endBlock, executionBlock } = voteData

  // All posible states
  const { closed, delayed, upcoming, open, syncing } = voteData
  let remainingBlocks

  if ((closed && !delayed) || syncing) return 0

  if (upcoming) {
    // upcoming
    remainingBlocks = startBlock - currentBlockNumber
  } else if (open) {
    // open
    remainingBlocks = endBlock - currentBlockNumber
  } // delayed
  else {
    remainingBlocks = executionBlock - currentBlockNumber
  }

  return remainingBlocks
}
