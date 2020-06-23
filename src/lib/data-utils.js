import BigNumber from './bigNumber'

export function transformConfigData(config) {
  return {
    ...config,
    alpha: new BigNumber(config.decay).div(config.pctBase),
    maxRatio: new BigNumber(config.maxRatio).div(config.pctBase),
    weight: new BigNumber(config.weight).div(config.pctBase),
    pctBase: new BigNumber(config.pctBase),
  }
}

export function transformProposalData(proposal) {
  return {
    ...proposal,
    requestedAmount: new BigNumber(proposal.requestedAmount),
    id: proposal.number,
    stakes: proposal.stakes.map(({ amount, ...stake }) => ({
      ...stake,
      amount: new BigNumber(amount),
    })),
  }
}

export function transformStakeHistoryData(stake) {
  return {
    ...stake,
    tokensStaked: BigNumber(stake.tokensStaked),
    totalTokensStaked: BigNumber(stake.totalTokensStaked),
    conviction: BigNumber(stake.conviction),
  }
}

export function getAppAddressByName(apps, appName) {
  return apps?.find(app => app.name === appName).address || ''
}
