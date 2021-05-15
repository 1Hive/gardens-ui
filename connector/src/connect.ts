
import { Organization } from '@aragon/connect-core'
import HoneyPot from './models/Honeypot'
import HoneyPotConnectorTheGraph, {
  pollIntervalFromChainId,
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  subgraphUrl: string
  pollInterval?: number
}

export default function connectHoneypot(organization: Organization, config?: Config) {
  const { network, orgConnector } = organization.connection

  const subgraphUrl =
    config?.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

  let pollInterval
  if (orgConnector.name === 'thegraph') {
    pollInterval = 
      config?.pollInterval ?? pollIntervalFromChainId(network.chainId) ??  orgConnector.config?.pollInterval ?? undefined
  }

  const HoneyPotConnector = new HoneyPotConnectorTheGraph({
    pollInterval,
    subgraphUrl,
  })

  return new HoneyPot(HoneyPotConnector, organization.address)
}
