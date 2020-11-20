import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useBlockTime, useLatestBlock } from './useBlock'
import { useAccountStakes } from './useStakes'
import { useAppState } from '../providers/AppState'
import useProposalFilters from './useProposalFilters'
import {
  useProposalSubscription,
  useProposalsSubscription,
  useSupporterSubscription,
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
import { getProposalSupportStatus } from '../utils/proposal-utils'
import { getDecisionTransition } from '../utils/vote-utils'
import { ProposalTypes } from '../types'
import {
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
        ? processDecision(proposal, latestBlock, blockTime)
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

        let statusFilterPassed = true
        if (proposal.type === ProposalTypes.Decision) {
          statusFilterPassed = testStatusFilter(filters.status.filter, proposal)
        }

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
      ? processDecision(proposal, latestBlock, blockTime)
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

  return {
    ...proposal,
    convictionTrend,
    currentConviction,
    endDate,
    futureConviction,
    futureStakedConviction,
    maxConviction,
    minTokensNeeded,
    neededConviction,
    neededTokens,
    stakedConviction,
    threshold,
    userConviction,
    userStakedConviction,
  }
}

function processDecision(proposal, latestBlock, blockTime) {
  return {
    ...proposal,
    data: {
      ...proposal.data,
      ...getDecisionTransition(proposal, latestBlock, blockTime), // TODO: Merge with proposal.status
    },
  }
}
