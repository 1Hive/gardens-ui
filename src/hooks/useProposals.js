import { useEffect, useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useBlockTime, useLatestBlock } from './useBlock'
import { useAccountStakes } from './useStakes'
import { useAppState } from '../providers/AppState'
import useProposalFilters, {
  INITIAL_PROPOSAL_COUNT,
} from './useProposalFilters'
import {
  useProposalSubscription,
  useProposalsSubscription,
} from './useSubscriptions'
import { useWallet } from '../providers/Wallet'

import {
  calculateThreshold,
  getCurrentConviction,
  getCurrentConvictionByEntity,
  getConvictionTrend,
  getMaxConviction,
  getMinNeededStake,
  getRemainingTimeToPass,
} from '../lib/conviction'
import { testStatusFilter, testSupportFilter } from '../utils/filter-utils'
import {
  getProposalStatusData,
  getProposalSupportStatus,
  hasProposalEnded,
} from '../utils/proposal-utils'
import {
  getVoteEndDate,
  getVoteStatus,
  hasVoteEnded,
} from '../utils/vote-utils'
import { ProposalTypes } from '../types'
import { PCT_BASE } from '../constants'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useProposals() {
  const { account } = useWallet()

  const latestBlock = useLatestBlock()

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
  const blockTime = useBlockTime()
  const myStakes = useAccountStakes(account)
  const proposals = useProposalsSubscription(filters)
  const { config, effectiveSupply, isLoading, vaultBalance } = useAppState()

  // Proposals already come filtered by Type from the subgraph.
  // We will filter locally by support filter and also for Decision proposals, we will filter by status
  // because decisions are technically closed if the executionBlock has passed.
  const proposalsWithData = useMemo(() => {
    if (isLoading) {
      return proposals
    }

    return proposals.map(proposal =>
      proposal.type === ProposalTypes.Decision
        ? processDecision(proposal)
        : processProposal(
            proposal,
            latestBlock,
            blockTime,
            effectiveSupply,
            vaultBalance,
            account,
            config?.conviction
          )
    )
  }, [
    account,
    blockTime,
    config,
    effectiveSupply,
    isLoading,
    latestBlock,
    proposals,
    vaultBalance,
  ])

  const filteredProposals = useMemo(
    () =>
      proposalsWithData?.filter(proposal => {
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
    [filters, myStakes, proposalsWithData]
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
  const latestBlock = useLatestBlock()
  const blockTime = useBlockTime()
  const { config, effectiveSupply, isLoading, vaultBalance } = useAppState()

  const blockHasLoaded = latestBlock.number !== 0

  if (isLoading || !proposal) {
    return [null, blockHasLoaded]
  }

  const proposalWithData =
    proposal.type === ProposalTypes.Decision
      ? processDecision(proposal)
      : processProposal(
          proposal,
          latestBlock,
          blockTime,
          effectiveSupply,
          vaultBalance,
          account,
          config?.conviction
        )

  return [proposalWithData, blockHasLoaded, loadingProposal]
}

function processProposal(
  proposal,
  latestBlock,
  blockTime,
  effectiveSupply,
  vaultBalance,
  account,
  config
) {
  const { alpha, maxRatio, weight } = config || {}
  const { requestedAmount, stakesHistory, totalTokensStaked } = proposal

  let endDate
  let minTokensNeeded = null
  let neededConviction = null
  let neededTokens = null
  let remainingBlocksToPass = null
  let threshold = null

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

  const userStakedConviction = userConviction.div(maxConviction)

  const stakedConviction = currentConviction.div(maxConviction)
  const futureConviction = getMaxConviction(totalTokensStaked, alpha)
  const futureStakedConviction = futureConviction.div(maxConviction)
  const convictionTrend = getConvictionTrend(
    stakesHistory,
    maxConviction,
    latestBlock.number,
    alpha,
    TIME_UNIT
  )

  // Funding proposal needed values
  if (requestedAmount.gt(0)) {
    threshold = calculateThreshold(
      requestedAmount,
      vaultBalance || new BigNumber('0'),
      effectiveSupply || new BigNumber('0'),
      alpha,
      maxRatio,
      weight
    )

    neededConviction = threshold?.div(maxConviction)
    minTokensNeeded = getMinNeededStake(threshold, alpha)
    neededTokens = minTokensNeeded.minus(totalTokensStaked)
    remainingBlocksToPass = getRemainingTimeToPass(
      threshold,
      currentConviction,
      totalTokensStaked,
      alpha
    )

    if (!Number.isNaN(remainingBlocksToPass) && remainingBlocksToPass > 0) {
      const latestBlockTimestampMs = latestBlock.timestamp * 1000
      const blockTimeInMs = blockTime * 1000
      endDate = new Date(
        latestBlockTimestampMs + remainingBlocksToPass * blockTimeInMs
      )
    }
  }

  const hasEnded = hasProposalEnded(proposal.status, proposal.challengeEndDate)
  const statusData = getProposalStatusData(proposal)

  return {
    ...proposal,
    convictionTrend,
    currentConviction,
    endDate,
    futureConviction,
    futureStakedConviction,
    hasEnded,
    maxConviction,
    minTokensNeeded,
    neededConviction,
    neededTokens,
    stakedConviction,
    statusData,
    threshold,
    userConviction,
    userStakedConviction,
  }
}

function processDecision(proposal) {
  const endDate = getVoteEndDate(proposal)
  const hasEnded = hasVoteEnded(
    proposal.status,
    endDate,
    proposal.challengeEndDate
  )
  const voteStatus = getVoteStatus(proposal, hasEnded, PCT_BASE)

  return {
    ...proposal,
    endDate,
    hasEnded,
    voteStatus,
  }
}
