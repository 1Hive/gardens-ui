import { isLocalOrUnknownNetwork } from './lib/web3-utils'

// IPFS endpoint
export const IPFS_ENDPOINT = isLocalOrUnknownNetwork()
  ? 'http://127.0.0.1:8080/ipfs'
  : 'https://ipfs.eth.aragon.network/ipfs'

export const GITHUB_ENDPOINT = 'https://github.com/'
export const TWITTER_ENDPOINT = 'https://twitter.com/'

export const UPLOAD_IPFS_ENDPOINT = 'https://ipfs.infura.io:5001/api/v0/add'
