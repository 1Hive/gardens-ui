import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useBlockTime, useLatestBlock } from './useBlock'
import { useAccountStakes } from './useStakes'
import { useAppState } from '../providers/AppState'
import useProposalFilters from './useProposalFilters'
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
import { getProposalSupportStatus } from '../lib/proposal-utils'
import { getDecisionTransition } from '../lib/vote-utils'
import { ProposalTypes } from '../types'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useProposals() {
  const { account } = useWallet()
  const { config, effectiveSupply, isLoading, vaultBalance } = useAppState()

  const blockTime = useBlockTime()
  const latestBlock = useLatestBlock()

  const filters = useProposalFilters()
  const proposals = useFilteredProposals(filters, account)

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

  // Hotfix: TODO: Move to filtered proposals hook
  const filteredProposals = proposalsWithData.filter(proposal => {
    if (proposal.type === ProposalTypes.Decision) {
      return testStatusFilter(filters.status.filter, proposal)
    }

    return true
  })

  return [filteredProposals, filters, latestBlock.number !== 0]
}

function useFilteredProposals(filters, account) {
  const myStakes = useAccountStakes(account)
  // Proposals already come filtered by Status and Type from the subgraph.
  // We will filter locally by support filter.
  const proposals = useProposalsSubscription(filters)

  return useMemo(
    () =>
      proposals?.filter(proposal => {
        const proposalSupportStatus = getProposalSupportStatus(
          myStakes,
          proposal
        )
        return testSupportFilter(filters.support.filter, proposalSupportStatus)
      }),
    [filters, myStakes, proposals]
  )
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
