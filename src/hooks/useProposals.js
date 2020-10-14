import BigNumber from '../lib/bigNumber'
import { useLatestBlock } from './useBlock'
import { useStakesHistoryByProposalSubscription } from './useSubscriptions'
import {
  calculateThreshold,
  getCurrentConviction,
  getCurrentConvictionByEntity,
  getConvictionTrend,
  getMaxConviction,
  getMinNeededStake,
  getRemainingTimeToPass,
} from '../lib/conviction'
import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useProposalConvictionData(proposal) {
  const { account } = useWallet()
  const {
    alpha,
    convictionVoting,
    maxRatio,
    vaultBalance,
    weight,
    effectiveSupply,
  } = useAppState()

  const latestBlock = useLatestBlock()

  let threshold = null
  let neededConviction = null
  let minTokensNeeded = null
  let neededTokens = null
  let remainingTimeToPass = null

  const stakes = useStakesHistoryByProposalSubscription(
    convictionVoting,
    proposal?.id
  )

  const totalTokensStaked = proposal?.stakes.reduce((accumulator, stake) => {
    return accumulator.plus(stake.amount)
  }, new BigNumber('0'))

  const maxConviction = getMaxConviction(
    effectiveSupply || new BigNumber('0'),
    alpha
  )
  const currentConviction = getCurrentConviction(
    stakes,
    latestBlock.number,
    alpha
  )
  const userConviction = getCurrentConvictionByEntity(
    stakes,
    account,
    latestBlock.number,
    alpha
  )

  const userStakedConviction = userConviction.div(maxConviction)

  const stakedConviction = currentConviction.div(maxConviction)
  const futureConviction = getMaxConviction(totalTokensStaked, alpha)
  const futureStakedConviction = futureConviction.div(maxConviction)
  const convictionTrend = getConvictionTrend(
    stakes,
    maxConviction,
    latestBlock.number,
    alpha,
    TIME_UNIT
  )

  // Funding proposal needed values
  if (proposal.requestedAmount.gt(0)) {
    threshold = calculateThreshold(
      proposal.requestedAmount,
      vaultBalance || new BigNumber('0'),
      effectiveSupply || new BigNumber('0'),
      alpha,
      maxRatio,
      weight
    )

    neededConviction = threshold?.div(maxConviction)

    minTokensNeeded = getMinNeededStake(threshold, alpha)

    neededTokens = minTokensNeeded.minus(totalTokensStaked)

    remainingTimeToPass = getRemainingTimeToPass(
      threshold,
      currentConviction,
      totalTokensStaked,
      alpha
    )
  }

  return {
    ...proposal,
    convictionTrend,
    currentConviction,
    futureConviction,
    futureStakedConviction,
    loading: latestBlock.number === 0,
    maxConviction,
    minTokensNeeded,
    neededConviction,
    neededTokens,
    remainingTimeToPass,
    stakedConviction,
    threshold,
    totalTokensStaked,
    userConviction,
    userStakedConviction,
  }
}
