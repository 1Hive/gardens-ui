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
  useSupporterSubscription,
} from './useSubscriptions'
import useRequestAmount from './useRequestAmount'
import { useWallet } from '../providers/Wallet'

import {
  getCurrentConviction,
  getCurrentConvictionByEntity,
  getConvictionTrend,
  getMaxConviction,
  calculateThreshold,
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
  getVoteStatusData,
  hasVoteEnded,
} from '../utils/vote-utils'
import { ProposalTypes } from '../types'
import {
  PCT_BASE,
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
} from '../constants'

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
  const myStakes = useAccountStakes(account)
  const proposals = useProposalsSubscription(filters)
  const { config, effectiveSupply, isLoading } = useAppState()

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
            effectiveSupply,
            account,
            config?.conviction
          )
    )
  }, [account, config, effectiveSupply, isLoading, latestBlock, proposals])

  const filteredProposals = useMemo(
    () =>
      isLoading
        ? proposalsWithData
        : proposalsWithData?.filter(proposal => {
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
    [filters, isLoading, myStakes, proposalsWithData]
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
  const { config, effectiveSupply, isLoading } = useAppState()

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
          effectiveSupply,
          account,
          config?.conviction
        )

  return [proposalWithData, blockHasLoaded, loadingProposal]
}

export function useProposalWithThreshold(proposal) {
  const {
    config,
    effectiveSupply,
    requestToken,
    stableToken,
    vaultBalance,
  } = useAppState()
  const { alpha, maxRatio, weight } = config.conviction || {}
  const { requestedAmount, totalTokensStaked, stable, type } = proposal

  const [requestAmount, loadingRequestAmount] = useRequestAmount(
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
      vaultBalance || new BigNumber('0'),
      effectiveSupply || new BigNumber('0'),
      alpha,
      maxRatio,
      weight
    )

    neededConviction = threshold?.div(proposal.maxConviction)
    minTokensNeeded = getMinNeededStake(threshold, alpha)
    neededTokens = minTokensNeeded.minus(totalTokensStaked)
    remainingBlocksToPass = getRemainingTimeToPass(
      threshold,
      proposal.currentConviction,
      totalTokensStaked,
      alpha
    )
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
  const blockTime = useBlockTime()
  const latestBlock = useLatestBlock()
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

export function useInactiveProposalsWithStake() {
  const { account } = useWallet()
  const { honeypot } = useAppState()

  const supporter = useSupporterSubscription(honeypot, account)

  if (!supporter || !supporter.stakes) {
    return []
  }
  const inactiveStakes = supporter.stakes.filter(stake => {
    return (
      stake.proposal.type !== ProposalTypes.Decision &&
      (stake.proposal.status === PROPOSAL_STATUS_CANCELLED_STRING ||
        stake.proposal.status === PROPOSAL_STATUS_EXECUTED_STRING) &&
      stake.amount.gt(0)
    )
  })

  return inactiveStakes
}

function processProposal(
  proposal,
  latestBlock,
  effectiveSupply,
  account,
  config
) {
  const { alpha } = config || {}
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

function processDecision(proposal) {
  const endDate = getVoteEndDate(proposal)
  const hasEnded = hasVoteEnded(
    proposal.status,
    endDate,
    proposal.challengeEndDate
  )
  const statusData = getVoteStatusData(proposal, hasEnded, PCT_BASE)

  return {
    ...proposal,
    endDate,
    hasEnded,
    statusData,
  }
}
