import { WALLET_CONNECT_BRIDGE_ENDPOINT } from '@/endpoints'
import env from '@/environment'
import { getPreferredChain } from '@/local-settings'

const RINKEBY_ETH_NODE = env('RINKEBY_ETH_NODE')
const GOERLI_ETH_NODE = env('GOERLI_ETH_NODE')
const XDAI_ETH_NODE = env('XDAI_ETH_NODE')
const POLYGON_ETH_NODE = env('POLYGON_ETH_NODE')

type ConnectorProviderType = {
  [key: string]: any
  id: string
  properties: {
    [key: string]: any
    chainId?: number[]
    rpc?: any
    bridge?: string
    pollingInterval?: number
  }
}

export const CONNECTORS: Array<ConnectorProviderType> = [
  {
    id: 'injected',
    properties: {
      chainId: [100, 4, 5, 137, 31337], // add here to handle more injected chains
      rpc: {
        137: POLYGON_ETH_NODE,
        100: XDAI_ETH_NODE,
        4: RINKEBY_ETH_NODE,
        5: GOERLI_ETH_NODE,
      },
    },
  },
  {
    id: 'frame',
    properties: {
      chainId: [100, 4, 5, 137, 31337],
    },
  },
  {
    id: 'walletconnect',
    properties: {
      rpc: {
        137: POLYGON_ETH_NODE,
        100: XDAI_ETH_NODE,
        4: RINKEBY_ETH_NODE,
        5: GOERLI_ETH_NODE,
      },
      bridge: WALLET_CONNECT_BRIDGE_ENDPOINT,
      pollingInterval: 12000,
    },
  },
]

function sanitizeWalletConnect(
  connector: any,
  chainId = getPreferredChain()
): void {
  connector.properties = {
    ...connector.properties,
    rpc: {
      [chainId]: connector.properties.rpc[chainId],
    },
  }
}

export const CONNECTORS_MOBILE = CONNECTORS.filter(
  (connector) => connector.id === 'walletconnect'
)

export const getConnectors = (isMobileView = false) =>
  isMobileView ? CONNECTORS_MOBILE : CONNECTORS

// the final data that we pass to use-wallet package.
export const useWalletConnectors = (isMobileView = false) => {
  return getConnectors(isMobileView).reduce((acc, connector) => {
    if (connector !== null) {
      if (connector.id == 'walletconnect') {
        sanitizeWalletConnect(connector)
      }
      acc = { ...acc, [connector.id]: connector.properties ?? {} }
    }
    return acc
  }, {})
}
