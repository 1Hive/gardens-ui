import { isLocalOrUnknownNetwork } from './lib/web3-utils'

export const BRIGHT_ID_ENDPOINT_V5 = 'https://app.brightid.org/node/v5'
export const BRIGHTID_VERIFICATION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/verifications`
export const BRIGHTID_1HIVE_INFO_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/apps/1hive`

// IPFS endpoint
export const IPFS_ENDPOINT = {
  read: isLocalOrUnknownNetwork()
    ? 'http://127.0.0.1:8080/ipfs'
    : 'https://ipfs.eth.aragon.network/ipfs',
  upload: 'https://ipfs.infura.io:5001/api/v0/add',
}

export const GITHUB_ENDPOINT = 'https://github.com/'
export const TWITTER_ENDPOINT = 'https://twitter.com/'
