import { isLocalOrUnknownNetwork } from './lib/web3-utils'

// IPFS endpoint
export const IPFS_ENDPOINT = {
  read: isLocalOrUnknownNetwork()
    ? 'http://127.0.0.1:8080/ipfs'
    : 'https://ipfs.eth.aragon.network/ipfs',
  upload: 'https://ipfs.infura.io:5001/api/v0/add',
}

export const GITHUB_ENDPOINT = 'https://github.com/'
export const TWITTER_ENDPOINT = 'https://twitter.com/'

export const HONEYSWAP_TRADE_HONEY =
  'https://honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9'
