import { addressesEqual } from './web3-utils'
import { VOTE_ABSENT, VOTE_NAY, VOTE_YEA } from '../constants'

export function getConnectedAccountVote(vote, account) {
  const userCast = vote.casts.find(cast =>
    addressesEqual(cast.entity.id, account)
  )

  if (userCast) {
    return userCast.supports ? VOTE_YEA : VOTE_NAY
  }
  return VOTE_ABSENT
}
