import {
  getNetworkType,
  isLocalOrUnknownNetwork,
  getNetworkName,
} from '@utils/web3-utils'
import { getPreferredChain } from './local-settings'
import { DEFAULT_CHAIN_ID } from './constants'
import env from './environment'

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

function getNetworkInternalName(chainId = getPreferredChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId)
}

export function getNetwork(chainId = DEFAULT_CHAIN_ID) {
  return networks[getNetworkInternalName(chainId)]
}

export function getAvailableNetworks() {
  return Object.entries(networks).map(([key, { chainId, name, type }]) => ({
    chainId,
    name,
    type,
  }))
}

export function getAgreementConnectorConfig(chainId) {
  const agreementSubgraph = getNetwork(chainId).subgraphs?.agreement
  return {
    agreement: agreementSubgraph && [
      'thegraph',
      { subgraphUrl: agreementSubgraph },
    ],
  }
}

export const SUPPORTED_CHAINS = [4, 100] // Add  polygon and arbitrum  chains id + fill the network json with the data

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAINS.includes(chainId)
}

export function getSupportedChainsNamesFormatted() {
  let networkNames = ''
  SUPPORTED_CHAINS.forEach((chain, i, array) => {
    networkNames += getNetworkName(chain)
    if (i !== array.length - 1) {
      networkNames += ', '
    }
  })
  return networkNames
}
