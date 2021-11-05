import env from '@/environment'

const PORTIS_ID = env('PORTIS_ID')

export const connectors = [
  {
    id: 'injected',
    properties: {
      chainId: [100, 4, 137, 80001, 31337], // add here to handle more injected chains
    },
  },
  {
    id: 'frame',
    properties: {
      chainId: [100, 4, 137, 80001, 31337],
    },
  },
  {
    id: 'walletconnect',
    properties: {
      rpc: {
        100: 'https://mainnet.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
        4: 'https://rinkeby.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
      },
      bridge: 'https://walletconnect-relay.minerva.digital',
      pollingInterval: 12000,
    },
  },
  PORTIS_ID
    ? {
        id: 'portis',
        properties: {
          dAppId: PORTIS_ID,
          chainId: [100, 4, 137, 80001],
        },
      }
    : null,
].filter(p => p)

// the final data that we pass to use-wallet package.
export const useWalletConnectors = connectors.reduce((current, connector) => {
  current[connector.id] = connector.properties || {}
  return current
}, {})
