import BigNumber from './bigNumber'

export function transformProposalData(proposal) {
  return {
    ...proposal,
    requestedAmount: new BigNumber(proposal.requestedAmount),
    id: proposal.number,
  }
}

export function transformConfigData(config) {
  return {
    ...config,
    alpha: new BigNumber(config.decay).div(config.pctBase),
    maxRatio: new BigNumber(config.maxRatio).div(config.pctBase),
    weight: new BigNumber(config.weight).div(config.pctBase),
    pctBase: new BigNumber(config.pctBase),
  }
}
export function getAppAddressByName(apps, appName) {
  return apps?.find(app => app.name === appName).address || ''
}
