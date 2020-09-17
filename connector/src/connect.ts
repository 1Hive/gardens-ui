
import HonyePot from './models/Honeypot'
import HoneyPotConnectorTheGraph, {
  pollIntervalFromChainId,
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
  pollInterval?: number
}

export default function connectHoneypot(organization: any, config:  Config) {
  const { network, orgConnector } = organization.location

  const subgraphUrl =
    config.subgraphUrl ?? subgraphUrlFromChainId(network.chainId)

  let pollInterval
  if (orgConnector.name === 'thegraph') {
    pollInterval = 
      config?.pollInterval ?? pollIntervalFromChainId(network.chainId) ??  orgConnector.config?.pollInterval ?? undefined
  }

  const HoneyPotConnector = new HoneyPotConnectorTheGraph({
    pollInterval,
    subgraphUrl,
  })

  return new HonyePot(HoneyPotConnector, organization.address)
}
