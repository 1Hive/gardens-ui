import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3-utils'
import { getDefaultChain } from './local-settings'
import env from './environment'

const RINKEBY_HONEY_POT = '0x635714f986a625439f0f74090c01b306683c81ce'
const RINKEBY_STAGING_HONEY_POT = '0xeac000b64fc11a9ce6d885fe91fb4f9c2359cc21'
const INSTANCE = env('INSTANCE')

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
    defaultEthNode: 'https://rinkeby.eth.aragon.network/',
    honeypot: getRinkebyHoneyPotAddress(INSTANCE),
    arbitrator: '0x5b987b7a303894afd23063b02c5ee39e1f02306e',
    disputeManager: '0x53827b4e3d84d710e45cb1f29af578ab49dbad9d',
    subgraphs: {
      agreement:
        'https://api.thegraph.com/subgraphs/name/1hive/agreement-rinkeby',
    },
    celesteUrl: 'https://celeste-rinkeby.1hive.org',
    ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    legacyNetworkType: 'rinkeby',
  },
  xdai: {
    // TODO: Add Dispute manager and arbitrator addresses, as well as agreement subgraph url
    chainId: 100,
    ensRegistry: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    honeypot: '0xe9869a0bbc8fb8c61b7d81c33fa2ba84871b3b0e',
    ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    legacyNetworkType: 'main',
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
