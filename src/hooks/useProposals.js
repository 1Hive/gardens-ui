import { useEffect, useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useBlockTime, useLatestBlock } from './useBlock'
import { useAccountStakesByGarden } from './useStakes'
import useFluidProposals from './useFluidProposals'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@providers/GardenState'
import useProposalFilters, {
  INITIAL_PROPOSAL_COUNT,
} from './useProposalFilters'
import {
  useProposalSubscription,
  useProposalsSubscription,
} from './useSubscriptions'
import { usePriceOracle } from './usePriceOracle'
import { useWallet } from '@providers/Wallet'

import {
  getCurrentConviction,
  getCurrentConvictionByEntity,
  getConvictionTrend,
  getMaxConviction,
  calculateThreshold,
  getMinNeededStake,
  getRemainingTimeToPass,
} from '@lib/conviction'
import { testStatusFilter, testSupportFilter } from '@utils/filter-utils'
import {
  generateSuperfluidLink,
  getFlowAmountByPerSecondFlowRate,
} from '@/utils/stream-utils'
import { safeDivBN } from '@utils/math-utils'
import {
  getProposalStatusData,
  getProposalSupportStatus,
  hasProposalEnded,
} from '@utils/proposal-utils'
import {
  getDelegatedVotingEndDate,
  getExecutionDelayEndDate,
  getVoteEndDate,
  getVoteStatusData,
  hasVoteEnded,
} from '@utils/vote-utils'
import fluidProposalsAbi from '@abis/FluidProposals.json'
import { ProposalTypes } from '../types'
import { PCT_BASE } from '../constants'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useProposals() {
  const { account } = useWallet()
  const { chainId } = useConnectedGarden()

  const latestBlock = useLatestBlock(chainId)

  const filters = useProposalFilters()
  const [proposals, proposalsFetchedCount] = useFilteredProposals(
    filters,
    account,
    latestBlock
  )

  useEffect(() => {
    if (
      proposals.length < proposalsFetchedCount &&
      proposalsFetchedCount === filters.count.filter &&
      proposals.length < INITIAL_PROPOSAL_COUNT
    ) {
      filters.count.onChange()
    }
  }, [filters.count, proposals.length, proposalsFetchedCount])

  return [proposals, filters, proposalsFetchedCount, latestBlock.number !== 0]
}

function useFilteredProposals(filters, account, latestBlock) {
  const myStakes = useAccountStakesByGarden(account)
  const proposals = useProposalsSubscription(filters)
  const { config, loading } = useGardenState()
  const { voidedDecisions } = useConnectedGarden()

  // Proposals already come filtered by Type from the subgraph.
  // We will filter locally by support filter and also for Decision proposals, we will filter by status
  // because decisions are technically closed if the executionBlock has passed.
  const proposalsWithData = useMemo(() => {
    if (loading) {
      return proposals
    }

    return proposals.map((proposal) => {
      return proposal.type === ProposalTypes.Decision
        ? processDecision(proposal, voidedDecisions)
        : processProposal(proposal, latestBlock, account, config.conviction)
    })
  }, [account, config, latestBlock, loading, proposals])

  const filteredProposals = useMemo(
    () =>
      loading
        ? proposalsWithData
        : proposalsWithData?.filter((proposal) => {
            const proposalSupportStatus = getProposalSupportStatus(
              myStakes,
              proposal
            )

            const supportFilterPassed = testSupportFilter(
              filters.support.filter,
              proposalSupportStatus
            )

            const statusFilterPassed = testStatusFilter(
              filters.status.filter,
              proposal
            )

            return supportFilterPassed && statusFilterPassed
          }),
    [filters, loading, myStakes, proposalsWithData]
  )

  const proposalsFetchedCount = proposals.length

  return [filteredProposals, proposalsFetchedCount]
}

export function useProposal(proposalId, appAddress) {
  const { account } = useWallet()
  const [proposal, loadingProposal] = useProposalSubscription(
    proposalId,
    appAddress
  )
  const { chainId } = useConnectedGarden()
  const latestBlock = useLatestBlock(chainId)
  const { config, loading } = useGardenState()
  const { voidedDecisions } = useConnectedGarden()

  const blockHasLoaded = latestBlock.number !== 0

  if (loading || !proposal) {
    return [null, blockHasLoaded]
  }

  const proposalWithData =
    proposal.type === ProposalTypes.Decision
      ? processDecision(proposal, voidedDecisions)
      : processProposal(proposal, latestBlock, account, config.conviction)

  return [proposalWithData, blockHasLoaded, loadingProposal]
}

export function useProposalWithStream(proposal) {
  const { commonPool, config } = useGardenState()
  const { requestToken } = config.conviction
  const { chainId } = useConnectedGarden()
  const [superToken, minStake, currentRate, targetRate, canActivate, loading] =
    useFluidProposals(proposal.id)

  return [
    {
      ...proposal,
      minStake,
      currentRate: getFlowAmountByPerSecondFlowRate(currentRate?.toString()),
      targetRate: getFlowAmountByPerSecondFlowRate(targetRate?.toString()),
      canActivate,
      superfluidLink: generateSuperfluidLink(
        superToken,
        proposal.beneficiary,
        chainId
      ),
    },
    loading,
  ]
}

export function useProposalWithThreshold(proposal) {
  const { commonPool, config } = useGardenState()
  const {
    alpha,
    effectiveSupply,
    maxRatio,
    requestToken,
    stableToken,
    weight,
  } = config.conviction
  const { requestedAmount, totalTokensStaked, stable, type } = proposal

  const [requestAmount, loadingRequestAmount] = usePriceOracle(
    stable,
    requestedAmount,
    stableToken.id,
    requestToken.id
  )

  let threshold,
    neededConviction,
    minTokensNeeded,
    neededTokens,
    remainingBlocksToPass

  // Funding proposal needed values
  if (type === ProposalTypes.Proposal) {
    threshold = calculateThreshold(
      requestAmount,
      commonPool || new BigNumber('0'),
      effectiveSupply || new BigNumber('0'),
      alpha,
      maxRatio,
      weight
    )

    if (threshold) {
      neededConviction = threshold.div(proposal.maxConviction)
      minTokensNeeded = getMinNeededStake(threshold, alpha)
      neededTokens = minTokensNeeded.minus(totalTokensStaked)
      remainingBlocksToPass = getRemainingTimeToPass(
        threshold,
        proposal.currentConviction,
        totalTokensStaked,
        alpha
      )
    }
  }

  return [
    {
      ...proposal,
      neededConviction,
      neededTokens,
      minTokensNeeded,
      remainingBlocksToPass,
      requestedAmountConverted: requestAmount,
      threshold,
    },
    loadingRequestAmount,
  ]
}

export function useProposalEndDate(proposal) {
  const { chainId } = useConnectedGarden()

  const blockTime = useBlockTime(chainId)
  const latestBlock = useLatestBlock(chainId)
  const { type, remainingBlocksToPass } = proposal

  let endDate = 0
  if (type === ProposalTypes.Proposal) {
    if (!Number.isNaN(remainingBlocksToPass) && remainingBlocksToPass > 0) {
      const latestBlockTimestampMs = latestBlock.timestamp * 1000
      const blockTimeInMs = blockTime * 1000
      endDate = new Date(
        latestBlockTimestampMs + remainingBlocksToPass * blockTimeInMs
      )
    }
  }

  return endDate
}

function processProposal(proposal, latestBlock, account, config) {
  const { alpha, effectiveSupply } = config
  const { stakesHistory, totalTokensStaked } = proposal

  const maxConviction = getMaxConviction(
    effectiveSupply || new BigNumber('0'),
    alpha
  )
  const currentConviction = getCurrentConviction(
    stakesHistory,
    latestBlock.number,
    alpha
  )
  const userConviction = getCurrentConvictionByEntity(
    stakesHistory,
    account,
    latestBlock.number,
    alpha
  )

  const userStakedConviction = safeDivBN(userConviction, maxConviction)

  const stakedConviction = safeDivBN(currentConviction, maxConviction)
  const futureConviction = getMaxConviction(totalTokensStaked, alpha)
  const futureStakedConviction = safeDivBN(futureConviction, maxConviction)
  const convictionTrend = getConvictionTrend(
    stakesHistory,
    maxConviction,
    latestBlock.number,
    alpha,
    TIME_UNIT
  )

  const hasEnded = hasProposalEnded(proposal.status, proposal.challengeEndDate)
  const statusData = getProposalStatusData(proposal)

  return {
    ...proposal,
    convictionTrend,
    currentConviction,
    futureConviction,
    futureStakedConviction,
    hasEnded,
    maxConviction,
    stakedConviction,
    statusData,
    userConviction,
    userStakedConviction,
  }
}

function processDecision(proposal, voidedDecisions) {
  const delegatedVotingEndDate = getDelegatedVotingEndDate(proposal)
  const endDate = getVoteEndDate(proposal)
  const executionDelayEndDate = getExecutionDelayEndDate(proposal, endDate)

  const hasEnded = hasVoteEnded(
    proposal.status,
    endDate,
    proposal.challengeEndDate
  )
  const statusData = getVoteStatusData(
    proposal,
    hasEnded,
    PCT_BASE,
    voidedDecisions
  )

  return {
    ...proposal,
    executionDelayEndDate,
    delegatedVotingEndDate,
    endDate,
    hasEnded,
    isDelayed: hasEnded && executionDelayEndDate > Date.now(),
    statusData,
  }
}
