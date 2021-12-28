import { isLocalOrUnknownNetwork } from '@utils/web3-utils'

import { CONTEXT_ID } from './constants'

export const NODE_URL = 'http:%2f%2fnode.brightid.org'

export const BRIGHT_ID_ENDPOINT_V5 = 'https://app.brightid.org/node/v5'
export const BRIGHTID_VERIFICATION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/verifications`
export const BRIGHTID_1HIVE_INFO_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/apps/1hive`
export const BRIGHTID_SUBSCRIPTION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/operations`

export const BRIGHT_ID_APP_DEEPLINK = `brightid://link-verification/${NODE_URL}/${CONTEXT_ID}`

export const UTC_API_ENDPOINT = `http://worldclockapi.com/api/json/utc/now`

export const WALLET_CONNECT_BRIDGE_ENDPOINT =
  'https://walletconnect-relay.minerva.digital'

// IPFS endpoint
export const IPFS_ENDPOINT = {
  read: isLocalOrUnknownNetwork()
    ? 'http://127.0.0.1:8080/ipfs'
    : 'https://ipfs.io/ipfs/',
  upload: 'https://ipfs.infura.io:5001/api/v0/add',
}

export const GITHUB_ENDPOINT = 'https://github.com/'
export const TWITTER_ENDPOINT = 'https://twitter.com/'

export const CELESTE_URL = 'https://celeste.1hive.org/#'

export const getDexTradeTokenUrl = (chainId, tokenAddress) => {
  switch (chainId) {
    case 4:
      return `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}`
    case 100:
      return `https://app.honeyswap.org/#/swap?outputCurrency=${tokenAddress}`
    case 137:
      return `https://app.sushi.com/swap?outputCurrency=${tokenAddress}`
  }
}
