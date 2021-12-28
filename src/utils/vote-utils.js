import { bigNum } from '@lib/bigNumber'

import {
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_DISPUTED_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
  PROPOSAL_STATUS_SETTLED_STRING,
  VOTE_ABSENT,
  VOTE_NAY,
  VOTE_YEA,
} from '../constants'
import { addressesEqual } from './web3-utils'

const EMPTY_SCRIPTS = ['0x00000001', '0x00']

export function isVoteAction(vote) {
  return vote.script && !EMPTY_SCRIPTS.includes(vote.script)
}

export function getAccountCastStake(vote, account) {
  const userCast = vote.casts.find((cast) =>
    addressesEqual(cast.supporter.user.address, account)
  )

  return bigNum(userCast?.stake || 0, 0)
}

export function getAccountCastDelegatedStake(vote, account) {
  // Takes into account delegated cast stakes (casts done by account where account === caster !== supporter, supporter being caster´s principal)
  const totalDelegatedStake = vote.casts
    .filter(
      (cast) =>
        addressesEqual(cast.caster, account) &&
        !addressesEqual(cast.supporter.user.address, account)
    )
    .reduce((acc, cast) => acc.plus(bigNum(cast.stake, 0)), bigNum(0))

  return totalDelegatedStake
}

export function getConnectedAccountCast(vote, account) {
  const userCast = vote.casts.find((cast) =>
    addressesEqual(cast.supporter.user.address, account)
  )

  if (userCast) {
    return {
      vote: userCast.supports ? VOTE_YEA : VOTE_NAY,
      caster: userCast.caster,
    }
  }
  return { vote: VOTE_ABSENT }
}

export function hasVoteEnded(status, endDate, challengeEndDate) {
  return (
    status === PROPOSAL_STATUS_CANCELLED_STRING ||
    status === PROPOSAL_STATUS_SETTLED_STRING ||
    (status !== PROPOSAL_STATUS_CHALLENGED_STRING &&
      status !== PROPOSAL_STATUS_DISPUTED_STRING &&
      Date.now() >= endDate) ||
    (status === PROPOSAL_STATUS_CHALLENGED_STRING &&
      Date.now() > challengeEndDate)
  )
}

export function getDelegatedVotingEndDate(vote) {
  const baseDelegatedVotingEndDate = vote.startDate + vote.delegatedVotingPeriod

  // If the vote was paused before the delegated voting period ended, we need to extend it
  if (vote.pausedAt > 0 && vote.pausedAt < baseDelegatedVotingEndDate) {
    return baseDelegatedVotingEndDate + vote.pauseDuration
  }

  return baseDelegatedVotingEndDate
}

export function getVoteEndDate(vote) {
  const baseVoteEndDate = vote.startDate + vote.voteTime
  const endDateAfterPause = baseVoteEndDate + vote.pauseDuration
  const lastComputedEndDate =
    endDateAfterPause + vote.quietEndingExtensionDuration

  // The last computed end date is correct if we have not passed it yet or if no flip was detected in the last extension
  const currentTimestamp = Date.now()
  if (currentTimestamp < lastComputedEndDate || !wasVoteFlipped(vote)) {
    return lastComputedEndDate
  }

  // Otherwise, since the last computed end date was reached and included a flip, we need to extend the end date by one more period
  return lastComputedEndDate + vote.quietEndingExtension
}

export function getExecutionDelayEndDate(vote, endDate) {
  return endDate + vote.executionDelay
}

function wasVoteFlipped(vote) {
  // If there was no snapshot taken, it means no one voted during the quiet ending period. Thus, it cannot have been flipped.
  if (vote.quietEndingSnapshotSupport === 'Absent') {
    return false
  }

  // Otherwise, we calculate if the vote was flipped by comparing its current acceptance state to its last state at the start of the extension period
  const wasInitiallyAccepted = vote.quietEndingSnapshotSupport === 'Yea'
  const currentExtensions =
    vote.quietEndingExtensionDuration / vote.quietEndingExtension

  const wasAcceptedBeforeLastFlip =
    wasInitiallyAccepted === (currentExtensions % 2 === 0)
  return wasAcceptedBeforeLastFlip !== vote.isAccepted
}

export const getQuorumProgress = ({ yea, votingPower }) => yea.div(votingPower)

export function getVoteSuccess(vote, pctBase) {
  const { yea, minAcceptQuorum, nay, supportRequiredPct, votingPower } = vote

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
    yeaOfTotalPowerPct.gt(supportRequiredPct) ||
    (yeaPct.gt(supportRequiredPct) && yeaOfTotalPowerPct.gt(minAcceptQuorum))
  )
}

export function getVoteStatusData(vote, hasEnded, pctBase) {
  const statusData = {}
  if (!hasEnded) {
    if (vote.status === PROPOSAL_STATUS_ACTIVE_STRING) {
      statusData.open = true
    } else if (vote.status === PROPOSAL_STATUS_DISPUTED_STRING) {
      statusData.disputed = true
    } else {
      statusData.challenged = true
    }
  } // If it is challenged and has ended means it was settled because submitter didn't respond.
  else if (
    vote.status === PROPOSAL_STATUS_CHALLENGED_STRING ||
    vote.status === PROPOSAL_STATUS_SETTLED_STRING
  ) {
    statusData.settled = true
  } else if (!getVoteSuccess(vote, pctBase)) {
    statusData.rejected = true
  } else if (vote.status === PROPOSAL_STATUS_CANCELLED_STRING) {
    statusData.cancelled = true
  } else {
    // Only if the vote has an action do we consider it possible for enactment
    const hasAction = isVoteAction(vote)
    if (hasAction) {
      if (vote.status === PROPOSAL_STATUS_EXECUTED_STRING) {
        statusData.executed = true
      } else {
        statusData.pendingExecution = true
      }
    } else {
      statusData.accepted = true
    }
  }

  return statusData
}

export async function getCanUserVote(votingContract, voteId, account) {
  if (!votingContract || !account) {
    return false
  }

  return votingContract.canVote(voteId, account)
}

export async function getCanUserVoteOnBehalfOf(
  votingContract,
  voteId,
  voters,
  representative
) {
  if (!votingContract || !voters.length || !representative) {
    return false
  }

  return votingContract.canVoteOnBehalfOf(voteId, voters, representative)
}
