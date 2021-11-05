import xDaiLogo from '@assets/xdai-logo.svg'
import { getNetworkType } from '@utils/web3-utils'
import { getDefaultChain } from './local-settings'
import env from './environment'

const ETH_NODE = env('ETH_NODE')

const networks = {
  rinkeby: {
    chainId: 4,
    ensRegistry: '0x98df287b6c145399aaa709692c8d308357bc085d',
    name: 'Rinkeby',
    type: 'rinkeby',
    arbitrator: '0x35e7433141D5f7f2EB7081186f5284dCDD2ccacE',
    disputeManager: '0xc1f1c30878de30fd3ac3db7eacdd33a70c7110bd',
    template: '0xa8e6c20e8ad85836c8ee7b6c8decae75967b580e',
    celesteUrl: 'https://celeste-rinkeby.1hive.org/#',
    explorer: 'etherscan',
    honeyToken: '0x3050e20fabe19f8576865811c9f28e85b96fa4f9',
    honeyPriceOracle: '0xa87f58dbbe3a4d01d7f776e02b4dd3237f598095',
    stableToken: '0x531eab8bb6a2359fe52ca5d308d85776549a0af9',
    subgraphs: {
      agreement:
        'https://api.thegraph.com/subgraphs/name/1hive/agreement-rinkeby',
      celeste: 'https://api.thegraph.com/subgraphs/name/1hive/celeste-rinkeby',
      organizations:
        'https://api.thegraph.com/subgraphs/name/1hive/aragon-rinkeby',
    },
    legacyNetworkType: 'rinkeby',
  },
  xdai: {
    chainId: 100,
    ensRegistry: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    name: 'xDai',
    type: 'xdai',
    image: xDaiLogo,
    defaultEthNode: ETH_NODE,
    arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
    disputeManager: '0xec7904e20b69f60966d6c6b9dc534355614dd922',
    template: '0x5507A6365C47d5b201Af3c1CB18C7fD4a889321b',
    celesteUrl: 'https://celeste.1hive.org/#',
    explorer: 'blockscout',
    honeyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
    honeyPriceOracle: '0x6f38d112b13eda1e3abafc61e296be2e27f15071',
    stableToken: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    subgraphs: {
      agreement: 'https://api.thegraph.com/subgraphs/name/1hive/agreement-xdai',
      celeste: 'https://api.thegraph.com/subgraphs/name/1hive/celeste',
      organizations:
        'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai',
    },
    eip3085: {
      chainId: '0x64',
      chainName: 'xDai',
      rpcUrls: ['https://rpc.xdaichain.com/'],
      iconUrls: [
        'https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png',
      ],
      nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
      blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
    },
  },
}

function getNetworkInternalName(chainId = getDefaultChain()) {
  return getNetworkType(chainId)
}

export function getEthersNetwork() {
  const { type, chainId, ensRegistry } = getNetwork()
  return {
    name: type,
    chainId: chainId,
    ensAddress: ensRegistry,
  }
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

export const switchNetwork = async () => {
  const { chainId } = getNetwork()
  try {
    await window?.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to Injected provider.
    if (switchError.code === 4902) {
      try {
        await addEthereumChain()
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
    // TODO: handle errors
  }
}

export const addEthereumChain = () => {
  const { eip3085 } = getNetwork()
  if (!eip3085) {
    return Promise.resolve(null) // Network is not custom
  }
  return window?.ethereum?.request({
    method: 'wallet_addEthereumChain',
    params: [eip3085],
  })
}

const agreementSubgraph = getNetwork().subgraphs?.agreement

export const connectorConfig = {
  agreement: agreementSubgraph && [
    'thegraph',
    { subgraphUrl: agreementSubgraph },
  ],
}
