import { isLocalOrUnknownNetwork } from './utils/web3-utils'
import { CONTEXT_ID } from './constants'

export const NODE_URL = 'http:%2f%2fnode.brightid.org'

export const BRIGHT_ID_ENDPOINT_V5 = 'https://brightid.1hive.org/node/v5'
export const BRIGHTID_VERIFICATION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/verifications`
export const BRIGHTID_1HIVE_INFO_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/apps/1hive`
export const BRIGHTID_SUBSCRIPTION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/operations`

export const BRIGHT_ID_APP_DEEPLINK = `brightid://link-verification/${NODE_URL}/${CONTEXT_ID}`

export const UTC_API_ENDPOINT = `http://worldclockapi.com/api/json/utc/now`

// IPFS endpoint
export const IPFS_ENDPOINT = {
  read: isLocalOrUnknownNetwork()
    ? 'http://127.0.0.1:8080/ipfs'
    : 'https://ipfs.io/ipfs/',
  upload: 'https://ipfs.infura.io:5001/api/v0/add',
}

export const GITHUB_ENDPOINT = 'https://github.com/'
export const TWITTER_ENDPOINT = 'https://twitter.com/'

export const HONEYSWAP_TRADE_HONEY =
  'https://app.honeyswap.org/#/swap?outputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9'
