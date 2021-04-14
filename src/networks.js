import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3-utils'
import { getDefaultChain } from './local-settings'
import env from './environment'

const RINKEBY_HONEY_POT = '0x7777cd7c9c6d3537244871ac8e73b3cb9710d45a'
const RINKEBY_STAGING_HONEY_POT = '0xeac000b64fc11a9ce6d885fe91fb4f9c2359cc21'
const INSTANCE = env('INSTANCE')
const ETH_NODE = env('ETH_NODE')

const networks = {
  mainnet: {
    chainId: 1,
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    name: 'Mainnet',
    type: 'main',
  },
  rinkeby: {
    chainId: 4,
    ensRegistry: '0x98df287b6c145399aaa709692c8d308357bc085d',
    name: 'Rinkeby',
    type: 'rinkeby',
    defaultEthNode: ETH_NODE,
    honeypot: getRinkebyHoneyPotAddress(INSTANCE),
    arbitrator: '0x35e7433141D5f7f2EB7081186f5284dCDD2ccacE',
    disputeManager: '0xc1f1c30878de30fd3ac3db7eacdd33a70c7110bd',
    subgraphs: {
      agreement:
        'https://api.thegraph.com/subgraphs/name/1hive/agreement-rinkeby',
      celeste: 'https://api.thegraph.com/subgraphs/name/1hive/celeste-rinkeby',
    },
    celesteUrl: 'https://celeste-rinkeby.1hive.org/#',
    legacyNetworkType: 'rinkeby',
    explorer: 'etherscan',
  },
  xdai: {
    chainId: 100,
    ensRegistry: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    honeypot: '0x8ccbeab14b5ac4a431fffc39f4bec4089020a155',
    arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
    disputeManager: '0xec7904e20b69f60966d6c6b9dc534355614dd922',
    subgraphs: {
      agreement: 'https://api.thegraph.com/subgraphs/name/1hive/agreement-xdai',
      celeste: 'https://api.thegraph.com/subgraphs/name/1hive/celeste',
    },
    celesteUrl: 'https://celeste.1hive.org/#',
    legacyNetworkType: 'main',
    explorer: 'blockscout',
  },
}

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId)
}

export function getNetwork(chainId = getDefaultChain()) {
  return networks[getNetworkInternalName(chainId)]
}

export function getAvailableNetworks() {
  return Object.entries(networks).map(([key, { chainId, name, type }]) => ({
    chainId,
    name,
    type,
  }))
}

function getRinkebyHoneyPotAddress(rinkebyInstance) {
  if (rinkebyInstance === 'staging') {
    return RINKEBY_STAGING_HONEY_POT
  }
  return RINKEBY_HONEY_POT
}

const agreementSubgraph = getNetwork().subgraphs?.agreement

export const connectorConfig = {
  agreement: agreementSubgraph && [
    'thegraph',
    { subgraphUrl: agreementSubgraph },
  ],
}
