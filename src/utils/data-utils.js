import { convertFromString, ProposalTypes } from '../types'
import BigNumber from '../lib/bigNumber'

export function transformConfigData(config) {
  const { conviction, voting } = config
  return {
    ...config,
    conviction: {
      ...conviction,
      alpha: new BigNumber(conviction.decay).div(conviction.pctBase),
      maxRatio: new BigNumber(conviction.maxRatio).div(conviction.pctBase),
      weight: new BigNumber(conviction.weight).div(conviction.pctBase),
      pctBase: new BigNumber(conviction.pctBase),
      totalStaked: new BigNumber(conviction.totalStaked),
    },
    voting: {
      ...voting,
      supportRequiredPct: new BigNumber(voting.supportRequiredPct),
      minAcceptQuorumPct: new BigNumber(voting.minAcceptQuorumPct),
      durationBlocks: parseInt(voting.durationBlocks, 10),
      bufferBlocks: parseInt(voting.bufferBlocks, 10),
      executionDelayBlocks: parseInt(voting.executionDelayBlocks, 10),
    },
  }
}

export function transformProposalData(proposal, config) {
  return convertFromString(proposal.type) === ProposalTypes.Decision
    ? transformDecisionData(proposal, config)
    : transformConvictionProposalData(proposal)
}

function transformConvictionProposalData(proposal) {
  return {
    ...proposal,
    name: proposal.metadata,
    createdAt: parseInt(proposal.createdAt, 10) * 1000,
    id: proposal.number,
    requestedAmount: new BigNumber(proposal.requestedAmount || 0),
    stakes: proposal.stakes.map(transformStakeData),
    stakesHistory: proposal.stakesHistory.map(transformStakeHistoryData),
    type: convertFromString(proposal.type),
    totalTokensStaked: new BigNumber(proposal.totalTokensStaked || 0),
  }
}

function transformDecisionData(proposal, config) {
  const { voting: votingConfig } = config

  return {
    ...proposal,
    casts: proposal.casts,
    createdAt: parseInt(proposal.createdAt, 10) * 1000,
    creator: proposal.creator,
    endBlock:
      parseInt(proposal.startBlock, 10) +
      parseInt(votingConfig.durationBlocks, 10),
    executionBlock: parseInt(proposal.executionBlock, 10),
    id: proposal.number,
    metadata: proposal.metadata,
    minAcceptQuorum: new BigNumber(proposal.minAcceptQuorum),
    nay: BigNumber(proposal.nay, 10),
    requestedAmount: new BigNumber(proposal.requestedAmount),
    script: proposal.script,
    snapshotBlock: parseInt(proposal.snapshotBlock, 10),
    startBlock: parseInt(proposal.startBlock, 10),
    status: proposal.status,
    supportRequiredPct: BigNumber(proposal.supportRequiredPct),
    type: convertFromString(proposal.type),
    votingPower: BigNumber(proposal.votingPower),
    yea: BigNumber(proposal.yea),
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
