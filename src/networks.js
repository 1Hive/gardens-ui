import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3-utils'
import { getDefaultChain } from './local-settings'
import env from './environment'

const RINKEBY_HONEY_POT = '0x512385375f087251667963e3cb8185e49597f2be'
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
  },
  xdai: {
    chainId: 100,
    ensRegistry: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    honeypot: '0xe9869a0bbc8fb8c61b7d81c33fa2ba84871b3b0e',
    ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
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
