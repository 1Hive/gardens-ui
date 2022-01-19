import { WALLET_CONNECT_BRIDGE_ENDPOINT } from '@/endpoints'
import env from '@/environment'

const PORTIS_ID = env('PORTIS_ID')
const RINKEBY_ETH_NODE = env('RINKEBY_ETH_NODE')
const XDAI_ETH_NODE = env('XDAI_ETH_NODE')
const POLYGON_ETH_NODE = env('POLYGON_ETH_NODE')

export const CONNECTORS = [
  {
    id: 'injected',
    properties: {
      chainId: [100, 4, 137, 31337], // add here to handle more injected chains
    },
  },
  {
    id: 'frame',
    properties: {
      chainId: [100, 4, 137, 31337],
    },
  },
  {
    id: 'walletconnect',
    properties: {
      rpc: {
        137: POLYGON_ETH_NODE,
        100: XDAI_ETH_NODE,
        4: RINKEBY_ETH_NODE,
      },
      bridge: WALLET_CONNECT_BRIDGE_ENDPOINT,
      pollingInterval: 12000,
    },
  },
  PORTIS_ID
    ? {
        id: 'portis',
        properties: {
          dAppId: PORTIS_ID,
          chainId: [100, 4],
        },
      }
    : null,
].filter((p) => p)

export const CONNECTORS_MOBILE = CONNECTORS.filter(
  (p) => p?.id === 'walletconnect'
)

export const getConnectors = (isMobileView = false) =>
  isMobileView ? CONNECTORS_MOBILE : CONNECTORS

// the final data that we pass to use-wallet package.
export const useWalletConnectors = (isMobileView = false) => {
  return getConnectors(isMobileView).reduce((acc, connector) => {
    if (connector !== null) {
      acc = { ...acc, [connector.id]: connector.properties ?? {} }
    }
    return acc
  }, {})
}
