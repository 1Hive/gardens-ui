import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useLatestBlock } from './useBlock'
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

export function useProposals() {
  const { account } = useWallet()
  const {
    proposals = [],
    convictionStakes,
    stakeToken,
    totalSupply,
    vaultBalance,
    alpha,
    maxRatio,
    weight,
  } = useAppState()

  const latestBlock = useLatestBlock()

  const proposalsWithData = useMemo(() => {
    return proposals.map(proposal => {
      const stakes = convictionStakes.filter(
        stake => stake.proposal === parseInt(proposal.id)
      )

      const totalTokensStaked = proposal?.stakes.reduce(
        (accumulator, stake) => {
          return accumulator.plus(stake.amount)
        },
        new BigNumber('0')
      )

      const threshold = calculateThreshold(
        proposal.requestedAmount,
        vaultBalance || new BigNumber('0'),
        totalSupply || new BigNumber('0'),
        alpha,
        maxRatio,
        weight
      )

      const maxConviction = getMaxConviction(
        totalSupply || new BigNumber('0'),
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
      const neededConviction = threshold?.div(maxConviction)

      const minTokensNeeded = getMinNeededStake(threshold, alpha)

      const neededTokens = minTokensNeeded.minus(totalTokensStaked)

      const remainingTimeToPass = getRemainingTimeToPass(
        threshold,
        currentConviction,
        totalTokensStaked,
        alpha
      )

      const convictionTrend = getConvictionTrend(
        stakes,
        maxConviction,
        latestBlock.number,
        alpha,
        TIME_UNIT
      )

      return {
        ...proposal,
        currentConviction,
        userConviction,
        userStakedConviction,
        stakedConviction,
        futureConviction,
        futureStakedConviction,
        neededConviction,
        maxConviction,
        threshold,
        minTokensNeeded,
        neededTokens,
        remainingTimeToPass,
        convictionTrend,
      }
    })
  }, [
    alpha,
    convictionStakes,
    maxRatio,
    proposals,
    stakeToken,
    latestBlock,
    account,
    weight,
    vaultBalance,
  ])

  return [proposalsWithData, latestBlock.number !== 0]
}
