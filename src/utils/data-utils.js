import { convertFromString, ProposalTypes } from '../types'
import BigNumber from '../lib/bigNumber'
import { toMilliseconds } from './date-utils'

export function transformConfigData(config) {
  const { conviction, voting } = config
  return {
    ...config,
    conviction: {
      ...conviction,
      id: conviction.id.slice(0, 42),
      alpha: new BigNumber(conviction.decay).div(conviction.pctBase),
      maxRatio: new BigNumber(conviction.maxRatio).div(conviction.pctBase),
      weight: new BigNumber(conviction.weight).div(conviction.pctBase),
      pctBase: new BigNumber(conviction.pctBase),
      totalStaked: new BigNumber(conviction.totalStaked),
    },
    voting: {
      ...voting,
      id: voting.id.slice(0, 42),
      voteTime: toMilliseconds(voting.voteTime),
      supportRequiredPct: new BigNumber(voting.supportRequiredPct),
      minAcceptQuorumPct: new BigNumber(voting.minimumAcceptanceQuorumPct),
      delegatedVotingPeriod: toMilliseconds(voting.delegatedVotingPeriod),
      quietEndingPeriod: toMilliseconds(voting.quietEndingPeriod),
      quietEndingExtension: toMilliseconds(voting.quietEndingExtension),
      executionDelay: toMilliseconds(voting.executionDelay),
      createdAt: toMilliseconds(voting.createdAt),
    },
  }
}

export async function transformProposalData(proposal) {
  const proposalData = {
    ...proposal,
    id: proposal.number,
    createdAt: toMilliseconds(proposal.createdAt),
    executedAt: toMilliseconds(proposal.executedAt),
    type: convertFromString(proposal.type),

    challengeEndDate: toMilliseconds(proposal.challengeEndDate),
    settledAt: toMilliseconds(proposal.settledAt),
    settlementOffer: proposal.settlementOffer
      ? new BigNumber(proposal.settlementOffer)
      : null,
    disputedAt: toMilliseconds(proposal.disputedAt),
    pausedAt: toMilliseconds(proposal.pausedAt),
    pauseDuration: toMilliseconds(proposal.pauseDuration),
  }

  const collateralRequirement = await proposal.collateralRequirement()
  const submitterArbitratorFee = await proposal.submitterArbitratorFee()
  const challengerArbitratorFee = await proposal.challengerArbitratorFee()

  return {
    ...proposalData,
    collateralRequirement: collateralRequirement
      ? {
          ...collateralRequirement,
          actionAmount: new BigNumber(collateralRequirement.actionAmount),
          challengeAmount: new BigNumber(collateralRequirement.challengeAmount),
        }
      : null,
    submitterArbitratorFee: submitterArbitratorFee
      ? {
          ...submitterArbitratorFee,
          amount: new BigNumber(submitterArbitratorFee.amount),
        }
      : null,
    challengerArbitratorFee: challengerArbitratorFee
      ? {
          ...challengerArbitratorFee,
          amount: new BigNumber(challengerArbitratorFee.amount),
        }
      : null,
    ...(convertFromString(proposal.type) === ProposalTypes.Decision
      ? transformDecisionData(proposal)
      : transformConvictionProposalData(proposal)),
  }
}

function transformConvictionProposalData(proposal) {
  return {
    name: proposal.metadata,
    requestedAmount: new BigNumber(proposal.requestedAmount || 0),
    stakes: proposal.stakes.map(transformStakeData),
    stakesHistory: proposal.stakesHistory.map(transformStakeHistoryData),
    totalTokensStaked: new BigNumber(proposal.totalTokensStaked || 0),
  }
}

function transformDecisionData(proposal) {
  return {
    nay: BigNumber(proposal.nays),
    startDate: toMilliseconds(proposal.startDate),
    supportRequiredPct: BigNumber(proposal.setting.supportRequiredPct),
    votingPower: BigNumber(proposal.totalPower),
    yea: BigNumber(proposal.yeas),
    quietEndingExtensionDuration: toMilliseconds(
      proposal.quietEndingExtensionDuration
    ),
    voteTime: toMilliseconds(proposal.setting.voteTime),
    minAcceptQuorum: BigNumber(proposal.setting.minimumAcceptanceQuorumPct),
    delegatedVotingPeriod: toMilliseconds(
      proposal.setting.delegatedVotingPeriod
    ),
    quietEndingPeriod: toMilliseconds(proposal.setting.quietEndingPeriod),
    quietEndingExtension: toMilliseconds(proposal.setting.quietEndingExtension),
    executionDelay: toMilliseconds(proposal.setting.executionDelay),
  }
}

export function transformSupporterData(supporter) {
  // TODO: transform casts
  return {
    ...supporter,
    stakes: supporter.stakes.map(transformStakeData),
    stakesHistory: supporter.stakesHistory.map(transformStakeHistoryData),
  }
}

function transformStakeData(stake) {
  return {
    ...stake,
    amount: new BigNumber(stake.amount),
    createdAt: parseInt(stake.createdAt, 10) * 1000,
    proposal: stake.proposal
      ? {
          ...stake.proposal,
          name: stake.proposal.metadata,
          id: stake.proposal.number,
          type: convertFromString(stake.proposal.type),
        }
      : null,
  }
}

function transformStakeHistoryData(stake) {
  return {
    ...stake,
    conviction: BigNumber(stake.conviction),
    createdAt: parseInt(stake.createdAt, 10) * 1000,
    tokensStaked: BigNumber(stake.tokensStaked),
    totalTokensStaked: BigNumber(stake.totalTokensStaked),
    proposal: stake.proposal
      ? {
          ...stake.proposal,
          name: stake.proposal.metadata,
          id: stake.proposal.number,
          type: convertFromString(stake.proposal.type),
        }
      : null,
  }
}

export function getAppAddressByName(apps, appName) {
  return apps?.find(app => app.name === appName)?.address || ''
}

export function getAppByName(apps, appName) {
  return apps?.find(app => app.name === appName)
}
