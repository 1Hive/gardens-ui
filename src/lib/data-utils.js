import { convertFromString } from '../types'
import BigNumber from './bigNumber'

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

export function transformProposalData(proposal) {
  // TODO: transform casts
  return {
    ...proposal,
    createdAt: parseInt(proposal.createdAt, 10) * 1000,
    id: proposal.number,
    requestedAmount: new BigNumber(proposal.requestedAmount),
    stakes: proposal.stakes.map(transformStakeData),
    stakesHistory: proposal.stakesHistory.map(transformStakeHistoryData),
    type: convertFromString(proposal.type),
    totalTokensStaked: new BigNumber(proposal.totalTokensStaked),
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
          id: stake.proposal.number,
          type: convertFromString(stake.proposal.type),
        }
      : null,
  }
}

export function getAppAddressByName(apps, appName) {
  return apps?.find(app => app.name === appName)?.address || ''
}
