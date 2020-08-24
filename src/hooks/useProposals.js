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
    alpha,
    isLoading,
    maxRatio,
    proposals = [],
    stakesHistory = [],
    vaultBalance,
    weight,
    effectiveSupply,
  } = useAppState()

  const latestBlock = useLatestBlock()

  const proposalsWithData = useMemo(() => {
    if (isLoading) {
      return proposals
    }

    return proposals.map(proposal => {
      let threshold = null
      let neededConviction = null
      let minTokensNeeded = null
      let neededTokens = null
      let remainingTimeToPass = null

      const stakes = stakesHistory.filter(
        stake => parseInt(stake.proposalId) === parseInt(proposal.id)
      )

      const totalTokensStaked = proposal?.stakes.reduce(
        (accumulator, stake) => {
          return accumulator.plus(stake.amount)
        },
        new BigNumber('0')
      )

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
        totalTokensStaked,
      }
    })
  }, [
    account,
    alpha,
    effectiveSupply,
    isLoading,
    latestBlock,
    maxRatio,
    proposals,
    stakesHistory,
    vaultBalance,
    weight,
  ])

  return [proposalsWithData, latestBlock.number !== 0]
}
