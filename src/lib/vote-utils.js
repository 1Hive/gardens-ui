import { addressesEqual } from './web3-utils'
import {
  VOTE_ABSENT,
  VOTE_NAY,
  VOTE_YEA,
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_REJECTED,
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_ENACTED,
  VOTE_STATUS_UPCOMING,
  VOTE_STATUS_PENDING_ENACTMENT,
  VOTE_STATUS_DELAYED,
} from '../constants'

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
    currentBlockTimestamp + remainingBlocks * blockTimeMiliseconds
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

export const getQuorumProgress = ({ yea, votingPower }) => yea.div(votingPower)

export function getVoteSuccess(vote, pctBase) {
  const { yea, minAcceptQuorum, nay, supportRequired, votingPower } = vote

  const totalVotes = yea.plus(nay)
  if (totalVotes.isZero()) {
    return false
  }
  const yeaPct = yea.times(pctBase).div(totalVotes)
  const yeaOfTotalPowerPct = yea.times(pctBase).div(votingPower)

  // Mirror on-chain calculation
  // yea / votingPower > supportRequired ||
  //   (yea / totalVotes > supportRequired &&
  //    yea / votingPower > minAcceptQuorum)
  return (
    yeaOfTotalPowerPct.gt(supportRequired) ||
    (yeaPct.gt(supportRequired) && yeaOfTotalPowerPct.gt(minAcceptQuorum))
  )
}

export function getVoteStatus(vote, pctBase) {
  if (vote.data.upcoming) return VOTE_STATUS_UPCOMING
  if (vote.data.open) return VOTE_STATUS_ONGOING

  if (!getVoteSuccess(vote, pctBase)) {
    return VOTE_STATUS_REJECTED
  }

  if (vote.data.delayed) return VOTE_STATUS_DELAYED

  // Only if the vote has an action do we consider it possible for enactment
  const hasAction = isVoteAction(vote)
  return hasAction
    ? vote.data.executed
      ? VOTE_STATUS_ENACTED
      : VOTE_STATUS_PENDING_ENACTMENT
    : VOTE_STATUS_ACCEPTED
}
